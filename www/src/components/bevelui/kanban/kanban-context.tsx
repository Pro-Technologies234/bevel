import * as React from "react";
import {
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragOverEvent,
  type DragEndEvent,
  MeasuringStrategy,
  DndContext,
  closestCorners,
} from "@dnd-kit/core";
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";
import {
  findCard,
  findCardColumn,
  moveCardWithinColumn,
  moveCardBetweenColumns,
  reorderColumns,
} from "./kanban-engine";
import type {
  KanbanCardBase,
  KanbanColumnBase,
  KanbanContextValue,
  CardRenderMeta,
  ColumnRenderMeta,
  DragType,
} from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const KanbanCtx = React.createContext<KanbanContextValue<
  any,
  any
> | null>(null);

export function useKanban<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard> = KanbanColumnBase<TCard>,
>(): KanbanContextValue<TCard, TColumn> {
  const ctx = React.useContext(KanbanCtx);
  if (!ctx) throw new Error("useKanban must be used inside KanbanRoot");
  return ctx as KanbanContextValue<TCard, TColumn>;
}

export interface KanbanProviderProps<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard> = KanbanColumnBase<TCard>,
> {
  columns: TColumn[];
  /**
   * Called once per drag-end with the full updated columns array.
   * Use this to persist state.
   */
  onColumnsChange?: (columns: TColumn[]) => void;
  /**
   * Granular callback — called when a card moves column or position.
   * Card's new index is its position in the destination column.
   */
  onCardMove?: (
    card: TCard,
    fromColumnId: string,
    toColumnId: string,
    toIndex: number,
  ) => void;
  /** Called when columns are reordered. */
  onColumnReorder?: (fromIndex: number, toIndex: number) => void;

  /**
   * Render the card content. Receives the card, its column, and drag meta.
   * Used in the column list AND in the DragOverlay ghost.
   */
  renderCard: (
    card: TCard,
    column: TColumn,
    meta: CardRenderMeta,
  ) => React.ReactNode;
  /**
   * Render the column header. Also acts as the drag handle for column reordering.
   * Default: a simple title row.
   */
  renderColumnHeader?: (
    column: TColumn,
    meta: ColumnRenderMeta,
  ) => React.ReactNode;
  /**
   * Render the column footer — typically an "Add card" button.
   * Rendered below the card list.
   */
  renderColumnFooter?: (
    column: TColumn,
    meta: ColumnRenderMeta,
  ) => React.ReactNode;
  /**
   * Render content when a column has no cards.
   * Default: a dashed empty-drop zone.
   */
  renderEmptyColumn?: (column: TColumn) => React.ReactNode;
  children: React.ReactNode;
}

export function KanbanProvider<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard> = KanbanColumnBase<TCard>,
>({
  columns: columnsProp,
  onColumnsChange,
  onCardMove,
  onColumnReorder,
  renderCard,
  renderColumnHeader,
  renderColumnFooter,
  renderEmptyColumn,
  children,
}: KanbanProviderProps<TCard, TColumn>) {
  const [dragColumns, setDragColumns] = React.useState<TColumn[]>(columnsProp);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const [activeType, setActiveType] = React.useState<DragType | null>(null);

  // Refs for rollback and cross-event tracking
  const snapshotRef = React.useRef<TColumn[]>(columnsProp);
  const activeCardColumnRef = React.useRef<string | null>(null);

  // Sync drag columns when external prop changes (only when not dragging)
  React.useEffect(() => {
    if (!activeId) setDragColumns(columnsProp);
  }, [columnsProp, activeId]);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    }),
  );

  function onDragStart({ active }: DragStartEvent) {
    const data = active.data.current;
    setActiveId(active.id as string);
    setActiveType(data?.type ?? "card");
    if (data?.type === "card") {
      activeCardColumnRef.current = data.columnId;
    }
    // Snapshot for rollback
    snapshotRef.current = dragColumns;
  }

  function onDragOver({ active, over }: DragOverEvent) {
    if (!over || activeType !== "card") return;

    const activeCardId = active.id as string;
    const overId = over.id as string;
    const overData = over.data.current;

    const fromColumnId = activeCardColumnRef.current;
    if (!fromColumnId) return;

    // Resolve target column
    let toColumnId: string;
    if (overData?.type === "column") {
      toColumnId = overId;
    } else if (overData?.type === "card") {
      toColumnId = overData.columnId;
    } else {
      return;
    }

    if (fromColumnId === toColumnId) {
      setDragColumns((prev) => {
        const col = prev.find((c) => c.id === fromColumnId);
        if (!col) return prev;
        const fromIdx = col.cards.findIndex((c) => c.id === activeCardId);
        const toIdx = col.cards.findIndex((c) => c.id === overId);
        if (fromIdx === -1 || toIdx === -1) return prev;
        return moveCardWithinColumn(prev, fromColumnId, fromIdx, toIdx);
      });
    } else {
      setDragColumns((prev) => {
        const toCol = prev.find((c) => c.id === toColumnId);
        const overIdx = toCol?.cards.findIndex((c) => c.id === overId) ?? -1;
        const insertAt = overIdx >= 0 ? overIdx : undefined;
        return moveCardBetweenColumns(
          prev,
          activeCardId,
          fromColumnId,
          toColumnId,
          insertAt,
        );
      });
      // Track the card's new home column for future onDragOver events
      activeCardColumnRef.current = toColumnId;
    }
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    const currentType = activeType;
    setActiveId(null);
    setActiveType(null);
    activeCardColumnRef.current = null;

    if (!over) {
      // Dropped outside — rollback
      setDragColumns(snapshotRef.current);
      return;
    }

    if (currentType === "column") {
      const fromIdx = snapshotRef.current.findIndex((c) => c.id === active.id);
      const toIdx = snapshotRef.current.findIndex((c) => c.id === over.id);
      if (fromIdx !== -1 && toIdx !== -1 && fromIdx !== toIdx) {
        const next = reorderColumns(
          snapshotRef.current,
          fromIdx,
          toIdx,
        ) as TColumn[];
        setDragColumns(next);
        onColumnsChange?.(next);
        onColumnReorder?.(fromIdx, toIdx);
      } else {
        setDragColumns(snapshotRef.current);
      }
    } else {
      onColumnsChange?.(dragColumns);

      if (onCardMove) {
        const toCol = findCardColumn(dragColumns, active.id as string);
        const fromCol = findCardColumn(
          snapshotRef.current,
          active.id as string,
        );
        const card = findCard(dragColumns, active.id as string);
        if (card && toCol && fromCol) {
          const toIndex = toCol.cards.findIndex((c) => c.id === active.id);
          onCardMove(card as TCard, fromCol.id, toCol.id, toIndex);
        }
      }
    }
  }

  function onDragCancel() {
    setDragColumns(snapshotRef.current);
    setActiveId(null);
    setActiveType(null);
    activeCardColumnRef.current = null;
  }

  const activeCard =
    activeId && activeType === "card"
      ? (findCard(dragColumns, activeId) as TCard | null)
      : null;

  const activeCardColumn = activeCard
    ? (findCardColumn(snapshotRef.current, activeId!) as TColumn | null)
    : null;

  const activeColumnData =
    activeId && activeType === "column"
      ? ((dragColumns.find((c) => c.id === activeId) as TColumn) ?? null)
      : null;

  const MEASURING_CONFIG = {
    droppable: {
      strategy: MeasuringStrategy.Always, // Keeps measurements precise for drop targets
    },
  };

  const value = React.useMemo<KanbanContextValue<TCard, TColumn>>(
    () => ({
      columns: dragColumns,
      activeId,
      activeType,
      activeCard,
      activeCardColumn,
      activeColumnData,
      renderCard,
      renderColumnHeader,
      renderColumnFooter,
      renderEmptyColumn,
    }),
    [
      dragColumns,
      activeId,
      activeType,
      activeCard,
      activeCardColumn,
      activeColumnData,
      renderCard,
      renderColumnHeader,
      renderColumnFooter,
      renderEmptyColumn,
    ],
  );

  return (
    <KanbanCtx.Provider value={value}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={onDragStart}
        onDragOver={onDragOver}
        onDragEnd={onDragEnd}
        onDragCancel={onDragCancel}
        measuring={MEASURING_CONFIG}
      >
        {children}
      </DndContext>
    </KanbanCtx.Provider>
  );
}

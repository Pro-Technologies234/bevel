export type KanbanCardBase = { id: string };

export type KanbanColumnBase<T extends KanbanCardBase = KanbanCardBase> = {
  id: string;
  title: string;
  cards: T[];
};

export type DragType = "card" | "column";

export interface CardDragData<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard>,
> {
  type: "card";
  card: TCard;
  column: TColumn;
  columnId: string;
}

export interface ColumnDragData<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard>,
> {
  type: "column";
  column: TColumn;
}

export interface CardRenderMeta {
  /** True on the original slot while a ghost is being dragged */
  isDragging: boolean;
  /** True on the ghost inside DragOverlay */
  isOverlay: boolean;
}

export interface ColumnRenderMeta {
  cardCount: number;
  /** True while a foreign card is dragged over this column */
  isOver: boolean;
}

export interface KanbanContextValue<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard>,
> {
  /** Current (potentially virtual) column state — reflects in-drag positions */
  columns: TColumn[];
  activeId: string | null;
  activeType: DragType | null;
  /** The card currently being dragged (for DragOverlay) */
  activeCard: TCard | null;
  /** The column of the active card at drag-start (for DragOverlay) */
  activeCardColumn: TColumn | null;
  /** The column being dragged (for DragOverlay) */
  activeColumnData: TColumn | null;

  renderCard: (
    card: TCard,
    column: TColumn,
    meta: CardRenderMeta,
  ) => React.ReactNode;
  renderColumnHeader?: (
    column: TColumn,
    meta: ColumnRenderMeta,
  ) => React.ReactNode;
  renderColumnFooter?: (
    column: TColumn,
    meta: ColumnRenderMeta,
  ) => React.ReactNode;
  renderEmptyColumn?: (column: TColumn) => React.ReactNode;
}

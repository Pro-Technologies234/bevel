"use client";

import * as React from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  KeyboardSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
  arrayMove,
} from "@dnd-kit/sortable";
import { restrictToVerticalAxis } from "@dnd-kit/modifiers";
import { SortableCtx } from "./sortable-context";
import type { SortableBaseItem, SortableConfig } from "./sortable-types";

export interface SortableRootProps<T extends SortableBaseItem> {
  items: T[];
  onReorder: (items: T[]) => void;
  config?: SortableConfig;
  /**
   * Rendered inside DragOverlay while dragging — the "ghost" following the cursor.
   * If omitted, no overlay is rendered.
   */
  renderOverlay?: (item: T) => React.ReactNode;
  children: React.ReactNode;
}

export function SortableRoot<T extends SortableBaseItem>({
  items,
  onReorder,
  config = {},
  renderOverlay,
  children,
}: SortableRootProps<T>) {
  const [activeId, setActiveId] = React.useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 4 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const activeItem = activeId ? items.find((i) => i.id === activeId) ?? null : null;

  function onDragStart({ active }: DragStartEvent) {
    setActiveId(active.id as string);
  }

  function onDragEnd({ active, over }: DragEndEvent) {
    setActiveId(null);
    if (!over || active.id === over.id) return;
    const from = items.findIndex((i) => i.id === active.id);
    const to = items.findIndex((i) => i.id === over.id);
    onReorder(arrayMove(items, from, to));
  }

  return (
    <SortableCtx.Provider value={{ activeId, config }}>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        modifiers={[restrictToVerticalAxis]}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setActiveId(null)}
      >
        <SortableContext
          items={items.map((i) => i.id)}
          strategy={verticalListSortingStrategy}
        >
          {children}
        </SortableContext>

        {renderOverlay && (
          <DragOverlay dropAnimation={{ duration: 160, easing: "ease" }}>
            {activeItem ? renderOverlay(activeItem) : null}
          </DragOverlay>
        )}
      </DndContext>
    </SortableCtx.Provider>
  );
}

SortableRoot.displayName = "SortableRoot";
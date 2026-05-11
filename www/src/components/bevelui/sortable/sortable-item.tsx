"use client";

import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import { SortableCtx, SortableHandleCtx } from "./sortable-context";

export interface SortableItemProps {
  id: string;
  children: React.ReactNode;
  className?: string;
  disabled?: boolean;
  /**
   * When true, only <SortableHandle> inside this item triggers drag.
   * Overrides the SortableRoot config.handle setting for this item.
   */
  handle?: boolean;
}

export function SortableItem({
  id,
  children,
  className,
  disabled,
  handle: handleProp,
}: SortableItemProps) {
  const { config, activeId } = React.useContext(SortableCtx)!;
  const useHandle = handleProp ?? config.handle ?? false;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id, disabled });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <SortableHandleCtx.Provider value={useHandle ? listeners : undefined}>
      <div
        ref={setNodeRef}
        style={style}
        data-dragging={isDragging || undefined}
        data-active={activeId === id || undefined}
        className={cn(
          "touch-none select-none",
          isDragging && "opacity-40",
          className,
        )}
        {...attributes}
        // Only spread listeners on the item itself when not in handle mode
        {...(!useHandle ? listeners : {})}
      >
        {children}
      </div>
    </SortableHandleCtx.Provider>
  );
}

SortableItem.displayName = "SortableItem";
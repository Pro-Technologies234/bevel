import * as React from "react";
import { IconGripVertical } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { SortableHandleCtx } from "./sortable-context";

export interface SortableHandleProps {
  className?: string;
  children?: React.ReactNode;
}

/**
 * Place inside <SortableItem handle> to restrict dragging to this element.
 * Renders a grip icon by default; pass children to customise.
 */
export function SortableHandle({ className, children }: SortableHandleProps) {
  const listeners = React.useContext(SortableHandleCtx);

  return (
    <button
      type="button"
      aria-label="Drag to reorder"
      className={cn(
        "cursor-grab active:cursor-grabbing p-1 rounded",
        "text-muted-foreground/40 hover:text-muted-foreground",
        "transition-colors touch-none focus-visible:outline-none",
        "focus-visible:ring-1 focus-visible:ring-primary",
        className,
      )}
      {...(listeners ?? {})}
    >
      {children ?? <IconGripVertical size={14} strokeWidth={1.8} />}
    </button>
  );
}

SortableHandle.displayName = "SortableHandle";

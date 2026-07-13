import { KanbanProvider, KanbanProviderProps } from "./kanban-context";
import { KanbanDragOverlay } from "./kanban-drag-overlay";

import type { KanbanCardBase, KanbanColumnBase } from "./types";
import { cn } from "@/lib/utils";

export interface KanbanRootProps extends KanbanProviderProps<
  KanbanCardBase,
  KanbanColumnBase<KanbanCardBase>
> {
  className?: string;
}

/**
 * Kanban — single import that composes the full system.
 *
 * Uses default layout unless you pass children.
 *
 * @example — default layout
 * <KanbanRoot
=  columns={...}
  onColumnsChange={...}
  onCardMove={...}
  renderCard={...}
  renderColumnHeader={...}
  renderColumnFooter={...}
  renderEmptyColumn={...}
 * />
 *
 * @example — custom layout
 * <KanbanRoot>
  *   <MyCustomColumn />
 * </KanbanRoot>
 */
export function KanbanRoot<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard> = KanbanColumnBase<TCard>,
>({ children, className, ...providerProps }: KanbanRootProps) {
  return (
    <KanbanProvider {...providerProps}>
      <div className={cn("flex flex-col", className)}>{children}</div>
      <KanbanDragOverlay />
    </KanbanProvider>
  );
}

KanbanRoot.displayName = "KanbanRoot";

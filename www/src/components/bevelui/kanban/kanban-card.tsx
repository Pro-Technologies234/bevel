import * as React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";
import type {
  KanbanCardBase,
  KanbanColumnBase,
  CardRenderMeta,
} from "./kanban-types";

export interface KanbanCardProps<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard>,
> {
  card: TCard;
  column: TColumn;
  renderCard: (
    card: TCard,
    column: TColumn,
    meta: CardRenderMeta,
  ) => React.ReactNode;
  className?: string;
}

export const KanbanCard = React.memo(function KanbanCard<
  TCard extends KanbanCardBase,
  TColumn extends KanbanColumnBase<TCard>,
>({ card, column, renderCard, className }: KanbanCardProps<TCard, TColumn>) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: card.id,
    data: {
      type: "card",
      card,
      column,
      columnId: column.id,
    },
  });

  const style: React.CSSProperties = {
    transform: CSS.Transform.toString(transform),
    transition,

    willChange: transform ? "transform" : undefined,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={cn(
        "touch-none select-none cursor-grab active:cursor-grabbing",
        isDragging && "opacity-30",
        className,
      )}
    >
      {renderCard(card, column, { isDragging, isOverlay: false })}
    </div>
  );
}) as <TCard extends KanbanCardBase, TColumn extends KanbanColumnBase<TCard>>(
  props: KanbanCardProps<TCard, TColumn>,
) => React.JSX.Element;

(KanbanCard as any).displayName = "KanbanCard";

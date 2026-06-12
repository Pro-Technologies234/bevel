import {
  SortableContext,
  horizontalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useKanban } from "./kanban-context";
import { KanbanColumn } from "./kanban-column";
import { cn } from "@/lib/utils";

export interface KanbanBoardProps {
  className?: string;
}

export function KanbanBoard({ className }: KanbanBoardProps) {
  const { columns } = useKanban();
  const columnIds = columns.map((c) => c.id);

  return (
    <SortableContext items={columnIds} strategy={horizontalListSortingStrategy}>
      <div
        className={cn(
          "flex gap-3 overflow-x-auto pb-4",

          "scrollbar-thin scrollbar-thumb-border scrollbar-track-transparent",
          className,
        )}
      >
        {columns.map((col) => (
          <KanbanColumn key={col.id} column={col} />
        ))}
      </div>
    </SortableContext>
  );
}

KanbanBoard.displayName = "KanbanBoard";

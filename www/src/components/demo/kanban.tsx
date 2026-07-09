"use client";

import * as React from "react";
import {
  KanbanRoot,
  KanbanBoard,
  type KanbanCardBase,
  type KanbanColumnBase,
  type CardRenderMeta,
  type ColumnRenderMeta,
  KanbanDragOverlay,
  KanbanProvider,
} from "@/components/bevelui/kanban";
import { cn } from "@/lib/utils";
import {
  IconPlus,
  IconDots,
  IconCalendar,
  IconUser,
  IconAlertCircle,
  IconCircleCheck,
  IconCircleDot,
  IconCircle,
} from "@tabler/icons-react";
import {Button} from "@/components/ui/button"

// ─── Extended types ────────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high" | "urgent";

type Task = KanbanCardBase & {
  title: string;
  description?: string;
  priority: Priority;
  assignee?: string;
  dueDate?: string;
  tags?: string[];
};

type TaskColumn = KanbanColumnBase<Task> & {
  color: string;
  icon: React.ElementType;
};

// ─── Seed data ─────────────────────────────────────────────────────────────────

const INITIAL_COLUMNS: TaskColumn[] = [
  {
    id: "backlog",
    title: "Backlog",
    color: "#6b7280",
    icon: IconCircle,
    cards: [
      {
        id: "t1",
        title: "Redesign onboarding flow",
        priority: "medium",
        tags: ["design", "ux"],
        assignee: "AO",
        dueDate: "Jun 20",
      },
      {
        id: "t2",
        title: "Add CSV export to reports",
        priority: "low",
        tags: ["feature"],
        assignee: "PO",
      },
      {
        id: "t3",
        title: "Audit accessibility on dashboard",
        priority: "medium",
        tags: ["a11y"],
        dueDate: "Jun 25",
      },
      {
        id: "t4",
        title: "Investigate Lighthouse score drop",
        priority: "high",
        tags: ["perf"],
        assignee: "AO",
      },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    color: "#60a5fa",
    icon: IconCircleDot,
    cards: [
      {
        id: "t5",
        title: "Build Kanban system",
        description: "Multi-container DnD, composable API",
        priority: "urgent",
        tags: ["bevel"],
        assignee: "PO",
        dueDate: "Jun 12",
      },
      {
        id: "t6",
        title: "Write Calendar docs",
        priority: "high",
        tags: ["docs"],
        assignee: "PO",
        dueDate: "Jun 14",
      },
      {
        id: "t7",
        title: "Set up Lemon Squeezy webhooks",
        priority: "high",
        tags: ["payments"],
        assignee: "PO",
      },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "#c2f13c",
    icon: IconAlertCircle,
    cards: [
      {
        id: "t8",
        title: "Studio layout system",
        description: "Full-viewport demo with bottom-sheet docs",
        priority: "urgent",
        tags: ["bevel", "ui"],
        assignee: "PO",
        dueDate: "Jun 11",
      },
      {
        id: "t9",
        title: "Fix Timeline performance",
        priority: "high",
        tags: ["bug", "perf"],
        assignee: "AO",
        dueDate: "Jun 13",
      },
    ],
  },
  {
    id: "review",
    title: "In Review",
    color: "#f97316",
    icon: IconCircleDot,
    cards: [
      {
        id: "t10",
        title: "Calendar system",
        description: "Month, week, day, agenda + overlap engine",
        priority: "urgent",
        tags: ["bevel"],
        assignee: "AO",
        dueDate: "Jun 10",
      },
      {
        id: "t11",
        title: "Update pricing page copy",
        priority: "medium",
        tags: ["marketing"],
        assignee: "PO",
      },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#34d399",
    icon: IconCircleCheck,
    cards: [
      {
        id: "t12",
        title: "Resizable Panel system",
        priority: "high",
        tags: ["bevel"],
        assignee: "PO",
      },
      {
        id: "t13",
        title: "Media Gallery system",
        priority: "medium",
        tags: ["bevel"],
        assignee: "PO",
      },
      {
        id: "t14",
        title: "Deploy to Vercel",
        priority: "low",
        tags: ["infra"],
        assignee: "AO",
      },
    ],
  },
];

// ─── Priority config ───────────────────────────────────────────────────────────

const PRIORITY: Record<
  Priority,
  { label: string; color: string; dot: string }
> = {
  low: { label: "Low", color: "text-slate-400", dot: "bg-slate-400/20" },
  medium: { label: "Med", color: "text-blue-400", dot: "bg-blue-400/20" },
  high: { label: "High", color: "text-orange-400", dot: "bg-orange-400/20" },
  urgent: { label: "Urgent", color: "text-red-400", dot: "bg-red-400/20" },
};

// ─── Card component ────────────────────────────────────────────────────────────

function TaskCard({ task, meta }: { task: Task; meta: CardRenderMeta }) {
  const p = PRIORITY[task.priority];

  return (
    <div
      className={cn(
        "group rounded-lg  bg-card p-3 flex flex-col gap-2.5",
        "hover:border-border/80 hover:shadow-sm transition-all easing-[cubic-bezier(0.18, 0.67, 0.6, 1.22)]",
        meta.isOverlay && "shadow-2xl border-primary/30 rotate-4",
      )}
    >
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span
              key={tag}
              className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/60 text-muted-foreground/70"
            >
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <p className={cn("text-[12px] font-medium text-foreground leading-snug")}>
        {task.title}
      </p>

      {/* Description */}
      {task.description && (
        <p className="text-[11px] text-muted-foreground/50 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className='flex items-center gap-0.5' >

          {/* Priority dot */}
          <div
            className={cn("w-2 h-5 rounded-sm flex-shrink-0 animate-pulse", p.dot)}
          />
        <div className={cn("flex items-center gap-1 px-2 py-0.5",p.dot," rounded")}>
          <span className={cn("text-[10px] font-medium", p.color)}>
            {p.label}
          </span>
        </div>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground/40">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <IconCalendar size={9} strokeWidth={2} />
              <span className="text-[9px] font-mono">{task.dueDate}</span>
            </div>
          )}
          {task.assignee && (
            <div className="w-6 h-6 rounded-full bg-background flex items-center justify-center">
              <span className=" text-xs text-muted-foreground">
                {task.assignee[0]}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Column header component ───────────────────────────────────────────────────

function ColumnHeader({
  column,
  meta,
}: {
  column: TaskColumn;
  meta: ColumnRenderMeta;
}) {
  const Icon = column.icon;
  return (
    <div className="flex items-center justify-between px-3 py-3">
      <div className="flex items-center gap-2">
        <Icon size={16} strokeWidth={2} style={{ color: column.color }} />
        <span className=" font-semibold text-foreground">
          {column.title}
        </span>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded-full"
          style={{ backgroundColor: `${column.color}20`, color: column.color }}
        >
          {meta.cardCount}
        </span>
      </div>
      <Button
        type="button"
        variant="secondary"
        size={'icon'}
        onClick={(e) => e.stopPropagation()}
      >
        <IconDots  />
      </Button>
    </div>
  );
}

// ─── Column footer component ───────────────────────────────────────────────────

function ColumnFooter({ column }: { column: TaskColumn }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-1.5 px-2 py-1.5 rounded-lg text-[11px] text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/40 transition-colors"
      onClick={(e) => e.stopPropagation()}
    >
      <IconPlus size={11} strokeWidth={2.5} />
      Add task
    </button>
  );
}

// ─── Demo ──────────────────────────────────────────────────────────────────────

export function KanbanDemo() {
  const [columns, setColumns] = React.useState<TaskColumn[]>(INITIAL_COLUMNS);

  return (
    <div className="w-full max-w-4xl  p-4">
      {/* Board header */}
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-sm font-semibold text-foreground">
            Bevel UI — Sprint Board
          </h3>
          <p className="text-[11px] text-muted-foreground/50 mt-0.5">
            Drag cards between columns · Drag column headers to reorder
          </p>
        </div>
        <div className="flex items-center gap-1.5">
          {["PO", "AO"].map((a) => (
            <div
              key={a}
              className="w-6 h-6 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center"
            >
              a<span className="text-[9px] font-bold text-primary">{a[0]}</span>
            </div>
          ))}
        </div>
      </div>

      <KanbanProvider<Task, TaskColumn>
        columns={columns}
        onColumnsChange={setColumns}
        onCardMove={(card, from, to, idx) => {
          console.log(
            `Moved "${card.title}" from ${from} → ${to} at index ${idx}`,
          );
        }}
        renderCard={(card, column, meta) => (
          <TaskCard task={card} meta={meta} />
        )}
        renderColumnHeader={(column, meta) => (
          <ColumnHeader column={column} meta={meta} />
        )}
        renderColumnFooter={(column) => <ColumnFooter column={column} />}
      >
        <KanbanBoard />
        <KanbanDragOverlay/>
      </KanbanProvider>
    </div>
  );
}

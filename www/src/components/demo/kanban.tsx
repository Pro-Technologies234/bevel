"use client";

import * as React from "react";
import {
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
  IconCircleCheck,
  IconCircleDot,
  IconCircle,
  IconAlertCircle,
  IconFlag,
  IconGitBranch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

// ─── Types ─────────────────────────────────────────────────────────────────────

type Priority = "low" | "medium" | "high" | "urgent";

type Task = KanbanCardBase & {
  title: string;
  description?: string;
  priority: Priority;
  assignee?: string;
  assigneeColor?: string;
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
      { id: "t1", title: "Redesign onboarding flow",          priority: "medium", tags: ["design", "ux"],  assignee: "AO", assigneeColor: "#a78bfa", dueDate: "Jun 20" },
      { id: "t2", title: "Add CSV export to reports",          priority: "low",    tags: ["feature"],       assignee: "PO", assigneeColor: "#34d399" },
      { id: "t3", title: "Audit accessibility on dashboard",   priority: "medium", tags: ["a11y"],          dueDate: "Jun 25" },
      { id: "t4", title: "Investigate Lighthouse score drop",  priority: "high",   tags: ["perf"],          assignee: "AO", assigneeColor: "#a78bfa" },
    ],
  },
  {
    id: "todo",
    title: "To Do",
    color: "#60a5fa",
    icon: IconCircleDot,
    cards: [
      { id: "t5", title: "Build Kanban system",            description: "Multi-container DnD, composable API", priority: "urgent", tags: ["bevel"],    assignee: "PO", assigneeColor: "#34d399", dueDate: "Jun 12" },
      { id: "t6", title: "Write Calendar docs",            priority: "high",   tags: ["docs"],     assignee: "PO", assigneeColor: "#34d399", dueDate: "Jun 14" },
      { id: "t7", title: "Set up payment webhooks",        priority: "high",   tags: ["payments"], assignee: "PO", assigneeColor: "#34d399" },
    ],
  },
  {
    id: "inprogress",
    title: "In Progress",
    color: "#c2f13c",
    icon: IconAlertCircle,
    cards: [
      { id: "t8", title: "Studio layout system",  description: "Full-viewport demo with bottom-sheet docs", priority: "urgent", tags: ["bevel", "ui"],  assignee: "PO", assigneeColor: "#34d399", dueDate: "Jun 11" },
      { id: "t9", title: "Fix Timeline perf",     priority: "high",   tags: ["bug", "perf"], assignee: "AO", assigneeColor: "#a78bfa", dueDate: "Jun 13" },
    ],
  },
  {
    id: "review",
    title: "In Review",
    color: "#f97316",
    icon: IconCircleDot,
    cards: [
      { id: "t10", title: "Calendar system",         description: "Month, week, day, agenda + overlap engine", priority: "urgent", tags: ["bevel"], assignee: "AO", assigneeColor: "#a78bfa", dueDate: "Jun 10" },
      { id: "t11", title: "Update pricing page copy", priority: "medium", tags: ["marketing"], assignee: "PO", assigneeColor: "#34d399" },
    ],
  },
  {
    id: "done",
    title: "Done",
    color: "#34d399",
    icon: IconCircleCheck,
    cards: [
      { id: "t12", title: "Resizable Panel system", priority: "high",   tags: ["bevel"], assignee: "PO", assigneeColor: "#34d399" },
      { id: "t13", title: "Media Gallery system",   priority: "medium", tags: ["bevel"], assignee: "PO", assigneeColor: "#34d399" },
      { id: "t14", title: "Deploy to production",   priority: "low",    tags: ["infra"], assignee: "AO", assigneeColor: "#a78bfa" },
    ],
  },
];

// ─── Priority config ───────────────────────────────────────────────────────────

const PRIORITY: Record<Priority, { label: string; color: string; bg: string }> = {
  low:    { label: "Low",    color: "text-slate-400",  bg: "bg-slate-400/10" },
  medium: { label: "Med",    color: "text-blue-400",   bg: "bg-blue-400/10"  },
  high:   { label: "High",   color: "text-orange-400", bg: "bg-orange-400/10"},
  urgent: { label: "Urgent", color: "text-red-400",    bg: "bg-red-400/10"   },
};

// ─── Card ──────────────────────────────────────────────────────────────────────

function TaskCard({ task, meta }: { task: Task; meta: CardRenderMeta }) {
  const p = PRIORITY[task.priority];
  return (
    <div
      className={cn(
        "group rounded-lg bg-card border border-border/60 p-3 flex flex-col gap-2",
        "hover:border-border hover:shadow-md transition-all duration-150",
        meta.isOverlay && "shadow-2xl border-primary/40 rotate-2 scale-105",
      )}
    >
      {/* Tags */}
      {task.tags && task.tags.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {task.tags.map((tag) => (
            <span key={tag} className="px-1.5 py-0.5 rounded text-[9px] font-medium bg-muted/60 text-muted-foreground/70">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Title */}
      <p className="text-[12px] font-medium text-foreground leading-snug">{task.title}</p>

      {/* Description */}
      {task.description && (
        <p className="text-[11px] text-muted-foreground/50 leading-relaxed line-clamp-2">
          {task.description}
        </p>
      )}

      {/* Meta row */}
      <div className="flex items-center justify-between gap-2 pt-0.5">
        <div className={cn("flex items-center gap-1 px-1.5 py-0.5 rounded", p.bg)}>
          <IconFlag size={9} className={p.color} />
          <span className={cn("text-[9px] font-semibold", p.color)}>{p.label}</span>
        </div>

        <div className="flex items-center gap-2 text-muted-foreground/40">
          {task.dueDate && (
            <div className="flex items-center gap-1">
              <IconCalendar size={9} strokeWidth={2} />
              <span className="text-[9px] font-mono">{task.dueDate}</span>
            </div>
          )}
          {task.assignee && (
            <div
              className="w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-bold text-black"
              style={{ backgroundColor: task.assigneeColor ?? "#a78bfa" }}
              title={task.assignee}
            >
              {task.assignee[0]}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Column header ─────────────────────────────────────────────────────────────

function ColumnHeader({ column, meta }: { column: TaskColumn; meta: ColumnRenderMeta }) {
  const Icon = column.icon;
  return (
    <div className="flex items-center justify-between px-3 py-2.5">
      <div className="flex items-center gap-2">
        <Icon size={14} strokeWidth={2} style={{ color: column.color }} />
        <span className="text-[12px] font-semibold text-foreground">{column.title}</span>
        <span
          className="text-[10px] font-mono px-1.5 py-0.5 rounded-full tabular-nums"
          style={{ backgroundColor: `${column.color}20`, color: column.color }}
        >
          {meta.cardCount}
        </span>
      </div>
      <Button type="button" variant="ghost" size="icon" className="w-6 h-6" onClick={(e) => e.stopPropagation()}>
        <IconDots size={13} />
      </Button>
    </div>
  );
}

// ─── Column footer ─────────────────────────────────────────────────────────────

function ColumnFooter({ column }: { column: TaskColumn }) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-1.5 px-3 py-2 rounded-lg text-[11px] text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted/30 transition-colors"
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

  const totalCards  = columns.reduce((s, c) => s + c.cards.length, 0);
  const doneCards   = columns.find((c) => c.id === "done")?.cards.length ?? 0;
  const progress    = Math.round((doneCards / totalCards) * 100);

  return (
    <div className="w-full flex flex-col gap-4">
      {/* Sprint header */}
      <div className="flex items-start justify-between gap-4 px-1">
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <IconGitBranch size={14} className="text-muted-foreground" />
            <span className="text-[13px] font-semibold text-foreground">Sprint 12 — Bevel UI</span>
            <span className="px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-primary/10 text-primary border border-primary/20">Active</span>
          </div>
          <p className="text-[11px] text-muted-foreground/60">
            Drag cards between columns · Drag column headers to reorder
          </p>
        </div>

        {/* Assignee avatars + progress */}
        <div className="flex flex-col items-end gap-1.5 shrink-0">
          <div className="flex items-center gap-1">
            {[
              { initials: "PO", color: "#34d399" },
              { initials: "AO", color: "#a78bfa" },
            ].map((a) => (
              <div
                key={a.initials}
                className="w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold text-black border-2 border-background"
                style={{ backgroundColor: a.color }}
              >
                {a.initials}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2">
            <div className="w-24 h-1.5 rounded-full bg-muted overflow-hidden">
              <div
                className="h-full bg-emerald-400 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60">{doneCards}/{totalCards}</span>
          </div>
        </div>
      </div>

      {/* Board */}
      <KanbanProvider<Task, TaskColumn>
        columns={columns}
        onColumnsChange={setColumns}
        renderCard={(card, _col, meta) => <TaskCard task={card} meta={meta} />}
        renderColumnHeader={(col, meta) => <ColumnHeader column={col} meta={meta} />}
        renderColumnFooter={(col) => <ColumnFooter column={col} />}
      >
        <KanbanBoard />
        <KanbanDragOverlay />
      </KanbanProvider>
    </div>
  );
}

"use client";

import * as React from "react";
import {
  SortableRoot,
  SortableItem,
  SortableHandle,
  useSortableList,
} from "@/components/bevelui/sortable";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

type Priority = "urgent" | "medium" | "low";
type Task = { id: string; title: string; priority: Priority };

type LayerKind = "frame" | "text" | "asset";
type Layer = { id: string; name: string; kind: LayerKind; visible: boolean };

// ─── Styles ───────────────────────────────────────────────────────────────────

const PRIORITY: Record<Priority, string> = {
  urgent: "bg-rose-500/10 text-rose-400 border border-rose-500/20",
  medium: "bg-amber-500/10 text-amber-400 border border-amber-500/20",
  low:    "bg-muted/60 text-muted-foreground border border-border",
};

const LAYER_KIND: Record<LayerKind, string> = {
  frame: "bg-blue-500/10 text-blue-400",
  text:  "bg-violet-500/10 text-violet-400",
  asset: "bg-emerald-500/10 text-emerald-400",
};

// ─── Initial data ─────────────────────────────────────────────────────────────

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Auth token refresh logic",   priority: "urgent" },
  { id: "t2", title: "Docs API reference",          priority: "medium" },
  { id: "t3", title: "Mobile nav overflow fix",     priority: "urgent" },
  { id: "t4", title: "Onboarding email copy",       priority: "low"    },
  { id: "t5", title: "Lazy-load hero images",       priority: "medium" },
];

const INITIAL_LAYERS: Layer[] = [
  { id: "l1", name: "Hero Background", kind: "asset", visible: true  },
  { id: "l2", name: "Page Headline",   kind: "text",  visible: true  },
  { id: "l3", name: "CTA Button",      kind: "frame", visible: true  },
  { id: "l4", name: "Decorative Ring", kind: "frame", visible: false },
  { id: "l5", name: "Tagline",         kind: "text",  visible: true  },
];

// ─── Panel header ─────────────────────────────────────────────────────────────

function PanelHeader({ label, hint, count }: { label: string; hint: string; count: number }) {
  return (
    <div className="flex items-center justify-between mb-2">
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">
          {label}
        </span>
        <span className="text-[10px] font-mono text-muted-foreground/40 tabular-nums">
          {count}
        </span>
      </div>
      <span className="text-[10px] text-muted-foreground/30 font-mono">{hint}</span>
    </div>
  );
}

// ─── SortableDemo ─────────────────────────────────────────────────────────────

export function SortableDemo() {
  const tasks  = useSortableList<Task>(INITIAL_TASKS);
  const layers = useSortableList<Layer>(INITIAL_LAYERS);

  return (
    <div className="flex flex-col sm:flex-row gap-8 w-full max-w-[620px]">

      {/* ── Whole-row drag ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <PanelHeader label="Sprint" hint="drag row" count={tasks.items.length} />

        <SortableRoot
          items={tasks.items}
          onReorder={tasks.setItems}
          renderOverlay={(task) => (
            <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-primary/40 bg-card shadow-2xl shadow-black/30 ring-1 ring-primary/10 rotate-1">
              <span className="text-[12px] flex-1 truncate text-foreground">
                {task.title}
              </span>
              <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide shrink-0", PRIORITY[task.priority])}>
                {task.priority}
              </span>
            </div>
          )}
        >
          <div className="flex flex-col gap-1">
            {tasks.items.map((task) => (
              <SortableItem
                key={task.id}
                id={task.id}
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg border border-border bg-card/80 hover:bg-card cursor-grab active:cursor-grabbing transition-colors"
              >
                <span className="text-[12px] flex-1 truncate">{task.title}</span>
                <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium uppercase tracking-wide shrink-0", PRIORITY[task.priority])}>
                  {task.priority}
                </span>
              </SortableItem>
            ))}
          </div>
        </SortableRoot>
      </div>

      {/* ── Handle-only drag ── */}
      <div className="flex-1 flex flex-col min-w-0">
        <PanelHeader label="Layers" hint="grip handle" count={layers.items.length} />

        <SortableRoot items={layers.items} onReorder={layers.setItems}>
          <div className="flex flex-col gap-1">
            {layers.items.map((layer) => (
              <SortableItem
                key={layer.id}
                id={layer.id}
                handle
                className="flex items-center gap-2 px-2 py-2 rounded-lg border border-border bg-card/80 hover:bg-card transition-colors"
              >
                <SortableHandle className="shrink-0" />

                <span className={cn("text-[9px] px-1.5 py-0.5 rounded font-medium shrink-0", LAYER_KIND[layer.kind])}>
                  {layer.kind}
                </span>

                <span className={cn(
                  "text-[12px] flex-1 truncate min-w-0 transition-opacity",
                  !layer.visible && "opacity-30 line-through decoration-muted-foreground",
                )}>
                  {layer.name}
                </span>

                <button
                  type="button"
                  onClick={() => layers.update(layer.id, { visible: !layer.visible })}
                  title={layer.visible ? "Hide layer" : "Show layer"}
                  className="text-[11px] leading-none text-muted-foreground/30 hover:text-muted-foreground transition-colors shrink-0 w-5 text-center"
                >
                  {layer.visible ? "●" : "○"}
                </button>
              </SortableItem>
            ))}
          </div>
        </SortableRoot>
      </div>

    </div>
  );
}
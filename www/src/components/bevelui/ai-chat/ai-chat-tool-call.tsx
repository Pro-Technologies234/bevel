"use client";

import * as React from "react";
import { IconCheck, IconX, IconLoader2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const CFG = {
  pending: { icon: IconLoader2, cls: "text-muted-foreground/30 animate-spin", wrap: "border-border/30 bg-transparent" },
  running: { icon: IconLoader2, cls: "text-primary/60 animate-spin",          wrap: "border-primary/20 bg-primary/5"  },
  done:    { icon: IconCheck,   cls: "text-emerald-500",                       wrap: "border-border/30 bg-transparent" },
  error:   { icon: IconX,       cls: "text-destructive",                       wrap: "border-destructive/20 bg-destructive/5" },
} as const;

export function AIChatToolCall({
  name, label, status, result,
}: {
  name:    string;
  label?:  string;
  status:  "pending" | "running" | "done" | "error";
  result?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { icon: Icon, cls, wrap } = CFG[status];
  const display = label ?? name.replace(/_/g, " ").replace(/\b\w/g, c => c.toUpperCase());

  return (
    <div className={cn("rounded-lg border px-3 py-2 text-[11px]", wrap)}>
      <div className="flex items-center gap-2">
        <Icon size={12} strokeWidth={2} className={cls} />
        <span className="text-muted-foreground/60 flex-1">{display}</span>
        {result && (
          <button
            type="button"
            onClick={() => setOpen(p => !p)}
            className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground transition-colors"
          >
            {open ? "hide" : "details"}
          </button>
        )}
      </div>
      {open && result && (
        <pre className="mt-2 pt-2 text-[10px] font-mono text-muted-foreground/50 leading-relaxed whitespace-pre-wrap border-t border-border/30 overflow-x-auto">
          {result}
        </pre>
      )}
    </div>
  );
}

AIChatToolCall.displayName = "AIChatToolCall";
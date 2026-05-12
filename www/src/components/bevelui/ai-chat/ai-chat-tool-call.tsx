"use client";

import * as React from "react";
import {
  IconCheck,
  IconX,
  IconLoader2,
  IconLoader3,
  IconLoader,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

const CFG = {
  pending: {
    icon: IconLoader2,
    cls: "text-muted-foreground/30 animate-spin",
    wrap: "border-border bg-transparent",
  },
  running: {
    icon: IconLoader,
    cls: "text-green-400 animate-spin",
    wrap: "border-border bg-card/40",
  },
  done: {
    icon: IconCheck,
    cls: "text-emerald-500",
    wrap: "border-border/30 bg-transparent",
  },
  error: {
    icon: IconX,
    cls: "text-destructive",
    wrap: "border-destructive/20 bg-destructive/5",
  },
} as const;

export function AIChatToolCall({
  name,
  label,
  status,
  result,
}: {
  name: string;
  label?: string;
  status: "pending" | "running" | "done" | "error";
  result?: string;
}) {
  const [open, setOpen] = React.useState(false);
  const { icon: Icon, cls, wrap } = CFG[status];
  const display =
    label ?? name.replace(/_/g, " ").replace(/\b\w/g, (c) => c.toUpperCase());

  return (
    <div
      className={cn(
        "rounded-lg border bg-card/40 border-border px-3 py-2 text-[11px]",
        wrap,
      )}
    >
      <div className="flex items-center gap-2">
        <Icon size={12} strokeWidth={2} className={cls} />
        <span className=" flex-1">{display}</span>
        {result && (
          <Button
            type="button"
            onClick={() => setOpen((p) => !p)}
            variant={"secondary"}
            size={"xs"}
          >
            {open ? "Hide" : "Details"}
          </Button>
        )}
      </div>
      {open && result && (
        <pre className="mt-2 pt-2 text-[10px] font-mono text-muted-foreground leading-relaxed whitespace-pre-wrap border-t border-border/30 overflow-x-auto">
          {result}
        </pre>
      )}
    </div>
  );
}

AIChatToolCall.displayName = "AIChatToolCall";

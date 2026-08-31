"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import type { DiffLine } from "./types";

export interface DiffLineRowProps {
  line: DiffLine | null; // null renders a blank placeholder row (unpaired side in split view)
  showLineNumber?: number | null;
}

const TYPE_BG: Record<string, string> = {
  added: "bg-emerald-500/10",
  removed: "bg-red-500/10",
  unchanged: "",
};

const TYPE_SIGN: Record<string, string> = {
  added: "+",
  removed: "−",
  unchanged: " ",
};

export function DiffLineRow({ line, showLineNumber }: DiffLineRowProps) {
  if (!line) {
    return <div className="flex h-[22px] items-center bg-muted/20" />;
  }

  return (
    <div className={cn("flex h-[22px] items-center font-mono text-[12px] leading-[22px]", TYPE_BG[line.type])}>
      <span className="w-10 shrink-0 select-none text-right text-muted-foreground/40">
        {showLineNumber ?? ""}
      </span>
      <span
        className={cn(
          "w-4 shrink-0 select-none text-center",
          line.type === "added" && "text-emerald-500",
          line.type === "removed" && "text-red-500",
        )}
      >
        {TYPE_SIGN[line.type]}
      </span>
      <span className="min-w-0 flex-1 truncate whitespace-pre pr-3">
        {line.wordSpans
          ? line.wordSpans.map((span, i) => (
              <span
                key={i}
                className={cn(
                  span.changed &&
                    (line.type === "added" ? "rounded-sm bg-emerald-500/30" : "rounded-sm bg-red-500/30"),
                )}
              >
                {span.text}
              </span>
            ))
          : line.content}
      </span>
    </div>
  );
}

DiffLineRow.displayName = "DiffLineRow";

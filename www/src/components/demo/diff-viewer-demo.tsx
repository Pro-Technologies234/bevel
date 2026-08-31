"use client";

import * as React from "react";
import { DiffViewerRoot, DiffViewerLayout, useDiffViewer } from "@/components/bevelui/diff-viewer";
import { cn } from "@/lib/utils";

const ORIGINAL = `function greet(name) {
  console.log("Hello, " + name);
  return true;
}

function farewell(name) {
  console.log("Bye, " + name);
}`;

const MODIFIED = `function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

function farewell(name, formal) {
  const word = formal ? "Goodbye" : "Bye";
  console.log(\`\${word}, \${name}\`);
}`;

const BASE = `function total(items) {
  return items.reduce((sum, i) => sum + i.price, 0);
}`;

const OURS = `function total(items) {
  return items.reduce((sum, i) => sum + i.price * i.qty, 0);
}`;

const THEIRS = `function total(items) {
  const sum = items.reduce((acc, i) => acc + i.price, 0);
  return Math.round(sum * 100) / 100;
}`;

function MergedPreview() {
  const { getMergedText, isFullyResolved } = useDiffViewer();
  return (
    <div className="mt-3 rounded-lg border border-border/60 bg-muted/20 p-3">
      <div className="mb-1.5 flex items-center justify-between">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Merged result
        </span>
        <span className={cn("text-[10px]", isFullyResolved() ? "text-emerald-500" : "text-amber-500")}>
          {isFullyResolved() ? "Fully resolved" : "Unresolved conflicts remain"}
        </span>
      </div>
      <pre className="overflow-x-auto whitespace-pre-wrap font-mono text-[11px] text-foreground/80">
        {getMergedText()}
      </pre>
    </div>
  );
}

export function DiffViewerDemo() {
  const [tab, setTab] = React.useState<"diff" | "merge">("diff");

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center gap-1 rounded-md border border-border bg-card/80 p-0.5 w-fit">
        {(["diff", "merge"] as const).map((t) => (
          <button
            key={t}
            type="button"
            onClick={() => setTab(t)}
            className={cn(
              "rounded px-3 py-1 text-[11px] font-medium capitalize transition-colors",
              tab === t ? "bg-primary/10 text-primary" : "text-muted-foreground hover:text-foreground",
            )}
          >
            {t === "diff" ? "Two-way diff" : "Three-way merge"}
          </button>
        ))}
      </div>

      {tab === "diff" ? (
        <DiffViewerRoot original={ORIGINAL} modified={MODIFIED} config={{ contextLines: 2 }} />
      ) : (
        <DiffViewerRoot base={BASE} ours={OURS} theirs={THEIRS} config={{ contextLines: 2 }}>
          <DiffViewerLayout />
          <MergedPreview />
        </DiffViewerRoot>
      )}
    </div>
  );
}

DiffViewerDemo.displayName = "DiffViewerDemo";

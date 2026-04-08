"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DocsCodeBlock } from "./docs-code-block";

export interface DocsDemoProps {
  /** The live preview */
  children: React.ReactNode;
  /** Source code shown in the code tab */
  code?: string;
  language?: string;
  filename?: string;
  /** Label shown above the demo */
  label?: string;
  /** Extra padding in the preview pane */
  padded?: boolean;
  /** Dark background for demos that need it */
  dark?: boolean;
  className?: string;
}

export function DocsDemo({
  children,
  code,
  language = "tsx",
  filename,
  label,
  padded = true,
  dark = false,
  className,
}: DocsDemoProps) {
  const [tab, setTab] = React.useState<"preview" | "code">("preview");
  const showTabs = !!code;

  return (
    <div
      className={cn("rounded-xl border border-border overflow-hidden", className)}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30">
        <span className="text-[11px] text-muted-foreground">
          {label ?? "Live preview"}
        </span>

        {showTabs && (
          <div className="flex items-center rounded-lg border border-border/60 overflow-hidden">
            {(["preview", "code"] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={cn(
                  "px-3 py-1 text-[11px] font-medium transition-colors capitalize",
                  tab === t
                    ? "bg-muted text-foreground"
                    : "text-muted-foreground hover:text-foreground",
                )}
              >
                {t}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Preview */}
      {(!showTabs || tab === "preview") && (
        <div
          className={cn(
            "w-full flex items-center justify-center min-h-[200px]",
            padded && "p-8",
            dark ? "bg-zinc-950" : "bg-muted/10",
          )}
        >
          {children}
        </div>
      )}

      {/* Code */}
      {showTabs && tab === "code" && code && (
        <DocsCodeBlock
          code={code}
          language={language}
          filename={filename}
          className="rounded-none border-0"
        />
      )}
    </div>
  );
}

DocsDemo.displayName = "DocsDemo";

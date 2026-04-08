"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy, IconTerminal2 } from "@tabler/icons-react";

export interface DocsCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  /** Highlight specific line numbers e.g. [3, 4, 5] */
  highlightLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

export function DocsCodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: DocsCodeBlockProps) {
  const [copied, setCopied] = React.useState(false);

  function copy() {
    navigator.clipboard.writeText(code.trim());
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  const lines = code.trim().split("\n");

  return (
    <div
      className={cn(
        "group relative rounded-lg border border-border overflow-hidden bg-muted/20 w-full",
        className,
      )}
    >
      {/* Header bar */}
      <div className="flex items-center justify-between px-2 py-1 border-b border-border/60 bg-muted/30">
        <div className="flex items-end gap-2">
          <IconTerminal2
            size={16}
            strokeWidth={1.8}
            className="text-foreground"
          />
          {filename ? (
            <span className="text-[11px] font-medium text-muted-foreground font-mono">
              {filename}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/50 uppercase tracking-wide">
              {language}
            </span>
          )}
        </div>

        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Copy code"
        >
          {copied ? (
            <>
              <IconCheck size={12} strokeWidth={2.5} className="text-primary" />
              <span className="text-primary">Copied</span>
            </>
          ) : (
            <>
              <IconCopy size={12} strokeWidth={1.8} />
              <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code */}
      <div className="overflow-x-auto">
        <pre className="p-3 text-[13px] leading-6 font-mono">
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightLines.includes(lineNum);
            return (
              <div
                key={i}
                className={cn(
                  "flex",
                  isHighlighted &&
                    "bg-primary/8 -mx-4 px-4 border-l-2 border-primary",
                )}
              >
                {showLineNumbers && (
                  <span className="select-none w-8 shrink-0 text-right text-muted-foreground/30 mr-4 text-[11px] leading-6">
                    {lineNum}
                  </span>
                )}
                <span className="text-foreground/85">{line || " "}</span>
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

DocsCodeBlock.displayName = "DocsCodeBlock";

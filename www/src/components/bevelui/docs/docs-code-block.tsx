"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy, IconTerminal2 } from "@tabler/icons-react";
import { highlight } from "sugar-high";

const PLAIN_LANGUAGES = new Set(["bash", "shell", "sh", "text", "plain"]);

export function DocsCodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const trimmed = code.trim();
  const isPlain = PLAIN_LANGUAGES.has(language.toLowerCase());

  const lines = React.useMemo(() => {
    const rawLines = trimmed.split("\n");
    return rawLines.map((line) => ({
      html: isPlain ? line : highlight(line || " "),
      raw: line,
    }));
  }, [trimmed, isPlain]);

  function copy() {
    navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div
      className={cn(
        "group relative rounded-xl border border-border overflow-hidden bg-muted/20 dark:bg-zinc-950/60",
        className,
      )}
    >
      <style
        dangerouslySetInnerHTML={{
          __html: `
        /* Light Mode (Clean Vibrant) */
        .sh-container .sh-keyword      { color: #d73a49 !important; }
        .sh-container .sh-string       { color: #22863a !important; }
        .sh-container .sh-comment      { color: #6a737d !important; font-style: italic; }
        .sh-container .sh-jsxliterals  { color: #005cc5 !important; }
        .sh-container .sh-identifier   { color: #6f42c1 !important; }
        .sh-container .sh-sign         { color: #24292e !important; }
        .sh-container .sh-class        { color: #e36209 !important; }
        .sh-container .sh-property     { color: #005cc5 !important; }
        .sh-container .sh-entity       { color: #22863a !important; }

        /* Dark Mode (The exact neon colors from your image) */
        .dark .sh-container .sh-keyword      { color: #c678dd !important; } /* Magenta/Purple */
        .dark .sh-container .sh-string       { color: #98c379 !important; } /* Sage Green */
        .dark .sh-container .sh-comment      { color: #5c6370 !important; font-style: italic; } /* Muted Grey */
        .dark .sh-container .sh-jsxliterals  { color: #61afef !important; } /* Sky Blue */
        .dark .sh-container .sh-identifier   { color: #e06c75 !important; } /* Coral Red */
        .dark .sh-container .sh-sign         { color: #abb2bf !important; } /* Silver */
        .dark .sh-container .sh-class        { color: #e5c07b !important; } /* Soft Yellow */
        .dark .sh-container .sh-property     { color: #61afef !important; } /* Sky Blue */
        .dark .sh-container .sh-entity       { color: #56b6c2 !important; } /* Cyan/Teal */
      `,
        }}
      />

      {/* Header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-border/60 bg-muted/30 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <IconTerminal2
            size={13}
            strokeWidth={1.8}
            className="text-muted-foreground/50"
          />
          <span className="text-[11px] font-medium text-muted-foreground font-mono">
            {filename || language.toUpperCase()}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
        >
          {copied ? (
            <>
              <IconCheck size={12} className="text-primary" />{" "}
              <span className="text-primary font-medium">Copied</span>
            </>
          ) : (
            <>
              <IconCopy size={12} /> <span>Copy</span>
            </>
          )}
        </button>
      </div>

      {/* Code Area */}
      <div className="overflow-x-auto sh-container">
        <pre
          className="p-4 text-[13px] leading-[1.6] font-mono text-[#abb2bf]"
          style={{ tabSize: 2 }}
        >
          {lines.map((line, i) => (
            <div
              key={i}
              className={cn(
                "flex min-w-0 px-4 -mx-4",
                highlightLines.includes(i + 1) &&
                  "bg-primary/10 border-l-2 border-primary",
              )}
            >
              {showLineNumbers && (
                <span className="select-none w-8 shrink-0 text-right text-muted-foreground/30 mr-5 text-[11px]">
                  {i + 1}
                </span>
              )}
              <span
                className="min-w-0"
                dangerouslySetInnerHTML={{ __html: line.html }}
              />
            </div>
          ))}
        </pre>
      </div>
    </div>
  );
}

DocsCodeBlock.displayName = "DocsCodeBlock";

"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCheck, IconCopy, IconTerminal2 } from "@tabler/icons-react";
import { highlight } from "sugar-high";

/**
 * Install: npm install sugar-high
 *
 * sugar-high is a zero-dependency ~1.5kb syntax highlighter.
 * It is the same one used by shadcn/ui docs internally.
 * It emits <span> elements with these class names:
 *
 *   .sh-keyword    — import, export, const, let, return, etc.
 *   .sh-string     — "strings" and `template literals`
 *   .sh-comment    — // line comments and block comments
 *   .sh-jsxliterals — <JSX> tags
 *   .sh-identifier — variable names, function names
 *   .sh-sign       — punctuation: { } ( ) [ ] = > etc.
 *   .sh-class      — Class names (capitalised identifiers)
 *   .sh-property   — .property access
 *   .sh-entity     — special entities
 *
 * We map each class to a CSS custom property so the colours
 * respect both light and dark mode via Tailwind's dark variant.
 */

// ─── Token colour map ─────────────────────────────────────────────────────────

const CODE_STYLES = `
  .sh-keyword    { color: var(--sh-keyword); }
  .sh-string     { color: var(--sh-string); }
  .sh-comment    { color: var(--sh-comment); font-style: italic; }
  .sh-jsxliterals{ color: var(--sh-jsx); }
  .sh-identifier { color: var(--sh-identifier); }
  .sh-sign       { color: var(--sh-sign); }
  .sh-class      { color: var(--sh-class); }
  .sh-property   { color: var(--sh-property); }
  .sh-entity     { color: var(--sh-entity); }
`;
// ─── Inject styles once ───────────────────────────────────────────────────────

function useCodeStyles() {
  React.useEffect(() => {
    if (document.getElementById("sugar-high-styles")) return;
    const style = document.createElement("style");
    style.id = "sugar-high-styles";
    style.textContent = CODE_STYLES;
    document.head.appendChild(style);
  }, []);
}

// ─── Non-highlighted fallback for bash/shell ──────────────────────────────────

const PLAIN_LANGUAGES = new Set(["bash", "shell", "sh", "text", "plain"]);

// ─── Props ────────────────────────────────────────────────────────────────────

export interface DocsCodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
  className?: string;
}

// ─── DocsCodeBlock ────────────────────────────────────────────────────────────

export function DocsCodeBlock({
  code,
  language = "tsx",
  filename,
  showLineNumbers = false,
  highlightLines = [],
  className,
}: DocsCodeBlockProps) {
  useCodeStyles();

  const [copied, setCopied] = React.useState(false);
  const trimmed = code.trim();

  const isPlain = PLAIN_LANGUAGES.has(language.toLowerCase());

  // Run sugar-high on the whole code string, then split back into lines
  // We split by newline first, highlight each line to get per-line HTML,
  // which lets us apply line highlight backgrounds correctly.
  const lines = React.useMemo(() => {
    if (isPlain) {
      return trimmed.split("\n").map((l) => ({ html: l, raw: l }));
    }
    // Highlight whole block, then split back
    const highlighted = highlight(trimmed);
    // sugar-high doesn't wrap lines, so split on newlines in the HTML
    // We reconstruct by splitting on literal \n outside of tag content
    const rawLines = trimmed.split("\n");
    // Highlight per-line for accurate line-level BG without breaking spans
    return rawLines.map((line) => ({
      html: highlight(line || " "),
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
        "group relative rounded-lg  overflow-hidden border",
        "bg-card/80",
        className,
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-2 border-b border-border/60 bg-muted/30 dark:bg-zinc-900/60">
        <div className="flex items-center gap-2">
          <IconTerminal2
            size={13}
            strokeWidth={1.8}
            className="text-foreground/50"
          />
          {filename ? (
            <span className="text-[11px] font-medium text-muted-foreground/80 font-mono">
              {filename}
            </span>
          ) : (
            <span className="text-[11px] text-muted-foreground/40 uppercase tracking-wider">
              {language}
            </span>
          )}
        </div>

        <button
          onClick={copy}
          className="flex items-center gap-1.5 text-[11px] px-2 py-1 rounded-md text-muted-foreground/80 hover:text-foreground hover:bg-muted/60 transition-colors"
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
        <pre
          className="p-4 text-[12.5px] leading-[1.7] font-mono"
          // Allow sugar-high spans to be inlined
          style={{ tabSize: 2 }}
        >
          {lines.map((line, i) => {
            const lineNum = i + 1;
            const isHighlighted = highlightLines.includes(lineNum);

            return (
              <div
                key={i}
                className={cn(
                  "flex min-w-0",
                  isHighlighted &&
                    "bg-primary/8 dark:bg-primary/12 -mx-4 px-4 border-l-2 border-primary font-serif",
                )}
              >
                {showLineNumbers && (
                  <span className="select-none w-8 shrink-0 text-right text-muted-foreground/25 mr-5 text-[11px] leading-[1.7]">
                    {lineNum}
                  </span>
                )}
                {isPlain ? (
                  <span className="text-foreground/80">{line.raw || " "}</span>
                ) : (
                  <span
                    className="min-w-0"
                    dangerouslySetInnerHTML={{ __html: line.html }}
                  />
                )}
              </div>
            );
          })}
        </pre>
      </div>
    </div>
  );
}

DocsCodeBlock.displayName = "DocsCodeBlock";

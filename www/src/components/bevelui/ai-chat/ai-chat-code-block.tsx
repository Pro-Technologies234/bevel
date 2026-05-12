"use client";

import * as React from "react";
import { highlight } from "sugar-high";
import { IconCheck, IconCopy, IconTerminal2 } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const PLAIN = new Set(["bash", "shell", "sh", "text", "plain", "console"]);

export function AIChatCodeBlock({
  code,
  language = "text",
  filename,
}: {
  code:      string;
  language?: string;
  filename?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const isPlain  = PLAIN.has(language.toLowerCase());
  const trimmed  = code.trim();

  const lines = React.useMemo(
    () =>
      trimmed.split("\n").map(line => ({
        html: isPlain ? line : highlight(line || " "),
        raw:  line,
      })),
    [trimmed, isPlain],
  );

  function copy() {
    navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border bg-card/80 overflow-hidden text-[12px] my-1">
      {/* Header */}
      <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/60 bg-muted/30">
        <div className="flex items-center gap-1.5">
          <IconTerminal2 size={12} strokeWidth={1.8} className="text-muted-foreground/50" />
          <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wide">
            {filename ?? language}
          </span>
        </div>
        <button
          onClick={copy}
          className="flex items-center gap-1 text-[10px] text-muted-foreground/50 hover:text-foreground transition-colors px-1.5 py-0.5 rounded"
        >
          {copied
            ? <><IconCheck size={11} className="text-primary" /> <span className="text-primary">Copied</span></>
            : <><IconCopy size={11} /> Copy</>}
        </button>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto px-4 py-3 font-mono leading-[1.65]">
        {lines.map((line, i) => (
          <div key={i}>
            {isPlain
              ? <span className="text-foreground/80">{line.raw || " "}</span>
              : <span dangerouslySetInnerHTML={{ __html: line.html }} />}
          </div>
        ))}
      </pre>
    </div>
  );
}

AIChatCodeBlock.displayName = "AIChatCodeBlock";
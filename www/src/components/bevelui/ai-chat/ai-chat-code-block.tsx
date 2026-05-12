"use client";

import * as React from "react";
import { highlight } from "sugar-high";
import {
  IconCheck,
  IconCopy,
  IconDownload,
  IconTerminal2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { AIChatAction } from "./ai-chat-action";

const PLAIN = new Set(["bash", "shell", "sh", "text", "plain", "console"]);

export function AIChatCodeBlock({
  code,
  language = "text",
  filename,
}: {
  code: string;
  language?: string;
  filename?: string;
}) {
  const [copied, setCopied] = React.useState(false);
  const isPlain = PLAIN.has(language.toLowerCase());
  const trimmed = code.trim();

  const lines = React.useMemo(
    () =>
      trimmed.split("\n").map((line) => ({
        html: isPlain ? line : highlight(line || " "),
        raw: line,
      })),
    [trimmed, isPlain],
  );

  function copy() {
    navigator.clipboard.writeText(trimmed);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="rounded-lg border border-border  bg-muted/50 overflow-hidden text-[12px] my-1 p-2.5 space-y-2.5">
      {/* Header */}
      <div className="flex items-center justify-between px-2.5">
        <div className="flex items-center gap-1.5">
          <IconTerminal2
            size={12}
            strokeWidth={1.8}
            className="text-muted-foreground/50"
          />
          <span className="text-[10px] font-mono text-muted-foreground/60 uppercase tracking-wide">
            {filename ?? language}
          </span>
        </div>
        <div>
          <AIChatAction variant={"ghost"} size={"icon"}>
            <IconDownload size={16} />
          </AIChatAction>
          <AIChatAction onClick={copy} variant={"ghost"} size={"icon"}>
            {copied ? (
              <IconCheck size={16} className="text-primary" />
            ) : (
              <IconCopy size={16} />
            )}
          </AIChatAction>
        </div>
      </div>

      {/* Code */}
      <pre className="overflow-x-auto px-4 py-3 font-mono leading-[1.65] rounded-lg bg-background border">
        {lines.map((line, i) => (
          <div key={i}>
            {isPlain ? (
              <span className="text-foreground/80">{line.raw || " "}</span>
            ) : (
              <span dangerouslySetInnerHTML={{ __html: line.html }} />
            )}
          </div>
        ))}
      </pre>
    </div>
  );
}

AIChatCodeBlock.displayName = "AIChatCodeBlock";

"use client";

import * as React from "react";
import { useAIChatCtx } from "./ai-chat-context";
import { IconCopy, IconCheck, IconThumbUp, IconThumbDown, IconRefresh } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { AIMessage } from "./types";

function Btn({ onClick, active, icon: Icon, label }: {
  onClick: () => void; active?: boolean; icon: React.ElementType; label: string;
}) {
  return (
    <button
      type="button" onClick={onClick} title={label} aria-label={label}
      className={cn(
        "p-1 rounded transition-colors",
        active
          ? "text-primary"
          : "text-muted-foreground/40 hover:text-muted-foreground",
      )}
    >
      <Icon size={13} strokeWidth={1.8} />
    </button>
  );
}

export function AIChatMessageActions({ message }: { message: AIMessage }) {
  const { regenerate } = useAIChatCtx();
  const [copied,   setCopied]   = React.useState(false);
  const [feedback, setFeedback] = React.useState<"up" | "down" | null>(null);

  function copy() {
    const text = message.content
      .filter(b => b.type === "text")
      .map(b => (b as any).text)
      .join("\n\n");
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="flex items-center gap-0.5">
      <Btn icon={copied ? IconCheck : IconCopy} label="Copy" active={copied} onClick={copy} />
      <Btn icon={IconThumbUp}   label="Good response" active={feedback === "up"}   onClick={() => setFeedback(p => p === "up"   ? null : "up")}   />
      <Btn icon={IconThumbDown} label="Bad response"  active={feedback === "down"} onClick={() => setFeedback(p => p === "down" ? null : "down")} />
      <Btn icon={IconRefresh}   label="Regenerate"    onClick={() => regenerate(message.id)} />
    </div>
  );
}

AIChatMessageActions.displayName = "AIChatMessageActions";
"use client";

import * as React from "react";
import { useAIChatCtx } from "./ai-chat-context";
import { AIChatMarkdown } from "./ai-chat-markdown";
import { AIChatCodeBlock } from "./ai-chat-code-block";
import { AIChatThinking } from "./ai-chat-thinking";
import { AIChatToolCall } from "./ai-chat-tool-call";
import { AIChatMessageActions } from "./ai-chat-message-actions";
import { IconAlertCircle, IconUser, IconRefresh } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { AIMessage, AIContentBlock } from "./types";

/**
 * Design decision (rebuild): ONE visual grammar for both roles, not a
 * user-bubble / assistant-bubble-less split. Both roles render as a
 * left-aligned block with an avatar; the only distinguishing treatment
 * is a faint background tint on user turns. This was the "feels weird"
 * inconsistency flagged in the old version.
 */

function Avatar({ role }: { role: "user" | "assistant" }) {
  const { config } = useAIChatCtx();
  const src = role === "user" ? config.userAvatar : config.assistantAvatar;

  if (typeof src === "string")
    return <img src={src} alt={role} className="w-6 h-6 rounded-full object-cover shrink-0 mt-0.5" />;
  if (React.isValidElement(src))
    return <div className="w-6 h-6 shrink-0 mt-0.5">{src}</div>;
  if (role === "user")
    return (
      <div className="w-6 h-6 rounded-full bg-muted border border-border flex items-center justify-center shrink-0 mt-0.5">
        <IconUser size={12} strokeWidth={1.8} className="text-muted-foreground" />
      </div>
    );
  return (
    <div className="w-6 h-6 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0 mt-0.5">
      <span className="text-[9px] font-bold text-primary">
        {(config.assistantName ?? "AI")[0].toUpperCase()}
      </span>
    </div>
  );
}

function Block({
  block,
  messageId,
  isLast,
  isStreaming,
}: {
  block: AIContentBlock;
  messageId: string;
  isLast: boolean;
  isStreaming: boolean;
}) {
  const { toggleThinking } = useAIChatCtx();

  switch (block.type) {
    case "text":
      return <AIChatMarkdown content={block.text} isStreaming={isStreaming && isLast} />;
    case "thinking":
      return (
        <AIChatThinking
          text={block.text}
          title={block.title}
          collapsed={block.collapsed}
          isStreaming={block.streaming}
          onToggle={() => toggleThinking(messageId, block.id)}
        />
      );
    case "tool-call":
      return (
        <AIChatToolCall
          name={block.name}
          label={block.label}
          status={block.status}
          result={block.result}
        />
      );
    case "code":
      return <AIChatCodeBlock code={block.code} language={block.language} filename={block.filename} />;
    case "image":
      return <img src={block.url} alt={block.alt ?? ""} className="max-w-sm rounded-xl border border-border" />;
    case "file":
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/40 w-fit text-[12px]">
          <span className="text-foreground/80 truncate max-w-[200px]">{block.name}</span>
          {block.size && (
            <span className="text-muted-foreground/40">{(block.size / 1024).toFixed(0)}KB</span>
          )}
        </div>
      );
    default:
      return null;
  }
}

export function AIChatMessage({ message }: { message: AIMessage }) {
  const { retry } = useAIChatCtx();
  const isUser = message.role === "user";
  const isStreaming = message.status === "streaming";
  const hasError = message.status === "error";

  return (
    <div className={cn("group flex gap-3 items-start px-4 py-3 rounded-xl", isUser && "bg-muted/30")}>
      <Avatar role={message.role === "system" ? "assistant" : message.role} />

      <div className="flex flex-col gap-1.5 min-w-0 flex-1">
        <div className="flex flex-col gap-3 text-sm">
          {message.content.map((b, i) => (
            <Block
              key={b.id}
              block={b}
              messageId={message.id}
              isLast={i === message.content.length - 1}
              isStreaming={isStreaming}
            />
          ))}

          {isStreaming && message.content.length === 0 && (
            <span className="inline-block w-0.5 h-4 bg-foreground/60 animate-pulse" />
          )}

          {hasError && (
            <div className="flex items-center justify-between gap-2 text-destructive text-xs">
              <span className="flex items-center gap-1.5">
                <IconAlertCircle size={12} />
                {message.error ?? "Something went wrong."}
              </span>
              <button
                type="button"
                onClick={() => retry(message.id)}
                className="flex items-center gap-1 text-[11px] font-medium hover:underline"
              >
                <IconRefresh size={11} /> Retry
              </button>
            </div>
          )}
        </div>

        {!isUser && message.status === "done" && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity">
            <AIChatMessageActions message={message} />
          </div>
        )}

        {!isUser && message.model && message.status === "done" && (
          <span className="text-[10px] font-mono text-muted-foreground/30">{message.model}</span>
        )}
      </div>
    </div>
  );
}

AIChatMessage.displayName = "AIChatMessage";

"use client";

import * as React from "react";
import { useAIChatCtx } from "./ai-chat-context";
import { AIChatMarkdown } from "./ai-chat-markdown";
import { AIChatCodeBlock } from "./ai-chat-code-block";
import { AIChatThinking } from "./ai-chat-thinking";
import { AIChatToolCall } from "./ai-chat-tool-call";
import { AIChatMessageActions } from "./ai-chat-message-actions";
import { IconAlertCircle, IconUser } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { AIMessage, AIContentBlock } from "./types";

function Avatar({ role }: { role: "user" | "assistant" }) {
  const { config } = useAIChatCtx();
  const src = role === "user" ? config.userAvatar : config.assistantAvatar;

  if (typeof src === "string")
    return <img src={src} alt={role} className="w-7 h-7 rounded-full object-cover shrink-0" />;
  if (React.isValidElement(src))
    return <div className="w-7 h-7 shrink-0">{src}</div>;
  if (role === "user")
    return (
      <div className="w-7 h-7 rounded-full bg-muted border border-border flex items-center justify-center shrink-0">
        <IconUser size={14} strokeWidth={1.8} className="text-muted-foreground" />
      </div>
    );
  return (
    <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
      <span className="text-[10px] font-bold text-primary">
        {(config.assistantName ?? "AI")[0].toUpperCase()}
      </span>
    </div>
  );
}

function Block({
  block, messageId, index, isLast, isStreaming,
}: {
  block: AIContentBlock; messageId: string; index: number; isLast: boolean; isStreaming: boolean;
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
          isStreaming={block.isStreaming}
          onToggle={() => toggleThinking(messageId, index)}
        />
      );
    case "tool-call":
      return <AIChatToolCall name={block.name} label={block.label} status={block.status} result={block.result} />;
    case "code":
      return <AIChatCodeBlock code={block.code} language={block.language} filename={block.filename} />;
    case "image":
      return <img src={block.url} alt={block.alt ?? ""} className="max-w-sm rounded-xl border border-border" />;
    case "file":
      return (
        <div className="flex items-center gap-2 px-3 py-2 rounded-lg border border-border bg-muted/40 w-fit text-[12px]">
          <span className="text-muted-foreground/50">📎</span>
          <span className="text-foreground/80 truncate max-w-[200px]">{block.name}</span>
          {block.size && (
            <span className="text-muted-foreground/40">{(block.size / 1024).toFixed(0)}KB</span>
          )}
        </div>
      );
    default: return null;
  }
}

export function AIChatMessage({ message }: { message: AIMessage }) {
  const isUser      = message.role === "user";
  const isStreaming = message.status === "streaming";
  const hasError    = message.status === "error";

  return (
    <div className={cn("group flex  gap-3 items-start", isUser && "flex-row-reverse")}>
      <Avatar role={message.role} />

      <div className={cn("flex flex-col gap-1.5 min-w-0 max-w-[85%]", isUser && "items-end")}>
        <div className={cn(
          "rounded-2xl px-4 py-3 text-sm",
          isUser
            ? "bg-muted/60  rounded-tr-sm"
            : "bg-card rounded-tl-sm",
        )}>
          <div className="flex flex-col gap-3">
            {message.content.map((b, i) => (
              <Block
                key={i} block={b} messageId={message.id} index={i}
                isLast={i === message.content.length - 1} isStreaming={isStreaming}
              />
            ))}

            {/* Streaming but no content yet */}
            {isStreaming && message.content.length === 0 && (
              <span className="inline-block w-0.5 h-4 bg-foreground/60 animate-pulse" />
            )}

            {/* Error */}
            {hasError && (
              <div className="flex items-center gap-1.5 text-destructive text-xs mt-1">
                <IconAlertCircle size={12} />
                <span>{message.error ?? "Something went wrong."}</span>
              </div>
            )}
          </div>
        </div>

        {/* Actions */}
        {!isUser && message.status === "done" && (
          <div className="opacity-0 group-hover:opacity-100 transition-opacity pl-1">
            <AIChatMessageActions message={message} />
          </div>
        )}

        {/* Model badge */}
        {!isUser && message.model && message.status === "done" && (
          <span className="text-[10px] font-mono text-muted-foreground/30 pl-1">{message.model}</span>
        )}
      </div>
    </div>
  );
}

AIChatMessage.displayName = "AIChatMessage";
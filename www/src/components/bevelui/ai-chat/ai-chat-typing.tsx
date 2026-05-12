"use client";

import { useAIChatCtx } from "./ai-chat-context";

export function AIChatTyping() {
  const { config } = useAIChatCtx();

  return (
    <div className="flex items-end gap-3">
      <div className="w-7 h-7 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center shrink-0">
        <span className="text-[10px] font-bold text-primary">
          {(config.assistantName ?? "AI")[0].toUpperCase()}
        </span>
      </div>
      <div className="bg-card border border-border rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex items-center gap-1">
          {[0, 1, 2].map(i => (
            <div
              key={i}
              className="w-1.5 h-1.5 rounded-full bg-muted-foreground/40 animate-bounce"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

AIChatTyping.displayName = "AIChatTyping";
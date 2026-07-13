"use client";

import { AIChatAction } from "./ai-chat-action";
import { useAIChatCtx } from "./ai-chat-context";

export function AIChatStarters() {
  const { config, send, messages } = useAIChatCtx();
  if (messages.length > 0 || !config.starters?.length) return null;

  return (
    <div className="flex gap-2 w-full py-2 px-4 overflow-x-auto">
      {config.starters.map((s, i) => (
        <AIChatAction key={i} type="button" variant="secondary" onClick={() => send(s)}>
          {s}
        </AIChatAction>
      ))}
    </div>
  );
}

AIChatStarters.displayName = "AIChatStarters";

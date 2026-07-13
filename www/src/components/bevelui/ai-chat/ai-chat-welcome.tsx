"use client";

import { useAIChatCtx } from "./ai-chat-context";

export function AIChatWelcome() {
  const { config } = useAIChatCtx();
  const hasContent = config.welcomeTitle || config.welcomeMessage;
  if (!hasContent) return null;

  return (
    <div className="flex flex-col items-center justify-center gap-6 px-4 py-4 h-full">
      <div className="text-center max-w-md">
        {config.welcomeTitle && <h2 className="text-4xl text-foreground mb-2 whitespace-pre-line tracking-tight">{config.welcomeTitle}</h2>}
        {config.welcomeMessage && <p className="text-sm leading-relaxed text-muted-foreground">{config.welcomeMessage}</p>}
      </div>
    </div>
  );
}

AIChatWelcome.displayName = "AIChatWelcome";

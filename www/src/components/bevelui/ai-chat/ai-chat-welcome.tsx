"use client";

import { useAIChatCtx } from "./ai-chat-context";

export function AIChatWelcome() {
  const { config, sendMessage } = useAIChatCtx();
  const hasContent = config.welcomeTitle || config.welcomeMessage || config.starters?.length;
  if (!hasContent) return null;

  return (
    <div className="flex flex-col items-center justify-center h-full gap-6 px-4 py-16">
      {(config.welcomeTitle || config.welcomeMessage) && (
        <div className="text-center max-w-sm">
          {config.welcomeTitle && (
            <h2 className="text-2xl font-semibold text-foreground mb-2">{config.welcomeTitle}</h2>
          )}
          {config.welcomeMessage && (
            <p className="text-sm text-muted-foreground leading-relaxed">{config.welcomeMessage}</p>
          )}
        </div>
      )}

      {!!config.starters?.length && (
        <div className="flex flex-col gap-2 w-full max-w-sm">
          {config.starters.map((s, i) => (
            <button
              key={i} type="button" onClick={() => sendMessage(s)}
              className="text-left px-4 py-3 rounded-xl border border-border bg-card/80 hover:bg-card hover:border-primary/30 text-sm text-muted-foreground hover:text-foreground transition-all"
            >
              {s}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

AIChatWelcome.displayName = "AIChatWelcome";
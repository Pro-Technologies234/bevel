"use client";

import * as React from "react";
import { useAIChatCtx } from "./ai-chat-context";
import { AIChatMessage } from "./ai-chat-message";
import { AIChatTyping } from "./ai-chat-typing";
import { AIChatWelcome } from "./ai-chat-welcome";
import { cn } from "@/lib/utils";

export function AIChatMessageList({ className }: { className?: string }) {
  const { messages, isLoading, isStreaming } = useAIChatCtx();
  const ref = React.useRef<HTMLDivElement>(null);
  const atBottomRef = React.useRef(true);

  function checkBottom() {
    const el = ref.current;
    if (!el) return true;
    return el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  }

  function scrollToBottom() {
    ref.current?.scrollTo({ top: ref.current.scrollHeight });
  }

  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fn = () => {
      atBottomRef.current = checkBottom();
    };
    el.addEventListener("scroll", fn, { passive: true });
    return () => el.removeEventListener("scroll", fn);
  }, []);

  React.useEffect(() => {
    if (atBottomRef.current) scrollToBottom();
  }, [messages, isLoading]);

  return (
    <div
      ref={ref}
      className={cn(
        "overflow-y-auto",
        messages.length > 0 && "flex-1",
        className,
      )}
    >
      {messages.length === 0 ? (
        <AIChatWelcome />
      ) : (
        <div className="flex flex-col gap-2 py-6 px-4 max-w-3xl mx-auto w-full">
          {messages.map((m) => (
            <AIChatMessage key={m.id} message={m} />
          ))}
          {isLoading && !isStreaming && <AIChatTyping />}
        </div>
      )}
    </div>
  );
}

AIChatMessageList.displayName = "AIChatMessageList";

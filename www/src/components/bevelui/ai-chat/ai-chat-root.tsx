"use client";

import * as React from "react";
import { AIChatCtx } from "./ai-chat-context";
import { useAIChatEngine } from "./use-ai-chat-engine";
import { AIChatDefaultLayout } from "./ai-chat-default-layout";
import { cn } from "@/lib/utils";
import type {
  AIContentBlock,
  AIChatContextValue,
  AIChatImperativeHandle,
  AIChatRootProps,
} from "./types";

export const AIChatRoot = React.forwardRef<AIChatImperativeHandle, AIChatRootProps>(
  function AIChatRoot(
    { onSend, messages, onMessagesChange, config = {}, defaultModel, className, children },
    ref,
  ) {
    const [model, setModel] = React.useState(
      defaultModel ?? config.defaultModel ?? config.models?.[0]?.value ?? "default",
    );
    const abortRef = React.useRef<AbortController | null>(null);

    const engine = useAIChatEngine({
      controlledMessages: messages,
      onMessagesChange,
      parseDelimiters: config.parseDelimiters,
    });

    // ─── Imperative handle (controlled mode entry point) ───────────────────
    React.useImperativeHandle(
      ref,
      () => ({
        beginAssistantMessage(m) {
          const id = engine.appendPlaceholderAssistant(m ?? model);
          abortRef.current = new AbortController();
          return engine.createSendHandle(id, m ?? model, abortRef.current.signal);
        },
        appendUserMessage(content) {
          return engine.appendUserMessage(content);
        },
      }),
      [engine, model],
    );

    // ─── Uncontrolled send lifecycle ────────────────────────────────────────
    async function send(text: string, attachments?: File[]) {
      if (!onSend) return; // controlled consumers drive their own send elsewhere

      engine.appendUserMessage([
        { type: "text", id: `u_${Date.now()}`, text },
        ...(attachments?.map<AIContentBlock>((f) => ({
          type: "file",
          id: `f_${f.name}_${Date.now()}`,
          name: f.name,
          mimeType: f.type,
          size: f.size,
        })) ?? []),
      ]);

      const assistantId = engine.appendPlaceholderAssistant(model);
      abortRef.current = new AbortController();
      const handle = engine.createSendHandle(assistantId, model, abortRef.current.signal);

      try {
        await onSend(text, handle, attachments);
        handle.finalize();
      } catch (e: unknown) {
        const isAbort = e instanceof Error && e.name === "AbortError";
        if (isAbort) {
          handle.finalize();
        } else {
          handle.fail(String(e));
        }
      }
    }

    function stop() {
      abortRef.current?.abort();
    }

    function regenerate(messageId: string) {
      const idx = engine.messages.findIndex((m) => m.id === messageId);
      if (idx < 1) return;
      const prev = engine.messages[idx - 1];
      if (prev.role !== "user") return;
      const text = prev.content.find((b) => b.type === "text")?.text ?? "";
      engine.replaceAll(engine.messages.slice(0, idx));
      send(text);
    }

    function retry(messageId: string) {
      // Retry only makes sense for a failed assistant message — re-run the
      // same preceding user turn without discarding the failed message's
      // siblings the way regenerate does.
      const idx = engine.messages.findIndex((m) => m.id === messageId);
      if (idx < 1) return;
      const prev = engine.messages[idx - 1];
      if (prev.role !== "user") return;
      const text = prev.content.find((b) => b.type === "text")?.text ?? "";
      engine.removeMessage(messageId);
      send(text);
    }

    const ctx: AIChatContextValue = {
      messages: engine.messages,
      isLoading: engine.isLoading,
      isStreaming: engine.isStreaming,
      model,
      config,
      setModel,
      send,
      stop,
      regenerate,
      retry,
      deleteMessage: engine.removeMessage,
      clearMessages: () => engine.replaceAll([]),
      toggleThinking: engine.toggleThinking,
    };

    return (
      <AIChatCtx.Provider value={ctx}>
        <div className={cn("flex flex-col h-full overflow-hidden", className)}>
          {children ?? <AIChatDefaultLayout />}
        </div>
      </AIChatCtx.Provider>
    );
  },
);

AIChatRoot.displayName = "AIChatRoot";

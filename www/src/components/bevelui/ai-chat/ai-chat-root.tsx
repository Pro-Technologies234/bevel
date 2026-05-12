"use client";

import * as React from "react";
import { AIChatCtx } from "./ai-chat-context";
import { AIChatMessageList } from "./ai-chat-message-list";
import { AIChatInput } from "./ai-chat-input";
import { cn } from "@/lib/utils";
import type {
  AIMessage,
  AIContentBlock,
  AIChatConfig,
  AIStreamCallbacks,
  AIChatContextValue,
} from "./types";
import { AIChatWelcome } from "./ai-chat-welcome";
import { AIChatStarters } from "./ai-chat-starters";

let _mid = 0;
function uid() {
  return `m_${++_mid}_${Date.now()}`;
}

export interface AIChatRootProps {
  /**
   * Uncontrolled — system manages message state.
   * Receive stream callbacks to update the assistant message.
   */
  onSend?: (
    text: string,
    callbacks: AIStreamCallbacks,
    attachments?: File[],
  ) => Promise<void>;

  /** Controlled — pair with onSendControlled, isLoading, isStreaming */
  messages?: AIMessage[];
  isLoading?: boolean;
  isStreaming?: boolean;
  onSendControlled?: (text: string, attachments?: File[]) => void;
  onStop?: () => void;

  config?: AIChatConfig;
  defaultModel?: string;
  className?: string;
  children?: React.ReactNode;
}

export function AIChatRoot({
  onSend,
  messages: controlled,
  isLoading: ctrlLoading,
  isStreaming: ctrlStreaming,
  onSendControlled,
  onStop: onStopExternal,
  config = {},
  defaultModel,
  className,
  children,
}: AIChatRootProps) {
  const isControlled = controlled !== undefined;

  const [internal, setInternal] = React.useState<AIMessage[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [streaming, setStreaming] = React.useState(false);
  const [model, setModel] = React.useState(
    defaultModel ??
      config.defaultModel ??
      config.models?.[0]?.value ??
      "default",
  );
  const abortRef = React.useRef<AbortController | null>(null);

  const messages = isControlled ? controlled! : internal;
  const isLoading = isControlled ? (ctrlLoading ?? false) : loading;
  const isStreaming = isControlled ? (ctrlStreaming ?? false) : streaming;

  // ─── Internal helpers ─────────────────────────────────────────────────────

  function patch(id: string, fn: (m: AIMessage) => AIMessage) {
    setInternal((prev) => prev.map((m) => (m.id === id ? fn(m) : m)));
  }

  function patchContent(
    id: string,
    fn: (c: AIContentBlock[]) => AIContentBlock[],
  ) {
    patch(id, (m) => ({ ...m, content: fn([...m.content]) }));
  }

  // ─── sendMessage ──────────────────────────────────────────────────────────

  async function sendMessage(text: string, attachments?: File[]) {
    if (isControlled) {
      onSendControlled?.(text, attachments);
      return;
    }
    if (!onSend) return;

    // User message
    setInternal((prev) => [
      ...prev,
      {
        id: uid(),
        role: "user",
        status: "done",
        timestamp: new Date(),
        content: [
          { type: "text", text },
          ...(attachments?.map<AIContentBlock>((f) => ({
            type: "file",
            name: f.name,
            mimeType: f.type,
            size: f.size,
          })) ?? []),
        ],
      },
    ]);

    // Assistant placeholder
    const aid = uid();
    setInternal((prev) => [
      ...prev,
      {
        id: aid,
        role: "assistant",
        status: "streaming",
        model,
        timestamp: new Date(),
        content: [],
      },
    ]);

    setLoading(true);
    abortRef.current = new AbortController();

    const cb: AIStreamCallbacks = {
      messageId: aid,
      signal: abortRef.current.signal,

      appendToken(token) {
        patchContent(aid, (c) => {
          const last = c[c.length - 1];
          if (last?.type === "text") {
            c[c.length - 1] = { type: "text", text: last.text + token };
          } else c.push({ type: "text", text: token });
          return c;
        });
        setLoading(false);
        setStreaming(true);
      },

      appendThinkingToken(token) {
        patchContent(aid, (c) => {
          const last = c[c.length - 1];
          if (last?.type === "thinking") {
            c[c.length - 1] = {
              ...last,
              text: last.text + token,
              isStreaming: true,
            };
          } else c.push({ type: "thinking", text: token, isStreaming: true });
          return c;
        });
        setLoading(false);
        setStreaming(true);
      },

      addBlock(block) {
        patchContent(aid, (c) => [...c, block]);
      },

      updateBlock(index, p) {
        patchContent(aid, (c) => {
          c[index] = { ...c[index], ...p } as AIContentBlock;
          return c;
        });
      },

      setStatus(status) {
        patch(aid, (m) => ({
          ...m,
          status,
          content: m.content.map((b) =>
            b.type === "thinking" ? { ...b, isStreaming: false } : b,
          ),
        }));
        if (status === "done" || status === "error") {
          setLoading(false);
          setStreaming(false);
        }
      },

      setError(error) {
        patch(aid, (m) => ({ ...m, status: "error", error }));
        setLoading(false);
        setStreaming(false);
      },
    };

    try {
      await onSend(text, cb, attachments);
    } catch (e: unknown) {
      const isAbort = e instanceof Error && e.name === "AbortError";
      patch(aid, (m) => ({
        ...m,
        status: isAbort ? "done" : "error",
        error: isAbort ? undefined : String(e),
      }));
      setLoading(false);
      setStreaming(false);
    }
  }

  // ─── stopGeneration ───────────────────────────────────────────────────────

  function stopGeneration() {
    abortRef.current?.abort();
    onStopExternal?.();
    setLoading(false);
    setStreaming(false);
    setInternal((prev) =>
      prev.map((m) =>
        m.status === "streaming" ? { ...m, status: "done" } : m,
      ),
    );
  }

  // ─── regenerate ───────────────────────────────────────────────────────────

  function regenerate(messageId: string) {
    const idx = messages.findIndex((m) => m.id === messageId);
    if (idx < 1) return;
    const prev = messages[idx - 1];
    if (prev.role !== "user") return;
    const text = prev.content.find((b) => b.type === "text")?.text ?? "";
    setInternal((p) => p.slice(0, idx));
    sendMessage(text);
  }

  function deleteMessage(id: string) {
    setInternal((p) => p.filter((m) => m.id !== id));
  }
  function clearMessages() {
    setInternal([]);
  }

  function toggleThinking(messageId: string, blockIndex: number) {
    patchContent(messageId, (c) => {
      const b = c[blockIndex];
      if (b?.type === "thinking")
        c[blockIndex] = { ...b, collapsed: !b.collapsed };
      return c;
    });
  }

  const ctx: AIChatContextValue = {
    messages,
    isLoading,
    isStreaming,
    model,
    config,
    setModel,
    sendMessage,
    stopGeneration,
    regenerate,
    deleteMessage,
    clearMessages,
    toggleThinking,
  };

  return (
    <AIChatCtx.Provider value={ctx}>
      {children ?? (
        <div
          className={cn(
            "flex flex-col justify-center h-full overflow-hidden",
            className,
          )}
        >
          <AIChatMessageList />
          <AIChatInput />
          <AIChatStarters />
        </div>
      )}
    </AIChatCtx.Provider>
  );
}

AIChatRoot.displayName = "AIChatRoot";

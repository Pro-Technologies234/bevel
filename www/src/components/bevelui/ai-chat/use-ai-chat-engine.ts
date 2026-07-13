import * as React from "react";
import { DelimiterParser, type ParseEvent } from "./delimiter-parser";
import type {
  AIMessage,
  AIContentBlock,
  AIStreamHandle,
  AIChatImperativeHandle,
} from "./types";

let _seq = 0;
function uid(prefix: string) {
  return `${prefix}_${++_seq}_${Date.now().toString(36)}`;
}

// ─── Immutable block helpers ───────────────────────────────────────────────────
// Every function here returns a NEW array/object — nothing is mutated in place.
// This is the direct fix for the old patchContent/updateBlock in-place bug.

function appendOrExtendText(blocks: AIContentBlock[], text: string): AIContentBlock[] {
  const last = blocks[blocks.length - 1];
  if (last?.type === "text") {
    return [...blocks.slice(0, -1), { ...last, text: last.text + text }];
  }
  return [...blocks, { type: "text", id: uid("blk"), text }];
}

function appendOrExtendThinking(
  blocks: AIContentBlock[],
  text: string,
  starting: boolean,
): AIContentBlock[] {
  const last = blocks[blocks.length - 1];
  if (!starting && last?.type === "thinking") {
    return [...blocks.slice(0, -1), { ...last, text: last.text + text, streaming: true }];
  }
  return [...blocks, { type: "thinking", id: uid("blk"), text, streaming: true }];
}

function endThinking(blocks: AIContentBlock[]): AIContentBlock[] {
  const last = blocks[blocks.length - 1];
  if (last?.type !== "thinking") return blocks;
  return [...blocks.slice(0, -1), { ...last, streaming: false }];
}

function startToolCall(
  blocks: AIContentBlock[],
  name: string,
  label: string | undefined,
): AIContentBlock[] {
  return [
    ...blocks,
    { type: "tool-call", id: uid("blk"), name, label, status: "running" as const },
  ];
}

function appendToolCallText(blocks: AIContentBlock[], text: string): AIContentBlock[] {
  const last = blocks[blocks.length - 1];
  if (last?.type !== "tool-call") return blocks;
  return [
    ...blocks.slice(0, -1),
    { ...last, result: (last.result ?? "") + text },
  ];
}

function setToolCallStatus(
  blocks: AIContentBlock[],
  status: "pending" | "running" | "done" | "error",
): AIContentBlock[] {
  const last = blocks[blocks.length - 1];
  if (last?.type !== "tool-call") return blocks;
  return [...blocks.slice(0, -1), { ...last, status }];
}

function endToolCall(blocks: AIContentBlock[]): AIContentBlock[] {
  const last = blocks[blocks.length - 1];
  if (last?.type !== "tool-call") return blocks;
  const status = last.status === "running" ? "done" : last.status;
  return [...blocks.slice(0, -1), { ...last, status }];
}

function patchBlockById(
  blocks: AIContentBlock[],
  id: string,
  patch: Partial<AIContentBlock>,
): AIContentBlock[] {
  return blocks.map((b) => (b.id === id ? ({ ...b, ...patch } as AIContentBlock) : b));
}

/** Reduces a batch of parser events into a new content-block array. */
function applyParseEvents(
  blocks: AIContentBlock[],
  events: ParseEvent[],
): AIContentBlock[] {
  let next = blocks;
  for (const ev of events) {
    switch (ev.kind) {
      case "text":
        next = appendOrExtendText(next, ev.text);
        break;
      case "thinking-start":
        next = appendOrExtendThinking(next, "", true);
        break;
      case "thinking-text":
        next = appendOrExtendThinking(next, ev.text, false);
        break;
      case "thinking-end":
        next = endThinking(next);
        break;
      case "tool-call-start":
        next = startToolCall(next, ev.name, ev.label);
        break;
      case "tool-result-status":
        next = setToolCallStatus(next, ev.status);
        break;
      case "tool-call-text":
        next = appendToolCallText(next, ev.text);
        break;
      case "tool-call-end":
        next = endToolCall(next);
        break;
    }
  }
  return next;
}

// ─── Engine ─────────────────────────────────────────────────────────────────────

export interface UseAIChatEngineOptions {
  /** Controlled mode when both are provided. */
  controlledMessages?: AIMessage[];
  onMessagesChange?: (messages: AIMessage[]) => void;
  parseDelimiters?: boolean;
}

export interface UseAIChatEngineReturn {
  messages: AIMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  isControlled: boolean;

  /** Uncontrolled entry point: engine builds the handle itself. */
  createSendHandle: (messageId: string, model: string | undefined, signal: AbortSignal) => AIStreamHandle;

  /** Shared regardless of mode. */
  appendUserMessage: (content: AIContentBlock[]) => string;
  appendPlaceholderAssistant: (model?: string) => string;
  setMessageStatus: (id: string, status: AIMessage["status"], error?: string) => void;
  removeMessage: (id: string) => void;
  replaceAll: (messages: AIMessage[]) => void;
  toggleThinking: (messageId: string, blockId: string) => void;
}

export function useAIChatEngine(opts: UseAIChatEngineOptions): UseAIChatEngineReturn {
  const isControlled = opts.controlledMessages !== undefined;
  const [internal, setInternal] = React.useState<AIMessage[]>([]);
  const messages = isControlled ? opts.controlledMessages! : internal;

  const [loadingCount, setLoadingCount] = React.useState(0);
  const [streamingCount, setStreamingCount] = React.useState(0);

  function commit(next: AIMessage[] | ((prev: AIMessage[]) => AIMessage[])) {
    if (isControlled) {
      const resolved = typeof next === "function" ? (next as any)(messages) : next;
      opts.onMessagesChange?.(resolved);
    } else {
      setInternal(next as any);
    }
  }

  function patchMessage(id: string, fn: (m: AIMessage) => AIMessage) {
    commit((prev) => prev.map((m) => (m.id === id ? fn(m) : m)));
  }

  function appendUserMessage(content: AIContentBlock[]): string {
    const id = uid("msg");
    commit((prev) => [
      ...prev,
      { id, role: "user", status: "done", timestamp: new Date(), content },
    ]);
    return id;
  }

  function appendPlaceholderAssistant(model?: string): string {
    const id = uid("msg");
    commit((prev) => [
      ...prev,
      { id, role: "assistant", status: "streaming", model, timestamp: new Date(), content: [] },
    ]);
    return id;
  }

  function setMessageStatus(id: string, status: AIMessage["status"], error?: string) {
    patchMessage(id, (m) => ({ ...m, status, error }));
  }

  function removeMessage(id: string) {
    commit((prev) => prev.filter((m) => m.id !== id));
  }

  function replaceAll(next: AIMessage[]) {
    commit(next);
  }

  function toggleThinking(messageId: string, blockId: string) {
    patchMessage(messageId, (m) => ({
      ...m,
      content: m.content.map((b) =>
        b.id === blockId && b.type === "thinking" ? { ...b, collapsed: !b.collapsed } : b,
      ),
    }));
  }

  /** Builds a stream handle bound to a specific message id, wiring parser
   *  events (raw mode) and direct pushBlock/patchBlock (structured mode)
   *  into the same immutable content-block reducer. */
  function createSendHandle(
    messageId: string,
    _model: string | undefined,
    signal: AbortSignal,
  ): AIStreamHandle {
    const parser = new DelimiterParser();
    const parsingEnabled = opts.parseDelimiters ?? true;

    function applyEvents(events: ParseEvent[]) {
      if (events.length === 0) return;
      patchMessage(messageId, (m) => ({ ...m, content: applyParseEvents(m.content, events) }));
      setLoadingCount((c) => Math.max(0, c - 1));
      setStreamingCount((c) => c + 1);
    }

    return {
      messageId,
      signal,

      appendRawToken(token) {
        if (!parsingEnabled) {
          patchMessage(messageId, (m) => ({ ...m, content: appendOrExtendText(m.content, token) }));
          setLoadingCount((c) => Math.max(0, c - 1));
          setStreamingCount((c) => c + 1);
          return;
        }
        applyEvents(parser.push(token));
      },

      pushBlock(block) {
        const id = uid("blk");
        patchMessage(messageId, (m) => ({ ...m, content: [...m.content, { ...block, id } as AIContentBlock] }));
        setLoadingCount((c) => Math.max(0, c - 1));
        setStreamingCount((c) => c + 1);
        return id;
      },

      patchBlock(id, patch) {
        patchMessage(messageId, (m) => ({ ...m, content: patchBlockById(m.content, id, patch) }));
      },

      finalize() {
        if (parsingEnabled) applyEvents(parser.flush());
        patchMessage(messageId, (m) => ({
          ...m,
          status: "done",
          content: m.content.map((b) =>
            b.type === "thinking" ? { ...b, streaming: false } : b,
          ),
        }));
        setStreamingCount((c) => Math.max(0, c - 1));
      },

      fail(error) {
        patchMessage(messageId, (m) => ({ ...m, status: "error", error }));
        setLoadingCount(0);
        setStreamingCount(0);
      },
    };
  }

  return {
    messages,
    isLoading: loadingCount > 0,
    isStreaming: streamingCount > 0,
    isControlled,
    createSendHandle,
    appendUserMessage,
    appendPlaceholderAssistant,
    setMessageStatus,
    removeMessage,
    replaceAll,
    toggleThinking,
  };
}

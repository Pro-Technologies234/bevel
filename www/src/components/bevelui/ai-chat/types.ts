import * as React from "react";

// ─── Roles & Status ───────────────────────────────────────────────────────────

export type AIMessageRole = "user" | "assistant" | "system";
export type AIMessageStatus = "streaming" | "done" | "error";

// ─── Content Blocks ────────────────────────────────────────────────────────────
// Immutable-by-construction: every mutation produces a new block, never patches
// an existing one in place. The engine is responsible for building new arrays.

export type AIContentBlock =
  | { type: "text"; id: string; text: string }
  | {
      type: "thinking";
      id: string;
      text: string;
      title?: string;
      collapsed?: boolean;
      streaming?: boolean;
    }
  | {
      type: "tool-call";
      id: string;
      name: string;
      label?: string;
      status: "pending" | "running" | "done" | "error";
      args?: Record<string, unknown>;
      result?: string;
    }
  | { type: "code"; id: string; code: string; language: string; filename?: string }
  | { type: "image"; id: string; url: string; alt?: string }
  | {
      type: "file";
      id: string;
      name: string;
      mimeType: string;
      url?: string;
      size?: number;
    };

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: AIContentBlock[];
  status?: AIMessageStatus;
  error?: string;
  model?: string;
  timestamp?: Date;
}

// ─── Config ────────────────────────────────────────────────────────────────────

export interface AIChatConfig {
  assistantName?: string;
  assistantAvatar?: string | React.ReactNode;
  userAvatar?: string | React.ReactNode;
  welcomeTitle?: string;
  welcomeMessage?: string;
  starters?: string[];
  models?: { value: string; label: string }[];
  defaultModel?: string;
  placeholder?: string;
  maxAttachments?: number;
  /**
   * Turn off Bevel's built-in ::thinking::/::tool_call:: delimiter parsing
   * for raw-mode streams. Default: enabled.
   */
  parseDelimiters?: boolean;
}

// ─── Stream Producer API ───────────────────────────────────────────────────────
// What a consumer's `onSend` implementation is handed. Two supply modes,
// same underlying engine state machine on the other side of both.

export interface AIStreamHandle {
  messageId: string;
  signal: AbortSignal;

  /** Raw mode: feed raw text chunks. Bevel's parser detects
   *  ::thinking::/::tool_call{}:: markers incrementally, even split
   *  across chunk boundaries, and promotes content into typed blocks. */
  appendRawToken: (token: string) => void;

  /** Structured mode: bypass the parser, push a fully-formed block. */
  pushBlock: (block: Omit<AIContentBlock, "id">) => string; // returns new block id

  /** Structured mode: immutably patch a previously pushed block by id. */
  patchBlock: (id: string, patch: Partial<AIContentBlock>) => void;

  finalize: () => void;
  fail: (error: string) => void;
}

export type AISendFn = (
  text: string,
  handle: AIStreamHandle,
  attachments?: File[],
) => Promise<void>;

// ─── Root Props (controlled + uncontrolled, unified engine) ───────────────────

export interface AIChatRootProps {
  /**
   * Uncontrolled: engine owns the message array end-to-end.
   * Engine calls onSend(text, handle) and assembles the result internally.
   */
  onSend?: AISendFn;

  /**
   * Controlled: consumer owns the committed message array and drives the
   * stream themselves (their own SSE hook, Vercel AI SDK, etc.) via the
   * imperative handle obtained through a ref. The engine still owns the
   * parsing/block-assembly logic, but doesn't own *when* a send happens
   * or *how* the network call is made — full independence from Bevel's
   * send lifecycle.
   */
  messages?: AIMessage[];
  onMessagesChange?: (messages: AIMessage[]) => void;

  config?: AIChatConfig;
  defaultModel?: string;
  className?: string;
  children?: React.ReactNode;
}

/**
 * Imperative handle for controlled mode, obtained via
 * `React.useRef<AIChatImperativeHandle>` + forwardRef on AIChatRoot.
 * Lets an externally-owned stream (outside Bevel's send lifecycle)
 * push into the same block-assembly engine used in uncontrolled mode.
 */
export interface AIChatImperativeHandle {
  /** Start a new assistant message and return a handle to stream into it. */
  beginAssistantMessage: (model?: string) => AIStreamHandle;
  /** Append a pre-built user message (e.g. consumer already sent it via their own API). */
  appendUserMessage: (content: AIContentBlock[]) => string; // returns message id
}

// ─── Context Value ─────────────────────────────────────────────────────────────

export interface AIChatContextValue {
  messages: AIMessage[];
  isLoading: boolean;
  isStreaming: boolean;
  model: string;
  config: AIChatConfig;

  setModel: (model: string) => void;
  send: (text: string, attachments?: File[]) => void;
  stop: () => void;
  regenerate: (messageId: string) => void;
  retry: (messageId: string) => void;
  deleteMessage: (messageId: string) => void;
  clearMessages: () => void;
  toggleThinking: (messageId: string, blockId: string) => void;
}

import * as React from "react";

export type AIMessageRole   = "user" | "assistant";
export type AIMessageStatus = "streaming" | "done" | "error";

export type AIContentBlock =
  | { type: "text";     text: string }
  | { type: "thinking"; text: string; title?: string; collapsed?: boolean; isStreaming?: boolean }
  | { type: "tool-call"; id: string; name: string; label?: string; status: "pending" | "running" | "done" | "error"; result?: string }
  | { type: "code";     code: string; language: string; filename?: string }
  | { type: "image";    url: string; alt?: string }
  | { type: "file";     name: string; mimeType: string; url?: string; size?: number };

export interface AIMessage {
  id:        string;
  role:      AIMessageRole;
  content:   AIContentBlock[];
  status?:   AIMessageStatus;
  error?:    string;
  model?:    string;
  timestamp?: Date;
}

export interface AIChatConfig {
  assistantName?:    string;
  assistantAvatar?:  string | React.ReactNode;
  userAvatar?:       string | React.ReactNode;
  welcomeTitle?:     string;
  welcomeMessage?:   string;
  starters?:         string[];
  models?:           { value: string; label: string }[];
  defaultModel?:     string;
  placeholder?:      string;
  maxAttachments?:   number;
}

/** Callbacks injected into onSend for uncontrolled streaming */
export interface AIStreamCallbacks {
  messageId:           string;
  appendToken:         (token: string) => void;
  appendThinkingToken: (token: string) => void;
  addBlock:            (block: AIContentBlock) => void;
  updateBlock:         (index: number, patch: Partial<AIContentBlock>) => void;
  setStatus:           (status: AIMessageStatus) => void;
  setError:            (error: string) => void;
  signal:              AbortSignal;
}

export interface AIChatContextValue {
  messages:        AIMessage[];
  isLoading:       boolean;
  isStreaming:     boolean;
  model:           string;
  config:          AIChatConfig;
  setModel:        (model: string) => void;
  sendMessage:     (text: string, attachments?: File[]) => void;
  stopGeneration:  () => void;
  regenerate:      (messageId: string) => void;
  deleteMessage:   (messageId: string) => void;
  clearMessages:   () => void;
  toggleThinking:  (messageId: string, blockIndex: number) => void;
}
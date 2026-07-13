"use client";

import * as React from "react";
import type { AIChatContextValue } from "./types";

export const AIChatCtx = React.createContext<AIChatContextValue | null>(null);

export function useAIChatCtx(): AIChatContextValue {
  const ctx = React.useContext(AIChatCtx);
  if (!ctx) throw new Error("useAIChatCtx must be used inside AIChatRoot");
  return ctx;
}

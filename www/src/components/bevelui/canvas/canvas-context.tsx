"use client";

import * as React from "react";
import type { CanvasContextValue } from "./types";

export const CanvasCtx = React.createContext<CanvasContextValue | null>(null);

export function useCanvasCtx(): CanvasContextValue {
  const ctx = React.useContext(CanvasCtx);
  if (!ctx) throw new Error("useCanvasCtx must be used inside CanvasRoot");
  return ctx;
}

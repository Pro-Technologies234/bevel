"use client";

import * as React from "react";
import type { VisualizerContextValue } from "./types";

export const VisualizerCtx = React.createContext<VisualizerContextValue | null>(null);

export function useVisualizerCtx(): VisualizerContextValue {
  const ctx = React.useContext(VisualizerCtx);
  if (!ctx) throw new Error("useVisualizerCtx must be used inside AudioVisualizerRoot");
  return ctx;
}

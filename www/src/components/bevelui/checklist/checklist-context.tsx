"use client";

import * as React from "react";
import type { ChecklistContextValue } from "./types";

export const ChecklistCtx = React.createContext<ChecklistContextValue | null>(null);

export function useChecklist(): ChecklistContextValue {
  const ctx = React.useContext(ChecklistCtx);
  if (!ctx) throw new Error("useChecklist must be used inside ChecklistRoot");
  return ctx;
}
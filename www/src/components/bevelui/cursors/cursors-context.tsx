"use client";

import * as React from "react";
import type { CursorsContextValue } from "./cursors-types";

export const CursorsCtx = React.createContext<CursorsContextValue | null>(null);

export function useCursors(): CursorsContextValue {
  const ctx = React.useContext(CursorsCtx);
  if (!ctx) throw new Error("useCursors must be used inside CursorsRoot");
  return ctx;
}

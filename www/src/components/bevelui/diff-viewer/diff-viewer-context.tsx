"use client";

import * as React from "react";
import type { MergeEditorContextValue } from "./types";

export const DiffViewerCtx = React.createContext<MergeEditorContextValue | null>(null);

export function useDiffViewerCtx(): MergeEditorContextValue {
  const ctx = React.useContext(DiffViewerCtx);
  if (!ctx) throw new Error("useDiffViewerCtx must be used inside DiffViewerRoot");
  return ctx;
}

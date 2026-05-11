"use client";

import * as React from "react";
import type { SortableContextValue } from "./sortable-types";

export const SortableCtx = React.createContext<SortableContextValue | null>(null);

export function useSortableCtx(): SortableContextValue {
  const ctx = React.useContext(SortableCtx);
  if (!ctx) throw new Error("useSortableCtx must be used inside SortableRoot");
  return ctx;
}

// Carries dnd-kit listeners from SortableItem → SortableHandle
export const SortableHandleCtx = React.createContext<
  Record<string, React.EventHandler<React.SyntheticEvent>> | undefined
>(undefined);
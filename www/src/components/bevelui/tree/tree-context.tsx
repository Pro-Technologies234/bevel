import * as React from "react";
import type { TreeContextValue } from "./types";

export const TreeCtx = React.createContext<TreeContextValue | null>(null);

export function useTree<T = unknown>(): TreeContextValue<T> {
  const ctx = React.useContext(TreeCtx);
  if (!ctx) throw new Error("useTree must be used inside TreeRoot");
  return ctx as TreeContextValue<T>;
}

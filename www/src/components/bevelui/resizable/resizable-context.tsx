"use client";

import * as React from "react";
import type { ResizableContextValue } from "./types";

export const ResizableCtx = React.createContext<ResizableContextValue | null>(
  null,
);

export function useResizable(): ResizableContextValue {
  const ctx = React.useContext(ResizableCtx);
  if (!ctx) throw new Error("useResizable must be used inside ResizableRoot");
  return ctx;
}

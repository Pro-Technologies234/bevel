"use client";

import * as React from "react";
import type { CropperContextValue } from "./types";

export const CropperCtx = React.createContext<CropperContextValue | null>(null);

export function useCropper(): CropperContextValue {
  const ctx = React.useContext(CropperCtx);
  if (!ctx) throw new Error("useCropper must be used inside CropperRoot");
  return ctx;
}
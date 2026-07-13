import * as React from "react";
import type { PaletteContextValue } from "./types";

export const PaletteCtx = React.createContext<PaletteContextValue | null>(null);

export function usePalette(): PaletteContextValue {
  const ctx = React.useContext(PaletteCtx);
  if (!ctx) throw new Error("usePalette must be used inside PaletteRoot");
  return ctx;
}

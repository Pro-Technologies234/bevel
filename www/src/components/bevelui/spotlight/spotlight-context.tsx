"use client";

import * as React from "react";
import type { SpotlightContextValue } from "./types";

export const SpotlightCtx = React.createContext<SpotlightContextValue | null>(null);

export function useSpotlight(): SpotlightContextValue {
  const ctx = React.useContext(SpotlightCtx);
  if (!ctx) throw new Error("useSpotlight must be used inside SpotlightRoot");
  return ctx;
}
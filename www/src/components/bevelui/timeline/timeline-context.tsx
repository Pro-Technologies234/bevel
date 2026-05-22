"use client";

import * as React from "react";
import type { TimelineContextValue } from "./types";

export const TimelineCtx = React.createContext<TimelineContextValue | null>(
  null,
);

export function useTimeline(): TimelineContextValue {
  const ctx = React.useContext(TimelineCtx);
  if (!ctx) throw new Error("useTimeline must be used inside TimelineRoot");
  return ctx;
}

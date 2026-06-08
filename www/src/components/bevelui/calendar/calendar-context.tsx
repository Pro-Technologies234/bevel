"use client";
import * as React from "react";
import type { CalendarContextValue, CalendarEventBase } from "./types";
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const CalendarCtx = React.createContext<CalendarContextValue<any> | null>(null);
export function useCalendar<T extends CalendarEventBase>(): CalendarContextValue<T> {
  const ctx = React.useContext(CalendarCtx);
  if (!ctx) throw new Error("useCalendar must be used inside CalendarRoot");
  return ctx as CalendarContextValue<T>;
}

"use client";
import * as React from "react";
import { CalendarCtx } from "./calendar-context";
import { resolveConfig, addMonths, addWeeks, addDays } from "./calendar-engine";
import type { CalendarEventBase, CalendarConfig, CalendarContextValue, CalendarView } from "./types";
import { cn } from "@/lib/utils";

export interface CalendarRootProps<T extends CalendarEventBase> {
  events: T[];
  config?: CalendarConfig;
  onEventClick?: (event: T) => void;
  onEventMove?: (event: T, newStart: Date, newEnd: Date) => void;
  onEventResize?: (event: T, newEnd: Date) => void;
  onRangeSelect?: (start: Date, end: Date) => void;
  onDayClick?: (date: Date) => void;
  children: React.ReactNode;
  className?: string;
}

export function CalendarRoot<T extends CalendarEventBase>({ events, config: configProp, onEventClick, onEventMove, onEventResize, onRangeSelect, onDayClick, children, className }: CalendarRootProps<T>) {
  const config = React.useMemo(() => resolveConfig(configProp), [configProp]);
  const [currentDate, setCurrentDate] = React.useState<Date>(() => new Date());
  const [activeView, setActiveView] = React.useState<CalendarView>(config.defaultView);
  const [selectedEventId, setSelectedEventId] = React.useState<string | null>(null);
  const [selectedEventAnchor, setSelectedEventAnchor] = React.useState<HTMLElement | null>(null);

  const navigate = React.useCallback((date: Date) => setCurrentDate(date), []);
  const goToToday = React.useCallback(() => setCurrentDate(new Date()), []);
  const prev = React.useCallback(() => {
    setCurrentDate(d => activeView === "month" || activeView === "agenda" ? addMonths(d,-1) : activeView === "week" ? addWeeks(d,-1) : addDays(d,-1));
  }, [activeView]);
  const next = React.useCallback(() => {
    setCurrentDate(d => activeView === "month" || activeView === "agenda" ? addMonths(d,1) : activeView === "week" ? addWeeks(d,1) : addDays(d,1));
  }, [activeView]);
  const setView = React.useCallback((view: CalendarView) => setActiveView(view), []);
  const selectEvent = React.useCallback((id: string | null, anchor?: HTMLElement | null) => { setSelectedEventId(id); setSelectedEventAnchor(anchor ?? null); }, []);

  React.useEffect(() => { setSelectedEventId(null); setSelectedEventAnchor(null); }, [currentDate, activeView]);

  const ctx: CalendarContextValue<T> = { events, currentDate, activeView, selectedEventId, selectedEventAnchor, config, navigate, goToToday, prev, next, setView, selectEvent, onEventClick, onEventMove, onEventResize, onRangeSelect, onDayClick };

  return (
    <CalendarCtx.Provider value={ctx}>
      <div className={cn("flex flex-col gap-0", className)}>{children}</div>
    </CalendarCtx.Provider>
  );
}
CalendarRoot.displayName = "CalendarRoot";

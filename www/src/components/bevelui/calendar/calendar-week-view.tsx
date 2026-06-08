"use client";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import { CalendarTimeGrid } from "./calendar-time-grid";
import { getWeekDays } from "./calendar-engine";
import type { CalendarEventBase, CalendarView } from "./types";

export interface CalendarWeekViewProps<T extends CalendarEventBase> {
  renderEvent?: (event: T, view: CalendarView) => React.ReactNode;
  renderDayHeader?: (date: Date) => React.ReactNode;
  renderTimeSlot?: (date: Date, hour: number) => React.ReactNode;
  renderNowIndicator?: () => React.ReactNode;
  className?: string;
}

export function CalendarWeekView<T extends CalendarEventBase>({ renderEvent, renderDayHeader, renderTimeSlot, renderNowIndicator, className }: CalendarWeekViewProps<T>) {
  const { currentDate, config } = useCalendar<T>();
  const days = getWeekDays(currentDate, config.weekStartsOn);
  return <CalendarTimeGrid<T> days={days} view="week" renderEvent={renderEvent} renderDayHeader={renderDayHeader} renderTimeSlot={renderTimeSlot} renderNowIndicator={renderNowIndicator} className={className} />;
}
CalendarWeekView.displayName = "CalendarWeekView";

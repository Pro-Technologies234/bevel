"use client";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import { CalendarTimeGrid } from "./calendar-time-grid";
import type { CalendarEventBase, CalendarView } from "./types";

export interface CalendarDayViewProps<T extends CalendarEventBase> {
  renderEvent?: (event: T, view: CalendarView) => React.ReactNode;
  renderDayHeader?: (date: Date) => React.ReactNode;
  renderTimeSlot?: (date: Date, hour: number) => React.ReactNode;
  renderNowIndicator?: () => React.ReactNode;
  className?: string;
}

export function CalendarDayView<T extends CalendarEventBase>({ renderEvent, renderDayHeader, renderTimeSlot, renderNowIndicator, className }: CalendarDayViewProps<T>) {
  const { currentDate } = useCalendar<T>();
  return <CalendarTimeGrid<T> days={[currentDate]} view="day" renderEvent={renderEvent} renderDayHeader={renderDayHeader} renderTimeSlot={renderTimeSlot} renderNowIndicator={renderNowIndicator} className={className} />;
}
CalendarDayView.displayName = "CalendarDayView";

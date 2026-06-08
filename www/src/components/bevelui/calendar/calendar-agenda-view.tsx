"use client";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import { addDays, isSameDay, isToday, fmt, formatTime, resolveEventColor, startOfDay, endOfDay } from "./calendar-engine";
import { cn } from "@/lib/utils";
import type { CalendarEventBase, CalendarView } from "./types";

export interface CalendarAgendaViewProps<T extends CalendarEventBase> {
  renderEventRow?: (event: T, view: CalendarView) => React.ReactNode;
  lookaheadDays?: number;
  className?: string;
}

export function CalendarAgendaView<T extends CalendarEventBase>({ renderEventRow, lookaheadDays = 60, className }: CalendarAgendaViewProps<T>) {
  const { events, currentDate, selectEvent, onEventClick } = useCalendar<T>();
  const days = Array.from({ length: lookaheadDays }, (_, i) => addDays(currentDate, i));
  const groups = days.map(date => ({
    date,
    events: events.filter(e => {
      const ds = startOfDay(date); const de = endOfDay(date);
      return e.start <= de && e.end >= ds;
    }).sort((a,b) => a.start.getTime() - b.start.getTime()),
  })).filter(g => g.events.length > 0);

  if (groups.length === 0) {
    return <div className={cn("flex flex-col flex-1 items-center justify-center py-16 text-muted-foreground/40 text-sm border border-border rounded-xl", className)}>No events in the next {lookaheadDays} days</div>;
  }

  return (
    <div className={cn("flex flex-col flex-1 border border-border rounded-xl overflow-hidden divide-y divide-border/40", className)}>
      {groups.map(({ date, events: dayEvents }) => (
        <div key={date.toISOString()} className="flex">
          <div className={cn("w-20 flex-shrink-0 flex flex-col items-center justify-start pt-3 pb-2 px-2 border-r border-border/40", isToday(date) && "bg-primary/5")}>
            <span className={cn("text-[9px] font-medium uppercase tracking-wide", isToday(date) ? "text-primary" : "text-muted-foreground/50")}>{fmt(date,"EEE")}</span>
            <span className={cn("text-xl font-semibold leading-tight", isToday(date) ? "text-primary" : "text-foreground/80")}>{date.getDate()}</span>
            <span className="text-[9px] text-muted-foreground/40">{fmt(date,"MMM")}</span>
          </div>
          <div className="flex-1 flex flex-col divide-y divide-border/20 py-1">
            {dayEvents.map(event => (
              <div key={`${event.id}-${date.toISOString()}`} className="px-3 py-2 hover:bg-muted/30 cursor-pointer transition-colors"
                onClick={e => { selectEvent(event.id, e.currentTarget); onEventClick?.(event); }}>
                {renderEventRow ? renderEventRow(event, "agenda") : <DefaultAgendaRow event={event} />}
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
CalendarAgendaView.displayName = "CalendarAgendaView";

function DefaultAgendaRow<T extends CalendarEventBase>({ event }: { event: T }) {
  const color = resolveEventColor(event);
  const isMultiDay = event.allDay || !isSameDay(event.start, event.end);
  return (
    <div className="flex items-start gap-3">
      <div className="w-1 self-stretch rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: color }} />
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium text-foreground truncate">{event.title}</p>
        <p className="text-[11px] text-muted-foreground/60 mt-0.5">
          {isMultiDay ? (event.allDay ? "All day" : `${fmt(event.start,"MMM d")} – ${fmt(event.end,"MMM d")}`) : `${formatTime(event.start)} – ${formatTime(event.end)}`}
        </p>
      </div>
    </div>
  );
}

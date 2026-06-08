"use client";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import { getMonthGrid, getEventsForDay, getSpanningEvents, getSpanColumns, isSameDay, isSameMonth, isToday, resolveEventColor, colorAlpha, startOfWeek, endOfWeek } from "./calendar-engine";
import { cn } from "@/lib/utils";
import type { CalendarEventBase, CalendarView } from "./types";

const DAY_HEADERS_MON = ["Mon","Tue","Wed","Thu","Fri","Sat","Sun"];
const DAY_HEADERS_SUN = ["Sun","Mon","Tue","Wed","Thu","Fri","Sat"];
const MAX_VISIBLE = 3;

export interface CalendarMonthViewProps<T extends CalendarEventBase> {
  renderEvent?: (event: T, view: CalendarView) => React.ReactNode;
  renderDayCell?: (date: Date, events: T[]) => React.ReactNode;
  renderDayHeader?: (label: string, index: number) => React.ReactNode;
  className?: string;
}

export function CalendarMonthView<T extends CalendarEventBase>({ renderEvent, renderDayCell, renderDayHeader, className }: CalendarMonthViewProps<T>) {
  const { events, currentDate, config, selectEvent, onDayClick, onEventClick } = useCalendar<T>();
  const days = getMonthGrid(currentDate, config.weekStartsOn);
  const headers = config.weekStartsOn === 1 ? DAY_HEADERS_MON : DAY_HEADERS_SUN;
  const weeks: Date[][] = [];
  for (let i = 0; i < 42; i += 7) weeks.push(days.slice(i, i+7));

  return (
    <div className={cn("flex flex-col flex-1 border border-border rounded-xl overflow-hidden", className)}>
      <div className="grid grid-cols-7 border-b border-border bg-muted/20">
        {headers.map((h,i) => renderDayHeader ? renderDayHeader(h,i) : (
          <div key={h} className="py-2 text-center text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wide">{h}</div>
        ))}
      </div>
      <div className="flex flex-col flex-1 divide-y divide-border/60">
        {weeks.map((week, wi) => {
          const weekStart = startOfWeek(week[0], config.weekStartsOn);
          const weekEnd = endOfWeek(week[0], config.weekStartsOn);
          const spanning = getSpanningEvents(events, weekStart, weekEnd);
          return (
            <div key={wi} className="relative flex-1 min-h-[100px]">
              <div className="grid grid-cols-7 h-full divide-x divide-border/40">
                {week.map((date, di) => {
                  const inMonth = isSameMonth(date, currentDate);
                  const today = isToday(date);
                  const dayEvents = getEventsForDay(events, date).filter(e => !e.allDay && isSameDay(e.start, e.end));
                  return (
                    <div key={di} className={cn("flex flex-col gap-0.5 p-1 min-h-[100px] cursor-pointer", !inMonth && "bg-muted/10", today && "bg-primary/5")}
                      onClick={() => onDayClick?.(date)}>
                      <div className="flex items-center justify-end mb-1">
                        <span className={cn("w-6 h-6 flex items-center justify-center rounded-full text-[11px] font-medium", today ? "bg-primary text-black" : inMonth ? "text-foreground/80" : "text-muted-foreground/30")}>{date.getDate()}</span>
                      </div>
                      <div className="h-5" />
                      {dayEvents.slice(0, MAX_VISIBLE).map(event => {
                        const color = resolveEventColor(event);
                        return (
                          <button key={event.id} type="button" data-event
                            className="w-full h-5 flex items-center rounded-sm px-1.5 overflow-hidden text-left hover:opacity-80 transition-opacity"
                            style={{ backgroundColor: colorAlpha(color, 0.2), borderLeft: `3px solid ${color}` }}
                            onClick={e => { e.stopPropagation(); selectEvent(event.id, e.currentTarget); onEventClick?.(event); }}>
                            {renderEvent ? renderEvent(event,"month") : <span className="text-[10px] font-medium truncate" style={{ color }}>{event.title}</span>}
                          </button>
                        );
                      })}
                      {dayEvents.length > MAX_VISIBLE && (
                        <button type="button" className="text-[10px] text-muted-foreground/60 hover:text-foreground text-left px-1 transition-colors" onClick={e => e.stopPropagation()}>
                          +{dayEvents.length - MAX_VISIBLE} more
                        </button>
                      )}
                      {renderDayCell?.(date, dayEvents)}
                    </div>
                  );
                })}
              </div>
              <div className="absolute inset-0 pointer-events-none grid grid-cols-7">
                {week.map((date, di) => {
                  const startingHere = spanning.filter(e => { const { startCol } = getSpanColumns(e, week); return startCol === di; });
                  return (
                    <div key={di} className="relative">
                      {startingHere.map((event, ei) => {
                        const { span } = getSpanColumns(event, week);
                        const color = resolveEventColor(event, ei);
                        return (
                          <div key={event.id} className="pointer-events-auto absolute top-7 h-5 flex items-center rounded-sm px-1.5 cursor-pointer z-10 overflow-hidden"
                            style={{ left:0, width:`${span*100}%`, backgroundColor: colorAlpha(color,0.25), borderLeft:`3px solid ${color}`, marginTop:`${ei*22}px` }}
                            onClick={e => { e.stopPropagation(); selectEvent(event.id, e.currentTarget); onEventClick?.(event); }}>
                            {renderEvent ? renderEvent(event,"month") : <span className="text-[10px] font-medium truncate" style={{ color }}>{event.title}</span>}
                          </div>
                        );
                      })}
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
CalendarMonthView.displayName = "CalendarMonthView";

"use client";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import { computeOverlapLayout, getTimedEventsForDay, getSpanningEvents, getSpanColumns, getHourSlots, formatHour, formatTime, getNowPercent, yToDate, isToday, fmt, resolveEventColor, colorAlpha, startOfWeek, endOfWeek } from "./calendar-engine";
import { cn } from "@/lib/utils";
import type { CalendarEventBase, CalendarView, LayoutEvent } from "./types";

const TIME_LABEL_WIDTH = 52;

export interface CalendarTimeGridProps<T extends CalendarEventBase> {
  days: Date[];
  view: CalendarView;
  renderEvent?: (event: T, view: CalendarView) => React.ReactNode;
  renderDayHeader?: (date: Date) => React.ReactNode;
  renderTimeSlot?: (date: Date, hour: number) => React.ReactNode;
  renderNowIndicator?: () => React.ReactNode;
  className?: string;
}

export function CalendarTimeGrid<T extends CalendarEventBase>({ days, view, renderEvent, renderDayHeader, renderTimeSlot, renderNowIndicator, className }: CalendarTimeGridProps<T>) {
  const { events, config, selectEvent, onEventClick, onEventMove, onEventResize, onRangeSelect } = useCalendar<T>();
  const { startHour, endHour, hourHeight, slotInterval, snapToGrid, workingHours } = config;
  const hourSlots = getHourSlots(startHour, endHour);
  const totalHeight = hourSlots.length * hourHeight;
  const weekStart = days[0]; const weekEnd = days[days.length-1];
  const spanning = getSpanningEvents(events, startOfWeek(weekStart, config.weekStartsOn), endOfWeek(weekEnd, config.weekStartsOn));
  const [nowPct, setNowPct] = React.useState(() => getNowPercent(startHour, endHour));
  React.useEffect(() => { const id = setInterval(() => setNowPct(getNowPercent(startHour, endHour)), 60000); return () => clearInterval(id); }, [startHour, endHour]);
  const showNow = days.some(d => isToday(d));
  const scrollRef = React.useRef<HTMLDivElement>(null);
  React.useLayoutEffect(() => {
    if (!scrollRef.current) return;
    const now = new Date(); const target = Math.max(0, (now.getHours() - startHour - 1)) * hourHeight;
    scrollRef.current.scrollTop = target;
  }, []); // eslint-disable-line

  return (
    <div className={cn("flex flex-col flex-1 border border-border rounded-xl overflow-hidden", className)}>
      {spanning.length > 0 && (
        <div className="flex border-b border-border bg-muted/20 flex-shrink-0">
          <div className="flex-shrink-0 flex items-center justify-end pr-2 py-1" style={{ width: TIME_LABEL_WIDTH }}>
            <span className="text-[9px] text-muted-foreground/40 uppercase tracking-wide">All day</span>
          </div>
          <div className="flex flex-1 divide-x divide-border/40">
            {days.map((day, di) => {
              const here = spanning.filter(e => { const { startCol } = getSpanColumns(e, days); return startCol === di; });
              return (
                <div key={di} className="relative flex-1 py-0.5 min-h-[24px]">
                  {here.map((event, ei) => {
                    const { span } = getSpanColumns(event, days); const color = resolveEventColor(event, ei);
                    return (
                      <div key={event.id} className="absolute inset-y-0.5 left-0.5 flex items-center rounded-sm px-1.5 cursor-pointer overflow-hidden z-10"
                        style={{ width:`calc(${span*100}% - 4px)`, backgroundColor: colorAlpha(color,0.25), borderLeft:`3px solid ${color}`, marginTop: ei*22 }}
                        onClick={e => { selectEvent(event.id, e.currentTarget); onEventClick?.(event); }}>
                        <span className="text-[10px] font-medium truncate" style={{ color }}>{event.title}</span>
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="flex flex-shrink-0 border-b border-border bg-muted/20">
        <div style={{ width: TIME_LABEL_WIDTH }} className="flex-shrink-0" />
        <div className="flex flex-1 divide-x divide-border/40">
          {days.map(day => (
            <div key={day.toISOString()} className="flex-1 py-2 text-center">
              {renderDayHeader ? renderDayHeader(day) : (
                <div className="flex flex-col items-center gap-0.5">
                  {view === "week" && <span className="text-[9px] text-muted-foreground/50 uppercase tracking-wide">{fmt(day,"EEE")}</span>}
                  <span className={cn("w-7 h-7 flex items-center justify-center rounded-full text-sm font-semibold", isToday(day) ? "bg-primary text-black" : "text-foreground/80")}>{day.getDate()}</span>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      <div ref={scrollRef} className="flex-1 overflow-y-auto overflow-x-hidden">
        <div className="flex" style={{ height: totalHeight }}>
          <div className="flex-shrink-0 flex flex-col" style={{ width: TIME_LABEL_WIDTH }}>
            {hourSlots.map(hour => (
              <div key={hour} className="flex-shrink-0 flex items-start justify-end pr-2 pt-0.5" style={{ height: hourHeight }}>
                <span className="text-[9px] font-mono text-muted-foreground/40">{formatHour(hour)}</span>
              </div>
            ))}
          </div>
          <div className="flex flex-1 divide-x divide-border/40 relative">
            <div className="absolute inset-0 pointer-events-none">
              {hourSlots.map(hour => <div key={hour} className="absolute left-0 right-0 border-t border-border/30" style={{ top: (hour-startHour)*hourHeight }} />)}
              {workingHours && <>
                <div className="absolute left-0 right-0 bg-muted/20" style={{ top:0, height:(workingHours.start-startHour)*hourHeight }} />
                <div className="absolute left-0 right-0 bg-muted/20" style={{ top:(workingHours.end-startHour)*hourHeight, bottom:0 }} />
              </>}
              {showNow && (
                <div className="absolute left-0 right-0 z-20 flex items-center pointer-events-none" style={{ top:`${nowPct}%` }}>
                  {renderNowIndicator ? renderNowIndicator() : <><div className="w-2 h-2 rounded-full bg-red-500 -ml-1 flex-shrink-0" /><div className="flex-1 h-px bg-red-500/70" /></>}
                </div>
              )}
            </div>
            {days.map(day => (
              <DayColumn key={day.toISOString()} day={day} view={view} events={getTimedEventsForDay(events, day)}
                totalHeight={totalHeight} hourHeight={hourHeight} startHour={startHour} endHour={endHour}
                slotInterval={slotInterval} snapToGrid={snapToGrid}
                renderEvent={renderEvent} renderTimeSlot={renderTimeSlot}
                selectEvent={selectEvent} onEventClick={onEventClick} onEventMove={onEventMove} onEventResize={onEventResize} onRangeSelect={onRangeSelect} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
CalendarTimeGrid.displayName = "CalendarTimeGrid";

interface DayColumnProps<T extends CalendarEventBase> {
  day: Date; view: CalendarView; events: T[]; totalHeight: number; hourHeight: number;
  startHour: number; endHour: number; slotInterval: number; snapToGrid: boolean;
  renderEvent?: (event: T, view: CalendarView) => React.ReactNode;
  renderTimeSlot?: (date: Date, hour: number) => React.ReactNode;
  selectEvent: (id: string | null, anchor?: HTMLElement | null) => void;
  onEventClick?: (event: T) => void;
  onEventMove?: (event: T, newStart: Date, newEnd: Date) => void;
  onEventResize?: (event: T, newEnd: Date) => void;
  onRangeSelect?: (start: Date, end: Date) => void;
}

function DayColumn<T extends CalendarEventBase>({ day, view, events, totalHeight, hourHeight, startHour, endHour, slotInterval, snapToGrid, renderEvent, renderTimeSlot, selectEvent, onEventClick, onEventMove, onEventResize, onRangeSelect }: DayColumnProps<T>) {
  const columnRef = React.useRef<HTMLDivElement>(null);
  const ghostRef = React.useRef<HTMLDivElement>(null);
  const layout = React.useMemo(() => computeOverlapLayout(events, startHour, endHour), [events, startHour, endHour]);
  const creating = React.useRef<{ startY: number; startTime: Date; endTime: Date } | null>(null);
  const moving = React.useRef<{ event: T; el: HTMLElement; origHeight: number; pointerOffsetY: number } | null>(null);
  const resizing = React.useRef<{ event: T; el: HTMLElement } | null>(null);

  function getGridY(clientY: number): number {
    const rect = columnRef.current!.getBoundingClientRect();
    return Math.max(0, Math.min(totalHeight, clientY - rect.top));
  }
  function snapArg() { return snapToGrid ? slotInterval : 1; }

  function onGridPointerDown(e: React.PointerEvent) {
    if ((e.target as HTMLElement).closest("[data-event]")) return;
    if (e.button !== 0) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const y = getGridY(e.clientY);
    const time = yToDate(y, totalHeight, day, startHour, endHour, snapArg());
    creating.current = { startY: y, startTime: time, endTime: time };
    if (ghostRef.current) { ghostRef.current.style.top=`${(y/totalHeight)*100}%`; ghostRef.current.style.height="0%"; ghostRef.current.style.display="block"; }
  }
  function onGridPointerMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;
    if (creating.current) {
      const y = getGridY(e.clientY);
      creating.current.endTime = yToDate(y, totalHeight, day, startHour, endHour, snapArg());
      if (ghostRef.current) {
        const topY = Math.min(creating.current.startY, y); const botY = Math.max(creating.current.startY, y);
        ghostRef.current.style.top=`${(topY/totalHeight)*100}%`; ghostRef.current.style.height=`${((botY-topY)/totalHeight)*100}%`;
      }
    }
    if (moving.current) {
      const { el, origHeight, pointerOffsetY } = moving.current;
      const y = getGridY(e.clientY);
      const newTopY = Math.max(0, Math.min(totalHeight - origHeight, y - pointerOffsetY));
      el.style.top = `${(newTopY/totalHeight)*100}%`;
      (el as any)._pendingTopPct = (newTopY/totalHeight)*100;
    }
    if (resizing.current) {
      const { el } = resizing.current;
      const y = getGridY(e.clientY);
      const topPx = parseFloat(el.style.top)/100*totalHeight;
      const newH = Math.max(hourHeight/4, y - topPx);
      el.style.height=`${(newH/totalHeight)*100}%`;
      (el as any)._pendingHeightPct=(newH/totalHeight)*100;
    }
  }
  function onGridPointerUp() {
    if (creating.current) {
      const { startTime, endTime } = creating.current;
      const [s,en] = startTime<=endTime ? [startTime,endTime] : [endTime,startTime];
      if (s.getTime()!==en.getTime()) onRangeSelect?.(s,en);
      if (ghostRef.current) ghostRef.current.style.display="none";
      creating.current = null;
    }
    if (moving.current) {
      const { event, el } = moving.current;
      const topPct = (el as any)._pendingTopPct;
      if (topPct !== undefined) {
        const newStart = yToDate((topPct/100)*totalHeight, totalHeight, day, startHour, endHour, snapArg());
        const duration = event.end.getTime() - event.start.getTime();
        onEventMove?.(event, newStart, new Date(newStart.getTime()+duration));
        delete (el as any)._pendingTopPct;
      }
      moving.current = null;
    }
    if (resizing.current) {
      const { event, el } = resizing.current;
      const hPct = (el as any)._pendingHeightPct;
      if (hPct !== undefined) {
        const topPct = parseFloat(el.style.top);
        const newEnd = yToDate(((topPct+hPct)/100)*totalHeight, totalHeight, day, startHour, endHour, snapArg());
        onEventResize?.(event, newEnd);
        delete (el as any)._pendingHeightPct;
      }
      resizing.current = null;
    }
  }

  return (
    <div ref={columnRef} className={cn("relative flex-1 cursor-crosshair", isToday(day) && "bg-primary/[0.02]")} style={{ height: totalHeight }}
      onPointerDown={onGridPointerDown} onPointerMove={onGridPointerMove} onPointerUp={onGridPointerUp}>
      {renderTimeSlot && Array.from({length: endHour-startHour}, (_,i) => (
        <div key={i} className="absolute left-0 right-0 pointer-events-none" style={{ top:i*hourHeight, height:hourHeight }}>{renderTimeSlot(day, startHour+i)}</div>
      ))}
      {layout.map(({ event, column, columnCount, top, height }) => {
        const color = resolveEventColor(event); const GAP = 2;
        const leftPct = (column/columnCount)*100; const widthPct = (1/columnCount)*100;
        return (
          <div key={event.id} data-event className="absolute rounded-md overflow-hidden cursor-grab active:cursor-grabbing hover:z-10 hover:opacity-90 will-change-transform"
            style={{ top:`${top}%`, height:`${Math.max(height,2)}%`, left:`calc(${leftPct}% + ${GAP}px)`, width:`calc(${widthPct}% - ${GAP*2}px)`, backgroundColor:colorAlpha(color,0.15), borderLeft:`3px solid ${color}`, zIndex:5 }}
            onPointerDown={e => {
              if ((e.target as HTMLElement).closest("[data-resize]")) return;
              e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId);
              const rect = e.currentTarget.getBoundingClientRect();
              moving.current = { event, el: e.currentTarget as HTMLElement, origHeight:(height/100)*totalHeight, pointerOffsetY: e.clientY - rect.top };
              selectEvent(event.id, e.currentTarget as HTMLElement); onEventClick?.(event);
            }}>
            {renderEvent ? renderEvent(event, view) : (
              <div className="px-1.5 py-1 h-full flex flex-col gap-0.5 overflow-hidden">
                <span className="text-[10px] font-semibold leading-tight" style={{ color }}>{event.title}</span>
                <span className="text-[9px] text-muted-foreground/60">{formatTime(event.start)} – {formatTime(event.end)}</span>
              </div>
            )}
            <div data-resize className="absolute bottom-0 left-0 right-0 h-2 cursor-s-resize hover:bg-white/10"
              onPointerDown={e => { e.stopPropagation(); e.currentTarget.setPointerCapture(e.pointerId); resizing.current = { event, el: e.currentTarget.parentElement as HTMLElement }; }} />
          </div>
        );
      })}
      <div ref={ghostRef} className="absolute left-1 right-1 hidden rounded-md border border-primary bg-primary/10 pointer-events-none z-30" />
    </div>
  );
}

"use client";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import { getMonthGrid, isSameDay, isToday, isSameMonth, addMonths, getWeekDays, fmt } from "./calendar-engine";
import { IconChevronLeft, IconChevronRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const DAY_ABBR_MON = ["Mo","Tu","We","Th","Fr","Sa","Su"];
const DAY_ABBR_SUN = ["Su","Mo","Tu","We","Th","Fr","Sa"];

export interface CalendarMiniProps { className?: string; }

export function CalendarMini({ className }: CalendarMiniProps) {
  const { currentDate, activeView, navigate, config } = useCalendar();
  const [miniMonth, setMiniMonth] = React.useState<Date>(() => { const d = new Date(currentDate); d.setDate(1); d.setHours(0,0,0,0); return d; });
  React.useEffect(() => { const d = new Date(currentDate); d.setDate(1); d.setHours(0,0,0,0); setMiniMonth(d); }, [currentDate]);
  const days = getMonthGrid(miniMonth, config.weekStartsOn);
  const weekDays = config.weekStartsOn === 1 ? DAY_ABBR_MON : DAY_ABBR_SUN;
  function isHighlighted(date: Date): boolean {
    if (activeView === "day") return isSameDay(date, currentDate);
    if (activeView === "week") return getWeekDays(currentDate, config.weekStartsOn).some(d => isSameDay(d, date));
    return isSameMonth(date, currentDate);
  }
  return (
    <div className={cn("w-full select-none", className)}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-[12px] font-semibold text-foreground">{fmt(miniMonth, "MMMM yyyy")}</span>
        <div className="flex items-center gap-0.5">
          <button type="button" onClick={() => setMiniMonth(d => addMonths(d,-1))} className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"><IconChevronLeft size={11} strokeWidth={2.5} /></button>
          <button type="button" onClick={() => setMiniMonth(d => addMonths(d,1))} className="w-5 h-5 flex items-center justify-center rounded hover:bg-muted/60 text-muted-foreground hover:text-foreground transition-colors"><IconChevronRight size={11} strokeWidth={2.5} /></button>
        </div>
      </div>
      <div className="grid grid-cols-7 mb-1">
        {weekDays.map(d => <div key={d} className="text-center text-[9px] font-medium text-muted-foreground/50 py-0.5">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-y-0.5">
        {days.map((date, i) => {
          const inMonth = isSameMonth(date, miniMonth); const today = isToday(date); const highlighted = isHighlighted(date);
          return (
            <button key={i} type="button" onClick={() => navigate(date)}
              className={cn("h-6 w-full flex items-center justify-center rounded text-[11px] transition-colors",
                !inMonth && "text-muted-foreground/25",
                inMonth && !today && !highlighted && "text-foreground/70 hover:bg-muted/50",
                highlighted && !today && "bg-primary/10 text-primary",
                today && "bg-primary text-black font-semibold")}>
              {date.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
CalendarMini.displayName = "CalendarMini";

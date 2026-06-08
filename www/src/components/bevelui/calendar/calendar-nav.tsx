"use client";
import * as React from "react";
import { useCalendar } from "./calendar-context";
import { formatNavLabel } from "./calendar-engine";
import { IconChevronLeft, IconChevronRight, IconCalendar } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { CalendarView } from "./types";

const VIEWS: { value: CalendarView; label: string }[] = [
  { value: "month", label: "Month" }, { value: "week", label: "Week" },
  { value: "day", label: "Day" }, { value: "agenda", label: "Agenda" },
];

export interface CalendarNavProps { views?: CalendarView[]; className?: string; }

export function CalendarNav({ views = ["month","week","day","agenda"], className }: CalendarNavProps) {
  const { currentDate, activeView, prev, next, goToToday, setView, config } = useCalendar();
  const label = formatNavLabel(currentDate, activeView, config.weekStartsOn);
  return (
    <div className={cn("flex items-center justify-between gap-3 px-1 py-2", className)}>
      <div className="flex items-center gap-1">
        <button type="button" onClick={goToToday} className="flex items-center gap-1 px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors">
          <IconCalendar size={13} strokeWidth={1.8} /><span className="text-[11px] font-medium">Today</span>
        </button>
        <div className="w-px h-4 bg-border/60 mx-0.5" />
        <button type="button" onClick={prev} aria-label="Previous" className="flex items-center px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"><IconChevronLeft size={14} strokeWidth={2} /></button>
        <button type="button" onClick={next} aria-label="Next" className="flex items-center px-2 py-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"><IconChevronRight size={14} strokeWidth={2} /></button>
      </div>
      <span className="text-sm font-semibold tracking-tight text-foreground flex-1 text-center">{label}</span>
      {views.length > 1 && (
        <div className="flex items-center gap-0.5 p-0.5 rounded-lg border border-border bg-muted/30">
          {VIEWS.filter(v => views.includes(v.value)).map(v => (
            <button key={v.value} type="button" onClick={() => setView(v.value)}
              className={cn("px-2.5 py-1 rounded-md text-[11px] font-medium transition-colors", activeView === v.value ? "bg-primary text-black shadow-sm" : "text-muted-foreground hover:text-foreground hover:bg-muted/60")}>
              {v.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
CalendarNav.displayName = "CalendarNav";

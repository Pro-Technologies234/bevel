import type {
  CalendarConfig,
  CalendarEventBase,
  LayoutEvent,
  ResolvedCalendarConfig,
} from "./types";

export function resolveConfig(c: CalendarConfig = {}): ResolvedCalendarConfig {
  return {
    defaultView: c.defaultView ?? "month",
    weekStartsOn: c.weekStartsOn ?? 1,
    startHour: c.startHour ?? 0,
    endHour: c.endHour ?? 24,
    slotInterval: c.slotInterval ?? 30,
    workingHours:
      c.workingHours !== undefined ? c.workingHours : { start: 9, end: 17 },
    snapToGrid: c.snapToGrid ?? true,
    hourHeight: c.hourHeight ?? 64,
  };
}

export function isSameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}
export function isToday(date: Date): boolean {
  return isSameDay(date, new Date());
}
export function isSameMonth(a: Date, b: Date): boolean {
  return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth();
}
export function startOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  return d;
}
export function endOfDay(date: Date): Date {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}
export function addDays(date: Date, n: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + n);
  return d;
}
export function addWeeks(date: Date, n: number): Date {
  return addDays(date, n * 7);
}
export function addMonths(date: Date, n: number): Date {
  const d = new Date(date);
  d.setMonth(d.getMonth() + n);
  return d;
}
export function startOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = (day - weekStartsOn + 7) % 7;
  d.setDate(d.getDate() - diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
export function endOfWeek(date: Date, weekStartsOn: 0 | 1): Date {
  return addDays(startOfWeek(date, weekStartsOn), 6);
}

export function getMonthGrid(date: Date, weekStartsOn: 0 | 1): Date[] {
  const year = date.getFullYear();
  const month = date.getMonth();
  const firstDay = new Date(year, month, 1);
  const lastDay = new Date(year, month + 1, 0);
  const startPad = (firstDay.getDay() - weekStartsOn + 7) % 7;
  const days: Date[] = [];
  for (let i = startPad; i > 0; i--) days.push(new Date(year, month, 1 - i));
  for (let d = 1; d <= lastDay.getDate(); d++)
    days.push(new Date(year, month, d));
  while (days.length < 42) days.push(addDays(days[days.length - 1], 1));
  return days;
}
export function getWeekDays(date: Date, weekStartsOn: 0 | 1): Date[] {
  const monday = startOfWeek(date, weekStartsOn);
  return Array.from({ length: 7 }, (_, i) => addDays(monday, i));
}
export function getHourSlots(startHour: number, endHour: number): number[] {
  return Array.from({ length: endHour - startHour }, (_, i) => startHour + i);
}
export function timeToPercent(
  date: Date,
  startHour: number,
  endHour: number,
): number {
  const totalMinutes = (endHour - startHour) * 60;
  const minutes = (date.getHours() - startHour) * 60 + date.getMinutes();
  return Math.max(0, Math.min(100, (minutes / totalMinutes) * 100));
}
export function yToDate(
  y: number,
  gridHeight: number,
  dayDate: Date,
  startHour: number,
  endHour: number,
  snapMinutes: number,
): Date {
  const totalMinutes = (endHour - startHour) * 60;
  const rawMinutes = (y / gridHeight) * totalMinutes;
  const snapped = Math.round(rawMinutes / snapMinutes) * snapMinutes;
  const clamped = Math.max(0, Math.min(totalMinutes, snapped));
  const d = startOfDay(dayDate);
  d.setHours(startHour);
  d.setMinutes(clamped);
  return d;
}
export function getNowPercent(startHour: number, endHour: number): number {
  return timeToPercent(new Date(), startHour, endHour);
}
export function isCurrentPeriod(days: Date[]): boolean {
  const today = new Date();
  return days.some((d) => isSameDay(d, today));
}

export function getEventsForDay<T extends CalendarEventBase>(
  events: T[],
  day: Date,
): T[] {
  const start = startOfDay(day);
  const end = endOfDay(day);
  return events.filter((e) => e.start < end && e.end > start);
}
export function getTimedEventsForDay<T extends CalendarEventBase>(
  events: T[],
  day: Date,
): T[] {
  return getEventsForDay(events, day).filter((e) => !e.allDay);
}
export function getSpanningEvents<T extends CalendarEventBase>(
  events: T[],
  weekStart: Date,
  weekEnd: Date,
): T[] {
  return events.filter((e) => {
    const isMultiDay =
      e.allDay ||
      e.end.getTime() - e.start.getTime() >= 24 * 60 * 60 * 1000 ||
      !isSameDay(e.start, e.end);
    return (
      isMultiDay &&
      e.start <= endOfDay(weekEnd) &&
      e.end >= startOfDay(weekStart)
    );
  });
}
export function getSpanColumns(
  event: CalendarEventBase,
  weekDays: Date[],
): { startCol: number; span: number } {
  const weekStart = weekDays[0];
  const weekEnd = weekDays[6];
  const displayStart =
    event.start < startOfDay(weekStart) ? weekStart : event.start;
  const displayEnd =
    event.end > endOfDay(weekEnd) ? addDays(weekEnd, 1) : event.end;
  const startCol = weekDays.findIndex((d) => isSameDay(d, displayStart));
  const safeStart = startCol === -1 ? 0 : startCol;
  const endCol = weekDays.findIndex((d) =>
    isSameDay(d, addDays(displayEnd, -1)),
  );
  const safeEnd = endCol === -1 ? 6 : endCol;
  return { startCol: safeStart, span: safeEnd - safeStart + 1 };
}

export function computeOverlapLayout<T extends CalendarEventBase>(
  events: T[],
  startHour: number,
  endHour: number,
): LayoutEvent<T>[] {
  if (!events.length) return [];
  const totalMinutes = (endHour - startHour) * 60;
  const sorted = [...events]
    .filter((e) => !e.allDay)
    .sort((a, b) => {
      const diff = a.start.getTime() - b.start.getTime();
      if (diff !== 0) return diff;
      return (
        b.end.getTime() -
        b.start.getTime() -
        (a.end.getTime() - a.start.getTime())
      );
    });
  if (!sorted.length) return [];
  const groups: T[][] = [];
  let current: T[] = [sorted[0]];
  let groupEnd = sorted[0].end;
  for (let i = 1; i < sorted.length; i++) {
    const e = sorted[i];
    if (e.start < groupEnd) {
      current.push(e);
      if (e.end > groupEnd) groupEnd = e.end;
    } else {
      groups.push(current);
      current = [e];
      groupEnd = e.end;
    }
  }
  groups.push(current);
  const result: LayoutEvent<T>[] = [];
  for (const group of groups) {
    const columns: T[][] = [];
    for (const event of group) {
      let placed = false;
      for (let col = 0; col < columns.length; col++) {
        const last = columns[col][columns[col].length - 1];
        if (last.end <= event.start) {
          columns[col].push(event);
          placed = true;
          break;
        }
      }
      if (!placed) columns.push([event]);
    }
    const columnCount = columns.length;
    for (let col = 0; col < columns.length; col++) {
      for (const event of columns[col]) {
        const startMins = Math.max(
          0,
          (event.start.getHours() - startHour) * 60 + event.start.getMinutes(),
        );
        const endMins = Math.min(
          totalMinutes,
          (event.end.getHours() - startHour) * 60 + event.end.getMinutes(),
        );
        result.push({
          event,
          column: col,
          columnCount,
          top: (startMins / totalMinutes) * 100,
          height: Math.max(1.5, ((endMins - startMins) / totalMinutes) * 100),
        });
      }
    }
  }
  return result;
}

const DAY_NAMES = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];
const DAY_SHORT = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const MONTH_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export function fmt(date: Date, pattern: string): string {
  return pattern
    .replace("EEEE", DAY_NAMES[date.getDay()])
    .replace("EEE", DAY_SHORT[date.getDay()])
    .replace("MMMM", MONTH_NAMES[date.getMonth()])
    .replace("MMM", MONTH_SHORT[date.getMonth()])
    .replace("yyyy", String(date.getFullYear()))
    .replace("dd", String(date.getDate()).padStart(2, "0"))
    .replace("d", String(date.getDate()));
}
export function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? "PM" : "AM";
  const display = h % 12 || 12;
  return m === 0
    ? `${display} ${period}`
    : `${display}:${String(m).padStart(2, "0")} ${period}`;
}
export function formatHour(hour: number): string {
  if (hour === 0) return "12 AM";
  if (hour === 12) return "12 PM";
  return hour < 12 ? `${hour} AM` : `${hour - 12} PM`;
}
export function formatNavLabel(
  date: Date,
  view: "month" | "week" | "day" | "agenda",
  weekStartsOn: 0 | 1,
): string {
  if (view === "month" || view === "agenda")
    return `${MONTH_NAMES[date.getMonth()]} ${date.getFullYear()}`;
  if (view === "day")
    return `${DAY_NAMES[date.getDay()]}, ${MONTH_SHORT[date.getMonth()]} ${date.getDate()}`;
  const days = getWeekDays(date, weekStartsOn);
  const first = days[0];
  const last = days[6];
  if (first.getMonth() === last.getMonth())
    return `${MONTH_SHORT[first.getMonth()]} ${first.getDate()} – ${last.getDate()}, ${first.getFullYear()}`;
  return `${MONTH_SHORT[first.getMonth()]} ${first.getDate()} – ${MONTH_SHORT[last.getMonth()]} ${last.getDate()}, ${first.getFullYear()}`;
}

const DEFAULT_COLORS = [
  "#c2f13c",
  "#60a5fa",
  "#f97316",
  "#a78bfa",
  "#34d399",
  "#fb7185",
  "#fbbf24",
  "#38bdf8",
];
export function resolveEventColor(event: CalendarEventBase, index = 0): string {
  return event.color ?? DEFAULT_COLORS[index % DEFAULT_COLORS.length];
}
export function colorAlpha(hex: string, alpha: number): string {
  return `${hex}${Math.round(alpha * 255)
    .toString(16)
    .padStart(2, "0")}`;
}

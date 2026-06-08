export type CalendarEventBase = {
  id: string;
  title: string;
  start: Date;
  end: Date;
  allDay?: boolean;
  color?: string;
  calendarId?: string;
};

export type CalendarView = "month" | "week" | "day" | "agenda";

export type CalendarConfig = {
  defaultView?: CalendarView;
  weekStartsOn?: 0 | 1;
  startHour?: number;
  endHour?: number;
  slotInterval?: number;
  workingHours?: { start: number; end: number } | null;
  snapToGrid?: boolean;
  hourHeight?: number;
};

export type ResolvedCalendarConfig = Required<CalendarConfig>;

export type LayoutEvent<T extends CalendarEventBase> = {
  event: T;
  column: number;
  columnCount: number;
  top: number;
  height: number;
};

export type CalendarContextValue<T extends CalendarEventBase> = {
  events: T[];
  currentDate: Date;
  activeView: CalendarView;
  selectedEventId: string | null;
  selectedEventAnchor: HTMLElement | null;
  config: ResolvedCalendarConfig;
  navigate: (date: Date) => void;
  goToToday: () => void;
  prev: () => void;
  next: () => void;
  setView: (view: CalendarView) => void;
  selectEvent: (id: string | null, anchor?: HTMLElement | null) => void;
  onEventMove?: (event: T, newStart: Date, newEnd: Date) => void;
  onEventResize?: (event: T, newEnd: Date) => void;
  onRangeSelect?: (start: Date, end: Date) => void;
  onDayClick?: (date: Date) => void;
  onEventClick?: (event: T) => void;
};

"use client";

import * as React from "react";
import {
  CalendarRoot,
  CalendarNav,
  CalendarMini,
  CalendarMonthView,
  CalendarWeekView,
  CalendarDayView,
  CalendarAgendaView,
  CalendarEventPopover,
  useCalendar,
  type CalendarEventBase,
  type CalendarView,
} from "@/components/bevelui/calendar";
import { cn } from "@/lib/utils";
import { IconMapPin, IconUsers, IconVideo } from "@tabler/icons-react";

// ─── Extended event type ───────────────────────────────────────────────────────
// Consumer adds their own fields on top of CalendarEventBase

type AppEvent = CalendarEventBase & {
  location?: string;
  attendees?: number;
  type?: "meeting" | "focus" | "deadline" | "personal";
};

// ─── Sample data ───────────────────────────────────────────────────────────────

function buildEvents(): AppEvent[] {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  const d = now.getDate();

  const dt = (
    dayOffset: number,
    startH: number,
    startMin: number,
    endH: number,
    endMin: number,
  ): { start: Date; end: Date } => ({
    start: new Date(y, m, d + dayOffset, startH, startMin),
    end: new Date(y, m, d + dayOffset, endH, endMin),
  });

  return [
    // This week
    {
      id: "e1",
      title: "Design review",
      ...dt(0, 10, 0, 11, 0),
      color: "#60a5fa",
      type: "meeting",
      attendees: 4,
    },
    {
      id: "e2",
      title: "Standup",
      ...dt(0, 9, 0, 9, 30),
      color: "#34d399",
      type: "meeting",
      attendees: 8,
    },
    {
      id: "e3",
      title: "Deep work — Calendar system",
      ...dt(0, 13, 0, 17, 0),
      color: "#c2f13c",
      type: "focus",
    },
    {
      id: "e4",
      title: "Investor call",
      ...dt(1, 14, 0, 15, 0),
      color: "#f97316",
      type: "meeting",
      attendees: 3,
      location: "Google Meet",
    },
    {
      id: "e5",
      title: "Ship Bevel Pro",
      start: new Date(y, m, d + 1, 0, 0),
      end: new Date(y, m, d + 1, 23, 59),
      color: "#c2f13c",
      allDay: true,
      type: "deadline",
    },
    {
      id: "e6",
      title: "Standup",
      ...dt(1, 9, 0, 9, 30),
      color: "#34d399",
      type: "meeting",
      attendees: 8,
    },
    {
      id: "e7",
      title: "1:1 with Seun",
      ...dt(2, 11, 0, 11, 30),
      color: "#a78bfa",
      type: "meeting",
      attendees: 2,
    },
    {
      id: "e8",
      title: "Standup",
      ...dt(2, 9, 0, 9, 30),
      color: "#34d399",
      type: "meeting",
      attendees: 8,
    },
    {
      id: "e9",
      title: "User interviews",
      ...dt(2, 14, 0, 17, 0),
      color: "#fb7185",
      type: "meeting",
      attendees: 1,
      location: "Zoom",
    },
    {
      id: "e10",
      title: "Sprint planning",
      ...dt(3, 10, 0, 12, 0),
      color: "#60a5fa",
      type: "meeting",
      attendees: 6,
    },
    {
      id: "e11",
      title: "Standup",
      ...dt(3, 9, 0, 9, 30),
      color: "#34d399",
      type: "meeting",
      attendees: 8,
    },
    {
      id: "e12",
      title: "Lagos Tech Meetup",
      start: new Date(y, m, d + 4, 0, 0),
      end: new Date(y, m, d + 6, 23, 59),
      color: "#f97316",
      allDay: true,
      type: "personal",
    },
    {
      id: "e13",
      title: "Dentist",
      ...dt(5, 10, 0, 10, 45),
      color: "#fb7185",
      type: "personal",
      location: "Victoria Island",
    },
    {
      id: "e14",
      title: "Deep work — Docs",
      ...dt(-1, 9, 0, 13, 0),
      color: "#c2f13c",
      type: "focus",
    },
    {
      id: "e15",
      title: "Standup",
      ...dt(-1, 9, 0, 9, 30),
      color: "#34d399",
      type: "meeting",
      attendees: 8,
    },
    {
      id: "e16",
      title: "Weekly review",
      ...dt(-1, 17, 0, 18, 0),
      color: "#a78bfa",
      type: "focus",
    },
    {
      id: "e17",
      title: "Founders dinner",
      ...dt(6, 19, 0, 22, 0),
      color: "#fbbf24",
      type: "personal",
      location: "Ikoyi",
    },
    {
      id: "e18",
      title: "Overlapping meeting A",
      ...dt(0, 10, 0, 12, 0),
      color: "#a78bfa",
      type: "meeting",
    },
    {
      id: "e19",
      title: "Overlapping meeting B",
      ...dt(0, 10, 30, 11, 30),
      color: "#fb7185",
      type: "meeting",
    },
  ];
}

const EVENTS = buildEvents();

// ─── Custom event card for time grid ──────────────────────────────────────────

function EventCard({ event, view }: { event: AppEvent; view: CalendarView }) {
  const Icon =
    event.type === "meeting"
      ? IconUsers
      : event.type === "focus"
        ? null
        : event.type === "personal"
          ? IconMapPin
          : IconVideo;

  if (view === "month") {
    return (
      <span
        className="text-[10px] font-medium truncate"
        style={{ color: event.color }}
      >
        {event.title}
      </span>
    );
  }

  if (view === "agenda") {
    return null; // use default agenda row
  }

  return (
    <div className="px-1.5 py-1 h-full flex flex-col gap-0.5 overflow-hidden">
      <div className="flex items-start gap-1">
        {Icon && (
          <Icon
            size={9}
            strokeWidth={2}
            style={{ color: event.color }}
            className="mt-0.5 flex-shrink-0"
          />
        )}
        <span
          className="text-[10px] font-semibold leading-tight line-clamp-2"
          style={{ color: event.color }}
        >
          {event.title}
        </span>
      </div>
      {event.location && (
        <span className="text-[9px] text-muted-foreground/50 truncate">
          {event.location}
        </span>
      )}
    </div>
  );
}

// ─── Custom event popover content ──────────────────────────────────────────────

function EventPopoverContent({
  event,
  close,
}: {
  event: AppEvent;
  close: () => void;
}) {
  const {
    formatTime,
    fmt,
    isSameDay,
  } = require("@/components/bevelui/calendar");

  return (
    <div className="p-4 flex flex-col gap-3">
      {/* Colour strip */}
      <div
        className="h-1 rounded-full -mx-4 -mt-4 mb-1"
        style={{ background: event.color }}
      />

      {/* Title + close */}
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-sm font-semibold text-foreground leading-snug flex-1">
          {event.title}
        </h3>
        <button
          type="button"
          onClick={close}
          className="text-muted-foreground/40 hover:text-foreground transition-colors mt-0.5"
        >
          ×
        </button>
      </div>

      {/* Meta rows */}
      <div className="flex flex-col gap-1.5 text-[11px] text-muted-foreground/70">
        {event.attendees && (
          <div className="flex items-center gap-2">
            <IconUsers size={11} strokeWidth={1.8} />
            <span>
              {event.attendees} attendee{event.attendees !== 1 ? "s" : ""}
            </span>
          </div>
        )}
        {event.location && (
          <div className="flex items-center gap-2">
            <IconMapPin size={11} strokeWidth={1.8} />
            <span>{event.location}</span>
          </div>
        )}
        {event.type && (
          <span
            className="w-fit px-1.5 py-0.5 rounded-full text-[9px] font-medium uppercase tracking-wide"
            style={{
              background: `${event.color}22`,
              color: event.color,
            }}
          >
            {event.type}
          </span>
        )}
      </div>
    </div>
  );
}

// ─── Shell — must be inside CalendarRoot ──────────────────────────────────────

function CalendarShell() {
  const { activeView } = useCalendar<AppEvent>();

  const renderEvent = (event: AppEvent, view: CalendarView) => (
    <EventCard event={event} view={view} />
  );

  return (
    <div className="flex gap-4 h-[640px]">
      {/* Sidebar */}
      <div className="w-44 flex-shrink-0 flex flex-col gap-4 py-1">
        <CalendarMini />
        <Legend />
      </div>

      {/* Main calendar area */}
      <div className="flex-1 flex flex-col gap-2 min-w-0 min-h-0">
        <CalendarNav />

        <div className="flex-1 min-h-0">
          {activeView === "month" && (
            <CalendarMonthView<AppEvent> renderEvent={renderEvent} />
          )}
          {activeView === "week" && (
            <CalendarWeekView<AppEvent> renderEvent={renderEvent} />
          )}
          {activeView === "day" && (
            <CalendarDayView<AppEvent> renderEvent={renderEvent} />
          )}
          {activeView === "agenda" && <CalendarAgendaView<AppEvent> />}
        </div>
      </div>

      {/* Event popover — positioned by @floating-ui */}
      <CalendarEventPopover<AppEvent>
        renderEventPopover={(event, close) => (
          <EventPopoverContent event={event} close={close} />
        )}
      />
    </div>
  );
}

// ─── Legend ───────────────────────────────────────────────────────────────────

const LEGEND = [
  { label: "Meeting", color: "#60a5fa" },
  { label: "Focus", color: "#c2f13c" },
  { label: "Deadline", color: "#f97316" },
  { label: "Personal", color: "#fb7185" },
];

function Legend() {
  return (
    <div className="flex flex-col gap-1.5">
      <p className="text-[9px] text-muted-foreground/40 uppercase tracking-widest font-medium mb-0.5">
        Calendars
      </p>
      {LEGEND.map((item) => (
        <div key={item.label} className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full flex-shrink-0"
            style={{ backgroundColor: item.color }}
          />
          <span className="text-[11px] text-muted-foreground/70">
            {item.label}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── Export ───────────────────────────────────────────────────────────────────

export function CalendarDemo() {
  return (
    <div className="w-full rounded-xl border border-border bg-[#0c0c0c] p-4">
      <CalendarRoot<AppEvent>
        events={EVENTS}
        config={{
          defaultView: "week",
          weekStartsOn: 1,
          startHour: 7,
          endHour: 22,
          slotInterval: 30,
          workingHours: { start: 9, end: 18 },
          hourHeight: 60,
        }}
        onRangeSelect={(start, end) => {
          console.log("Create event:", start, "→", end);
        }}
        onEventClick={(event) => {
          console.log("Event clicked:", event.title);
        }}
        onEventMove={(event, newStart, newEnd) => {
          console.log("Move:", event.title, "→", newStart);
        }}
        onEventResize={(event, newEnd) => {
          console.log("Resize:", event.title, "→", newEnd);
        }}
        onDayClick={(date) => {
          console.log("Day clicked:", date);
        }}
      >
        <CalendarShell />
      </CalendarRoot>
    </div>
  );
}

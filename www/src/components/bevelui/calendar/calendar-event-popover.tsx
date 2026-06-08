"use client";
import * as React from "react";
import { useFloating, autoUpdate, flip, shift, offset, FloatingPortal, useDismiss, useInteractions } from "@floating-ui/react";
import { useCalendar } from "./calendar-context";
import { resolveEventColor, formatTime, fmt, isSameDay } from "./calendar-engine";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { CalendarEventBase } from "./types";

export interface CalendarEventPopoverProps<T extends CalendarEventBase> {
  renderEventPopover?: (event: T, close: () => void) => React.ReactNode;
  className?: string;
}

export function CalendarEventPopover<T extends CalendarEventBase>({ renderEventPopover, className }: CalendarEventPopoverProps<T>) {
  const { events, selectedEventId, selectedEventAnchor, selectEvent } = useCalendar<T>();
  const isOpen = !!selectedEventId;
  const event = events.find(e => e.id === selectedEventId) ?? null;
  const close = React.useCallback(() => selectEvent(null), [selectEvent]);

  const { refs, floatingStyles, context } = useFloating({
    open: isOpen,
    onOpenChange: open => { if (!open) close(); },
    whileElementsMounted: autoUpdate,
    middleware: [offset(8), flip({ padding: 12 }), shift({ padding: 12 })],
  });

  React.useLayoutEffect(() => { refs.setReference(selectedEventAnchor); }, [selectedEventAnchor, refs]);

  const dismiss = useDismiss(context, { escapeKey: true, outsidePress: true });
  const { getFloatingProps } = useInteractions([dismiss]);

  if (!isOpen || !event) return null;

  return (
    <FloatingPortal>
      <div ref={refs.setFloating} style={floatingStyles} {...getFloatingProps()}
        className={cn("z-50 w-72 rounded-xl border border-border bg-card shadow-xl focus:outline-none", className)}>
        {renderEventPopover ? renderEventPopover(event, close) : <DefaultPopoverContent event={event} close={close} />}
      </div>
    </FloatingPortal>
  );
}
CalendarEventPopover.displayName = "CalendarEventPopover";

function DefaultPopoverContent<T extends CalendarEventBase>({ event, close }: { event: T; close: () => void }) {
  const color = resolveEventColor(event);
  const isMultiDay = !isSameDay(event.start, event.end) || event.allDay;
  return (
    <div className="p-4 flex flex-col gap-3">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className="w-2.5 h-2.5 rounded-full flex-shrink-0 mt-0.5" style={{ backgroundColor: color }} />
          <h3 className="text-sm font-semibold text-foreground leading-snug">{event.title}</h3>
        </div>
        <button type="button" onClick={close} className="text-muted-foreground/40 hover:text-foreground transition-colors flex-shrink-0 mt-0.5" aria-label="Close"><IconX size={13} /></button>
      </div>
      <div className="text-xs text-muted-foreground/70 font-mono">
        {event.allDay ? <span>All day · {fmt(event.start,"EEE, MMM d")}</span>
          : isMultiDay ? <span>{fmt(event.start,"MMM d")} {formatTime(event.start)} → {fmt(event.end,"MMM d")} {formatTime(event.end)}</span>
          : <span>{fmt(event.start,"EEE, MMM d")} · {formatTime(event.start)} – {formatTime(event.end)}</span>}
      </div>
    </div>
  );
}

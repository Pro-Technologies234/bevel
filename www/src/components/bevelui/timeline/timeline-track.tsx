"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import { cn } from "@/lib/utils";

export interface TimelineTrackProps {
  label: string;
  children?: React.ReactNode;
  className?: string;
  /** Override per-track height */
  height?: number;
  /** Rendered in the header area — e.g. a mute/solo button */
  actions?: React.ReactNode;
}

export function TimelineTrack({
  label,
  children,
  className,
  height,
  actions,
}: TimelineTrackProps) {
  const { config, duration, zoom } = useTimeline();
  const h = height ?? config.trackHeight;

  return (
    <div
      className="flex border-b border-border/40 last:border-0"
      style={{ height: h }}
    >
      {/* Track header — sticky left */}
      <div
        className="sticky left-0 z-10 flex items-center justify-between gap-2 px-3 bg-card/95 backdrop-blur-sm border-r border-border/40 shrink-0"
        style={{ width: config.headerWidth }}
      >
        <span className="text-[11px] text-muted-foreground/70 truncate select-none">
          {label}
        </span>
        {actions && <div className="shrink-0">{actions}</div>}
      </div>

      {/* Track content — consumer renders here */}
      <div
        className={cn("relative flex-1 overflow-hidden", className)}
        style={{ width: duration * zoom }}
      >
        {children}
      </div>
    </div>
  );
}

TimelineTrack.displayName = "TimelineTrack";

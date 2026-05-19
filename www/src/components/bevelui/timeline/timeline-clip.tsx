"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import { cn } from "@/lib/utils";

export interface TimelineClipProps {
  start: number;
  end: number;
  children?: React.ReactNode;
  className?: string;
}

/**
 * Positions children absolutely within a TimelineTrack
 * at the given time range. Consumer owns the visual appearance.
 */
export function TimelineClip({
  start,
  end,
  children,
  className,
}: TimelineClipProps) {
  const { zoom, config } = useTimeline();
  const left = start * zoom;
  const width = Math.max(2, (end - start) * zoom);

  return (
    <div
      className={cn(
        "absolute top-1 bottom-1 rounded overflow-hidden",
        className,
      )}
      style={{ left, width }}
    >
      {children}
    </div>
  );
}

TimelineClip.displayName = "TimelineClip";

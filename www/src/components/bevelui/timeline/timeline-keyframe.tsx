"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";

export interface TimelineKeyframeProps {
  /** Position in seconds */
  time: number;
  children?: React.ReactNode;
}

/**
 * Positions a child element at a specific time in a TimelineTrack.
 * Center-aligned on the time position. Children define the visual marker.
 */
export function TimelineKeyframe({ time, children }: TimelineKeyframeProps) {
  const { zoom } = useTimeline();

  return (
    <div
      className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2 z-10"
      style={{ left: time * zoom }}
    >
      {children}
    </div>
  );
}

TimelineKeyframe.displayName = "TimelineKeyframe";

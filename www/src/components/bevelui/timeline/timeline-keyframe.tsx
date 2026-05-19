"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import { cn } from "@/lib/utils";

export interface TimelineKeyframeProps {
  time: number;
  children?: React.ReactNode;
  className?: string;
  label?: string;
}

/**
 * Positions a single point marker at the given time inside a TimelineTrack.
 * Renders a diamond by default; pass children to customise.
 */
export function TimelineKeyframe({
  time,
  children,
  className,
  label,
}: TimelineKeyframeProps) {
  const { zoom } = useTimeline();
  const left = time * zoom;

  return (
    <div
      className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 z-10"
      style={{ left }}
      title={label ?? `t=${time}s`}
    >
      {children ?? (
        <div
          className={cn(
            "w-2.5 h-2.5 bg-primary rotate-45 rounded-sm",
            className,
          )}
        />
      )}
    </div>
  );
}

TimelineKeyframe.displayName = "TimelineKeyframe";

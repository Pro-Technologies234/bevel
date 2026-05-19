"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import { formatTime } from "./timeline-utils";
import { Button } from "@/components/ui/button";
import {
  IconZoomIn,
  IconZoomOut,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export interface TimelineControlsProps {
  /** Optional external play state */
  isPlaying?: boolean;
  onPlayPause?: () => void;
  className?: string;
}

export function TimelineControls({
  isPlaying,
  onPlayPause,
  className,
}: TimelineControlsProps) {
  const { currentTime, duration, zoom, setZoom, config } = useTimeline();

  return (
    <div
      className={cn(
        "flex items-center gap-2 px-3 py-2 border-b border-border bg-card/80",
        className,
      )}
    >
      {/* Play/pause */}
      {onPlayPause && (
        <Button
          variant="ghost"
          size="icon"
          onClick={onPlayPause}
          className="h-7 w-7"
        >
          {isPlaying ? (
            <IconPlayerPause size={14} strokeWidth={1.8} />
          ) : (
            <IconPlayerPlay size={14} strokeWidth={1.8} />
          )}
        </Button>
      )}

      {/* Time display */}
      <span className="text-[11px] font-mono text-muted-foreground/60 tabular-nums min-w-[80px]">
        {formatTime(currentTime, duration)} / {formatTime(duration)}
      </span>

      <div className="flex-1" />

      {/* Zoom controls */}
      <div className="flex items-center gap-1">
        <Button
          variant="ghost"
          size="icon"
          onClick={() => setZoom(zoom * 0.7)}
          className="h-7 w-7"
          title="Zoom out"
        >
          <IconZoomOut size={14} strokeWidth={1.8} />
        </Button>

        <span className="text-[10px] font-mono text-muted-foreground/40 w-12 text-center">
          {zoom < 1 ? `${zoom.toFixed(1)}` : Math.round(zoom)}px/s
        </span>

        <Button
          variant="ghost"
          size="icon"
          onClick={() => setZoom(zoom * 1.4)}
          className="h-7 w-7"
          title="Zoom in"
        >
          <IconZoomIn size={14} strokeWidth={1.8} />
        </Button>
      </div>
    </div>
  );
}

TimelineControls.displayName = "TimelineControls";

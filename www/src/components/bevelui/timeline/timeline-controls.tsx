"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import {
  IconPlayerPlay,
  IconPlayerPause,
  IconPlayerSkipBack,
  IconZoomIn,
  IconZoomOut,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

export function TimelineControls() {
  const { isPlaying, setPlaying, engine, config, setZoom } = useTimeline();
  const pps = config.defaultZoom ?? 80;

  function togglePlay() {
    setPlaying(!isPlaying);
  }

  function skipToStart() {
    engine.seek(0);
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-card/80">
        <button
          type="button"
          onClick={skipToStart}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Skip to start"
        >
          <IconPlayerSkipBack size={13} strokeWidth={1.8} />
        </button>
        <button
          type="button"
          onClick={togglePlay}
          className={cn(
            "w-7 h-7 flex items-center justify-center rounded-md transition-colors",
            isPlaying
              ? "bg-primary text-black"
              : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
          )}
          aria-label={isPlaying ? "Pause" : "Play"}
        >
          {isPlaying ? (
            <IconPlayerPause size={13} strokeWidth={1.8} />
          ) : (
            <IconPlayerPlay size={13} strokeWidth={1.8} />
          )}
        </button>
      </div>

      {/* Zoom */}
      <div className="flex items-center gap-1 p-1 rounded-lg border border-border bg-card/80">
        <button
          type="button"
          onClick={() => setZoom(pps / 1.5)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Zoom out"
        >
          <IconZoomOut size={13} strokeWidth={1.8} />
        </button>
        <span className="text-[10px] font-mono text-muted-foreground/60 px-1 min-w-[40px] text-center">
          {pps}px/s
        </span>
        <button
          type="button"
          onClick={() => setZoom(pps * 1.5)}
          className="w-7 h-7 flex items-center justify-center rounded-md text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          aria-label="Zoom in"
        >
          <IconZoomIn size={13} strokeWidth={1.8} />
        </button>
      </div>
    </div>
  );
}

TimelineControls.displayName = "TimelineControls";

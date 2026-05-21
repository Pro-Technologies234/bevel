"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";

export function TimelineRuler() {
  const { config, engine, zoom, duration } = useTimeline();
  const pps = zoom ?? 80;
  const rulerHeight = config.rulerHeight ?? 32;
  const headerWidth = config.headerWidth ?? 100;
  // Use a local ref for the ruler container, entirely separate from the engine's playhead register
  const rulerRef = React.useRef<HTMLDivElement>(null);

  // Determine tick interval based on zoom
  const tickInterval =
    pps >= 200 ? 0.25 : pps >= 100 ? 0.5 : pps >= 50 ? 1 : pps >= 20 ? 2 : 5;

  const ticks: number[] = [];
  for (
    let t = 0;
    t <= duration;
    t = Math.round((t + tickInterval) * 100) / 100
  ) {
    ticks.push(t);
  }

  function formatTime(t: number): string {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    const ms = Math.round((t % 1) * 100);
    if (ms > 0)
      return `${m}:${s.toString().padStart(2, "0")}.${ms.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  }

  // Handle seeking when clicking or dragging on the ruler
  function handleRulerScrub(e: React.PointerEvent<HTMLDivElement>) {
    // Only handle primary click/drag (left mouse button)
    if (e.buttons !== 1) return;

    const container = rulerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    // Calculate X relative directly to the ruler container itself
    const x = Math.max(0, e.clientX - rect.left);
    const t = x / pps;

    engine.seek(Math.min(t, duration));
  }

  function onPointerDown(e: React.PointerEvent<HTMLDivElement>) {
    e.currentTarget.setPointerCapture(e.pointerId);
    handleRulerScrub(e);
  }

  return (
    <div
      ref={rulerRef}
      className="sticky top-0 z-10 border-b border-border bg-card select-none cursor-text"
      style={{ height: rulerHeight, left: headerWidth }}
      onPointerDown={onPointerDown}
      onPointerMove={handleRulerScrub}
    >
      <div className="relative h-full" style={{ width: `var(--tl-width)` }}>
        {ticks.map((t) => {
          const isMajor = t % (tickInterval * 4) < tickInterval / 2;
          return (
            <div
              key={t}
              className="absolute top-0 flex flex-col items-start pointer-events-none"
              style={{ left: t * pps }}
            >
              <div
                className={
                  isMajor ? "h-4 w-px bg-border/80" : "h-1.5 w-px bg-border/80"
                }
                style={{ marginTop: isMajor ? 0 : "auto" }}
              />
              {isMajor && (
                <span className="absolute top-1 left-2 text-[9px] font-mono text-muted-foreground/60 whitespace-nowrap">
                  {formatTime(t)}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

TimelineRuler.displayName = "TimelineRuler";

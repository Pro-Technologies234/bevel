"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";

export function TimelinePlayhead() {
  const { engine, config, scrubTo } = useTimeline();
  const ref = React.useRef<HTMLDivElement>(null);
  const rulerHeight = config.rulerHeight ?? 32;
  const headerWidth = config.headerWidth ?? 100;

  // Register DOM element with engine — engine writes transform directly
  React.useLayoutEffect(() => {
    engine.setPlayheadEl(ref.current);
    return () => engine.setPlayheadEl(null);
  }, [engine]);

  function onPointerDown(e: React.PointerEvent) {
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
  }

  function onPointerMove(e: React.PointerEvent) {
    if (e.buttons !== 1) return;
    const container = ref.current?.parentElement;
    if (!container) return;
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, e.clientX - (rect.left + headerWidth));
    const t = x / (config.defaultZoom ?? 80);
    engine.seek(t); // direct DOM write — no React re-render
  }

  return (
    <div
      ref={ref}
      className="absolute top-0 bottom-0 z-20 pointer-events-none will-change-transform"
      style={{ width: 1, left: headerWidth }}
    >
      {/* Scrubber head */}
      <div
        className="absolute -translate-x-1/2 cursor-ew-resize pointer-events-auto"
        style={{ top: 0, width: 12, height: rulerHeight }}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
      >
        <div
          className="w-full h-full bg-slate-200"
          style={{
            // Flat top, straight sides down to 70% height, then pointing to the bottom center
            clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
          }}
        />
      </div>
      {/* Playhead line */}
      <div className="absolute top-0 bottom-0 left-0 w-px bg-primary/80" />
    </div>
  );
}

TimelinePlayhead.displayName = "TimelinePlayhead";

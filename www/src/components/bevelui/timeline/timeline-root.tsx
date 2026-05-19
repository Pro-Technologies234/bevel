"use client";

import * as React from "react";
import { TimelineCtx } from "./timeline-context";
import { clampTime, zoomAnchoredScroll } from "./timeline-utils";
import type { TimelineConfig, TimelineContextValue } from "./types";
import { cn } from "@/lib/utils";

const DEFAULTS = {
  minZoom: 10,
  maxZoom: 3000,
  defaultZoom: 60,
  defaultCurrentTime: 0,
  headerWidth: 120,
  rulerHeight: 32,
  trackHeight: 48,
};

export interface TimelineRootProps {
  duration: number;
  config?: TimelineConfig;
  onTimeChange?: (time: number) => void;
  children: React.ReactNode;
  className?: string;
}

export function TimelineRoot({
  duration,
  config: rawConfig = {},
  onTimeChange,
  children,
  className,
}: TimelineRootProps) {
  const config = { ...DEFAULTS, ...rawConfig } as Required<TimelineConfig>;

  const [currentTime, setCurrentTime] = React.useState(
    config.defaultCurrentTime,
  );
  const [zoom, setZoomState] = React.useState(config.defaultZoom);
  const [scrollLeft, setScrollLeft] = React.useState(0);
  const [containerWidth, setContainerWidth] = React.useState(0);

  const scrollRef = React.useRef<HTMLDivElement>(null);
  const programmatic = React.useRef(false);

  // Track container width
  React.useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const ro = new ResizeObserver(() => {
      setContainerWidth(el.clientWidth - config.headerWidth);
    });
    ro.observe(el);
    setContainerWidth(el.clientWidth - config.headerWidth);
    return () => ro.disconnect();
  }, [config.headerWidth]);

  function scrubTo(time: number) {
    const t = clampTime(time, duration);
    setCurrentTime(t);
    onTimeChange?.(t);
  }

  function setZoom(newZoom: number, anchorPx?: number) {
    const clamped = Math.max(config.minZoom, Math.min(config.maxZoom, newZoom));
    let newScroll = scrollLeft;
    if (anchorPx !== undefined) {
      newScroll = zoomAnchoredScroll(zoom, clamped, anchorPx, scrollLeft);
    }
    setZoomState(clamped);
    setScrollLeft(newScroll);
    if (scrollRef.current) {
      programmatic.current = true;
      scrollRef.current.scrollLeft = newScroll;
    }
  }

  function handleScroll(e: React.UIEvent<HTMLDivElement>) {
    if (programmatic.current) {
      programmatic.current = false;
      return;
    }
    setScrollLeft(e.currentTarget.scrollLeft);
  }

  function handleWheel(e: React.WheelEvent<HTMLDivElement>) {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const factor = e.deltaY > 0 ? 0.85 : 1.18;
      const rect = scrollRef.current!.getBoundingClientRect();
      const anchorPx = e.clientX - rect.left - config.headerWidth;
      setZoom(zoom * factor, Math.max(0, anchorPx));
    }
  }

  function handleRulerClick(e: React.MouseEvent<HTMLDivElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = e.clientX - rect.left + scrollLeft;
    scrubTo(px / zoom);
  }

  const timeToPixel = React.useCallback((t: number) => t * zoom, [zoom]);
  const pixelToTime = React.useCallback((px: number) => px / zoom, [zoom]);

  const visibleRange = React.useMemo(
    () => ({
      start: scrollLeft / zoom,
      end: (scrollLeft + containerWidth) / zoom,
    }),
    [scrollLeft, zoom, containerWidth],
  );

  const ctx: TimelineContextValue = {
    currentTime,
    duration,
    zoom,
    scrollLeft,
    containerWidth,
    config,
    scrubTo,
    setZoom,
    timeToPixel,
    pixelToTime,
    visibleRange,
  };

  const totalWidth = config.headerWidth + duration * zoom;

  return (
    <TimelineCtx.Provider value={ctx}>
      <div
        className={cn(
          "flex flex-col overflow-hidden rounded-xl border border-border bg-card",
          className,
        )}
      >
        <div
          ref={scrollRef}
          className="overflow-x-auto overflow-y-auto flex-1 relative"
          onScroll={handleScroll}
          onWheel={handleWheel}
          style={{ cursor: "default" }}
        >
          <div
            className="relative"
            style={{ width: totalWidth, minWidth: "100%" }}
            data-timeline-inner
          >
            {/* Ruler row — sticky top */}
            <div
              className="sticky top-0 z-20 flex border-b border-border bg-card/95 backdrop-blur-sm"
              style={{ height: config.rulerHeight }}
              onClick={handleRulerClick}
            >
              {/* Corner spacer */}
              <div
                className="sticky left-0 z-30 bg-card/95 backdrop-blur-sm border-r border-border shrink-0 flex items-center justify-center"
                style={{ width: config.headerWidth }}
              >
                <span className="text-[9px] font-mono text-muted-foreground/30 uppercase tracking-widest select-none">
                  tracks
                </span>
              </div>
              {/* Ticks area */}
              <div className="relative flex-1 overflow-hidden cursor-pointer select-none">
                <RulerTicks />
              </div>
            </div>

            {/* Playhead — absolute, spans tracks */}
            <Playhead rulerHeight={config.rulerHeight} />

            {/* Track rows */}
            {children}
          </div>
        </div>
      </div>
    </TimelineCtx.Provider>
  );
}

// ─── Internal ruler ticks ─────────────────────────────────────────────────────
function RulerTicks() {
  const { zoom, scrollLeft, containerWidth, visibleRange, config } =
    useTimeline_();
  const ticks = React.useMemo(
    () =>
      calculateTicks_(
        zoom,
        scrollLeft,
        containerWidth + 200,
        config.duration ?? 0,
      ),
    [zoom, scrollLeft, containerWidth, config],
  );

  return (
    <>
      {ticks.map((tick) => {
        const x = tick.x - scrollLeft;
        if (x < -80 || x > containerWidth + 80) return null;
        return (
          <React.Fragment key={tick.time}>
            <div
              className={cn(
                "absolute bottom-0 bg-border",
                tick.isMajor ? "w-px h-2.5" : "w-px h-1.5 opacity-50",
              )}
              style={{ left: x }}
            />
            {tick.label && (
              <span
                className="absolute top-1 text-[9px] font-mono text-muted-foreground/50 select-none"
                style={{ left: x + 3 }}
              >
                {tick.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </>
  );
}

// ─── Internal playhead ────────────────────────────────────────────────────────
function Playhead({ rulerHeight }: { rulerHeight: number }) {
  const { currentTime, zoom, scrollLeft, config, scrubTo, pixelToTime } =
    useTimeline_();
  const left = config.headerWidth + currentTime * zoom - scrollLeft;

  function handleDrag(e: React.PointerEvent) {
    const container = (e.currentTarget as HTMLElement).closest(
      "[data-timeline-inner]",
    ) as HTMLElement;
    if (!container) return;
    e.currentTarget.setPointerCapture(e.pointerId);

    function move(ev: PointerEvent) {
      const rect = container.getBoundingClientRect();
      const px = ev.clientX - rect.left - config.headerWidth + scrollLeft;
      scrubTo(pixelToTime(px));
    }
    window.addEventListener("pointermove", move);
    window.addEventListener(
      "pointerup",
      () => window.removeEventListener("pointermove", move),
      { once: true },
    );
  }

  return (
    <div
      className="absolute top-0 bottom-0 z-30 pointer-events-none"
      style={{ left, top: rulerHeight - 1 }}
    >
      {/* Handle */}
      <div
        className="w-3.5 h-5 bg-primary -translate-x-1/2 cursor-ew-resize pointer-events-auto rounded-t-xs"
        style={{
          clipPath: "polygon(0% 0%, 100% 0%, 100% 70%, 50% 100%, 0% 70%)",
          marginTop: -rulerHeight + 1,
        }}
        onPointerDown={handleDrag}
      />

      {/* Line */}
      <div
        className="w-px h-full bg-primary/70 -translate-x-[0.5px] cursor-ew-resize pointer-events-auto"
        onPointerDown={handleDrag}
      />
    </div>
  );
}

// Helpers to avoid circular imports
import { useTimeline as useTimeline_ } from "./timeline-context";
import { calculateTicks as calculateTicks_ } from "./timeline-utils";

TimelineRoot.displayName = "TimelineRoot";

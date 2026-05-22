"use client";

import * as React from "react";
import { useTimeline } from "./timeline-context";
import { cn } from "@/lib/utils";

export interface TimelineClipProps {
  start: number; // seconds
  end: number; // seconds
  children?: React.ReactNode;
  className?: string;
  /** Prevent resize/move */
  locked?: boolean;
  onMove?: (start: number, end: number) => void;
}

export function TimelineClip({
  start,
  end,
  children,
  className,
  locked,
  onMove,
}: TimelineClipProps) {
  const { zoom, duration, config } = useTimeline();
  const ref = React.useRef<HTMLDivElement>(null);

  const left = start * zoom;
  const width = (end - start) * zoom;

  const dragState = React.useRef<{
    mode: "move" | "resize-start" | "resize-end";
    startX: number;
    origStart: number;
    origEnd: number;
  } | null>(null);

  function snap(t: number): number {
    if (!config.snapToGrid) return t;
    const iv = config.snapInterval;
    return Math.round(t / iv) * iv;
  }

  function onPointerDown(
    e: React.PointerEvent,
    mode: "move" | "resize-start" | "resize-end",
  ) {
    if (locked) return;
    e.stopPropagation();
    e.currentTarget.setPointerCapture(e.pointerId);
    dragState.current = {
      mode,
      startX: e.clientX,
      origStart: start,
      origEnd: end,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current || e.buttons !== 1 || !ref.current) return;
    const { mode, startX, origStart, origEnd } = dragState.current;
    const delta = (e.clientX - startX) / zoom;
    const dur = origEnd - origStart;

    if (mode === "move") {
      const ns = Math.max(0, Math.min(snap(origStart + delta), duration - dur));
      // Direct style write during drag — no React re-render
      ref.current.style.left = `${ns * zoom}px`;
      (ref.current as any)._ps = ns;
      (ref.current as any)._pe = ns + dur;
    } else if (mode === "resize-end") {
      const ne = Math.max(
        origStart + 0.1,
        Math.min(snap(origEnd + delta), duration),
      );
      ref.current.style.width = `${(ne - origStart) * zoom}px`;
      (ref.current as any)._pe = ne;
    } else {
      const ns = Math.max(0, Math.min(snap(origStart + delta), origEnd - 0.1));
      ref.current.style.left = `${ns * zoom}px`;
      ref.current.style.width = `${(origEnd - ns) * zoom}px`;
      (ref.current as any)._ps = ns;
    }
  }

  function onPointerUp() {
    if (!dragState.current || !ref.current) return;
    const el = ref.current as any;
    const ns: number = el._ps ?? start;
    const ne: number = el._pe ?? end;
    delete el._ps;
    delete el._pe;
    // Single commit to parent on pointer up
    onMove?.(ns, ne);
    dragState.current = null;
  }

  return (
    <div
      ref={ref}
      className={cn(
        "absolute top-1 bottom-1 rounded-md overflow-hidden select-none",
        !locked && "cursor-grab active:cursor-grabbing",
        locked && "cursor-default",
        className,
      )}
      style={{ left, width }}
      onPointerDown={(e) => onPointerDown(e, "move")}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {children}

      {/* Resize handles */}
      {!locked && (
        <>
          <div
            className="absolute left-0 top-0 bottom-0 w-2 cursor-ew-resize z-10 hover:bg-white/10"
            onPointerDown={(e) => {
              e.stopPropagation();
              onPointerDown(e, "resize-start");
            }}
          />
          <div
            className="absolute right-0 top-0 bottom-0 w-2 cursor-ew-resize z-10 hover:bg-white/10"
            onPointerDown={(e) => {
              e.stopPropagation();
              onPointerDown(e, "resize-end");
            }}
          />
        </>
      )}
    </div>
  );
}

TimelineClip.displayName = "TimelineClip";

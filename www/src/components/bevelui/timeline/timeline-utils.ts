import type { TimelineTick } from "./types";

// ─── Nice intervals (seconds) ─────────────────────────────────────────────────
const INTERVALS = [
  0.01, 0.025, 0.05, 0.1, 0.25, 0.5, 1, 2, 5, 10, 15, 30, 60, 120, 300, 600,
  1800, 3600,
];

export function getTickInterval(zoom: number, minPx = 64): number {
  const minSec = minPx / zoom;
  return INTERVALS.find((i) => i >= minSec) ?? 3600;
}

// ─── Tick generation ──────────────────────────────────────────────────────────
export function calculateTicks(
  zoom: number,
  scrollLeft: number,
  viewportWidth: number,
  duration: number,
): TimelineTick[] {
  const interval = getTickInterval(zoom);
  const subInterval = interval / 5;

  const startTime = scrollLeft / zoom;
  const endTime = Math.min(
    duration,
    startTime + viewportWidth / zoom + interval * 2,
  );

  const ticks: TimelineTick[] = [];
  const firstMajor = Math.floor(startTime / interval) * interval;

  const majorCount = Math.ceil((endTime - firstMajor) / interval) + 2;

  for (let mi = 0; mi < majorCount; mi++) {
    const majorTime = firstMajor + mi * interval;

    if (majorTime >= 0 && majorTime <= duration) {
      ticks.push({
        time: majorTime,
        x: majorTime * zoom,
        label: formatTime(majorTime, duration),
        isMajor: true,
      });
    }

    for (let si = 1; si < 5; si++) {
      const minorTime = majorTime + si * subInterval;
      if (minorTime > 0 && minorTime < duration) {
        ticks.push({
          time: minorTime,
          x: minorTime * zoom,
          label: "",
          isMajor: false,
        });
      }
    }
  }

  return ticks.sort((a, b) => a.time - b.time);
}

// ─── Time formatting ──────────────────────────────────────────────────────────
export function formatTime(seconds: number, duration?: number): string {
  if ((duration ?? seconds) >= 3600) {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    return `${h}:${pad(m)}:${pad(s)}`;
  }
  if ((duration ?? seconds) >= 60) {
    const m = Math.floor(seconds / 60);
    const s = Math.floor(seconds % 60);
    return `${m}:${pad(s)}`;
  }
  if (seconds >= 10) return `${seconds.toFixed(1)}s`;
  if (seconds >= 1) return `${seconds.toFixed(2)}s`;
  return `${Math.round(seconds * 1000)}ms`;
}

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

// ─── Zoom anchoring ───────────────────────────────────────────────────────────
export function zoomAnchoredScroll(
  oldZoom: number,
  newZoom: number,
  anchorPx: number, // cursor x relative to content area (no header offset)
  currentScroll: number,
): number {
  const timeAtAnchor = (currentScroll + anchorPx) / oldZoom;
  return Math.max(0, timeAtAnchor * newZoom - anchorPx);
}

// ─── Clamp ────────────────────────────────────────────────────────────────────
export function clampTime(t: number, duration: number): number {
  return Math.max(0, Math.min(duration, t));
}

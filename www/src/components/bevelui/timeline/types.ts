import type { TimelineEngine } from "./timeline-engine";

export interface TimelineConfig {
  defaultZoom?: number; // px per second, default 80
  minZoom?: number; // default 20
  maxZoom?: number; // default 400
  trackHeight?: number; // px, default 48
  headerWidth?: number; // px, track label column, default 100
  rulerHeight?: number; // px, default 32
  snapToGrid?: boolean;
  snapInterval?: number; // seconds, default 0.5
}

// Resolved config (all required, defaults filled)
export interface ResolvedTimelineConfig {
  defaultZoom: number;
  minZoom: number;
  maxZoom: number;
  trackHeight: number;
  headerWidth: number;
  rulerHeight: number;
  snapToGrid: boolean;
  snapInterval: number;
}

export interface TimelineContextValue {
  currentTime: number;
  duration: number;
  zoom: number;
  isPlaying: boolean;
  config: ResolvedTimelineConfig;
  engine: TimelineEngine;
  scrubTo: (t: number) => void;
  setPlaying: (playing: boolean) => void;
  setZoom: (pps: number) => void;
}

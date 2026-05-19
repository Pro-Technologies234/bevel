export interface TimelineConfig {
  duration?: number;
  minZoom?: number; // px/sec — default 10
  maxZoom?: number; // px/sec — default 3000
  defaultZoom?: number; // px/sec — default 60
  defaultCurrentTime?: number;
  headerWidth?: number; // px — default 120
  rulerHeight?: number; // px — default 32
  trackHeight?: number; // px — default 48
}

export interface TimelineTick {
  time: number;
  x: number; // px from left of full content (not viewport)
  label: string;
  isMajor: boolean;
}

export interface TimelineRange {
  start: number;
  end: number;
}

export interface TimelineContextValue {
  currentTime: number;
  duration: number;
  zoom: number; // px per second
  scrollLeft: number;
  containerWidth: number; // visible width of scroll area (excl. header)
  config: Required<TimelineConfig>;
  scrubTo: (time: number) => void;
  setZoom: (zoom: number, anchorPx?: number) => void;
  timeToPixel: (time: number) => number;
  pixelToTime: (px: number) => number;
  visibleRange: TimelineRange;
}

export type VisualizerMode = "bars" | "wave" | "circular";

export type VisualizerSource = HTMLMediaElement | MediaStream | AudioBuffer;

export interface VisualizerConfig {
  mode?: VisualizerMode; // default "bars"
  /** Power-of-two, 32–32768. Higher = more frequency resolution, more CPU. Default 256. */
  fftSize?: number;
  /** 0–1, higher = smoother/slower-responding data. Default 0.8. */
  smoothingTimeConstant?: number;
  /** Number of bars to render in "bars" mode. Derived from fftSize if omitted. */
  barCount?: number;
  gapRatio?: number; // gap between bars as a fraction of bar width, "bars" mode. Default 0.3.
  color?: string; // solid color, or omit and use colorStops for a gradient
  colorStops?: { offset: number; color: string }[];
  backgroundColor?: string; // default "transparent"
  lineWidth?: number; // "wave"/"circular" stroke width. Default 2.
  /** Radius as a fraction of the canvas's shorter dimension, "circular" mode. Default 0.35. */
  circularRadiusRatio?: number;
}

export interface VisualizerEngine {
  connect: (source: VisualizerSource) => void;
  disconnect: () => void;
  start: () => void;
  stop: () => void;
  setMode: (mode: VisualizerMode) => void;
  setConfig: (patch: Partial<VisualizerConfig>) => void;
  isRunning: () => boolean;
  getMode: () => VisualizerMode;

  /** Attach the canvas element the engine renders into. */
  attachCanvas: (el: HTMLCanvasElement | null) => void;

  /** Resumes a suspended AudioContext — call from a user-gesture handler (autoplay policy). */
  resume: () => Promise<void>;

  subscribe: (listener: () => void) => () => void; // fires on isRunning/mode changes only, NOT per-frame
  destroy: () => void;
}

export interface VisualizerContextValue {
  engine: VisualizerEngine;
  config: Required<VisualizerConfig>;
  isRunning: boolean;
  mode: VisualizerMode;
}

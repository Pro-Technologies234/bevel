"use client";

import * as React from "react";
import { VisualizerCtx } from "./visualizer-context";
import { createVisualizerEngine } from "./visualizer-engine";
import { VisualizerCanvas } from "./visualizer-canvas";
import type { VisualizerConfig } from "./types";

export interface AudioVisualizerRootProps {
  config?: VisualizerConfig;
  className?: string;
  /** Replace the default canvas layout entirely. */
  children?: React.ReactNode;
}

const DEFAULT_CONFIG: Required<VisualizerConfig> = {
  mode: "bars",
  fftSize: 256,
  smoothingTimeConstant: 0.8,
  barCount: 48,
  gapRatio: 0.3,
  color: "#c2f13c",
  colorStops: [],
  backgroundColor: "transparent",
  lineWidth: 2,
  circularRadiusRatio: 0.35,
};

export function AudioVisualizerRoot({ config, className, children }: AudioVisualizerRootProps) {
  const [engine] = React.useState(() => createVisualizerEngine(config));

  // Fires only on start()/stop()/setMode()/setConfig() — NOT per animation frame.
  // The render loop itself writes straight to canvas via requestAnimationFrame.
  const [, forceUpdate] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => engine.subscribe(forceUpdate), [engine]);
  React.useEffect(() => () => engine.destroy(), [engine]);

  const resolvedConfig: Required<VisualizerConfig> = { ...DEFAULT_CONFIG, ...config, mode: engine.getMode() };

  const ctx = {
    engine,
    config: resolvedConfig,
    isRunning: engine.isRunning(),
    mode: engine.getMode(),
  };

  return (
    <VisualizerCtx.Provider value={ctx}>
      {children ?? <VisualizerCanvas className={className} />}
    </VisualizerCtx.Provider>
  );
}

AudioVisualizerRoot.displayName = "AudioVisualizerRoot";

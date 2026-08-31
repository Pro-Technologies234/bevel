"use client";

import * as React from "react";
import { CanvasCtx } from "./canvas-context";
import { createCanvasEngine } from "./canvas-engine";
import { CanvasViewport } from "./canvas-viewport";
import type { CanvasConfig, CanvasNode } from "./types";

export interface CanvasRootProps {
  defaultNodes?: CanvasNode[];
  onChange?: (nodes: CanvasNode[]) => void;
  config?: CanvasConfig;
  /** Renders a single node's content. The engine handles position/selection/drag — you only render what's inside. */
  renderNode?: (node: CanvasNode, isSelected: boolean) => React.ReactNode;
  className?: string;
  /** Replace the default viewport layout entirely. */
  children?: React.ReactNode;
}

export function CanvasRoot({
  defaultNodes = [],
  onChange,
  config = {},
  renderNode,
  className,
  children,
}: CanvasRootProps) {
  const [engine] = React.useState(() =>
    createCanvasEngine(defaultNodes, { x: 0, y: 0, zoom: 1 }, config, onChange),
  );

  // Forces a re-render whenever the engine calls notify() — pan/node-drag skip this
  // on every pointermove by design (see canvas-engine.ts), so this fires far less
  // often than the underlying pointer events.
  const [, forceUpdate] = React.useReducer((n: number) => n + 1, 0);
  React.useEffect(() => engine.subscribe(forceUpdate), [engine]);
  React.useEffect(() => () => engine.destroy(), [engine]);

  const resolvedConfig: Required<CanvasConfig> = {
    minZoom: config.minZoom ?? 0.1,
    maxZoom: config.maxZoom ?? 4,
    gridSnap: config.gridSnap ?? 0,
    panTrigger: config.panTrigger ?? "drag",
  };

  const ctx = {
    engine,
    config: resolvedConfig,
    nodes: engine.getNodes(),
    viewport: engine.getViewport(),
    selection: engine.getSelection(),
    dragState: engine.getDragState(),
  };

  return (
    <CanvasCtx.Provider value={ctx}>
      {children ?? <CanvasViewport className={className} renderNode={renderNode} />}
    </CanvasCtx.Provider>
  );
}

CanvasRoot.displayName = "CanvasRoot";

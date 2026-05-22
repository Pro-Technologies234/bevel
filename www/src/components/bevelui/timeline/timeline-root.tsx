"use client";

import * as React from "react";
import { TimelineCtx } from "./timeline-context";
import { TimelineEngine } from "./timeline-engine";
import { TimelineRuler } from "./timeline-ruler";
import { TimelinePlayhead } from "./timeline-playhead";
import type {
  TimelineConfig,
  ResolvedTimelineConfig,
  TimelineContextValue,
} from "./types";
import { cn } from "@/lib/utils";

export interface TimelineRootProps {
  duration: number;
  config?: TimelineConfig;
  /** Called when the user manually scrubs the playhead */
  onTimeChange?: (t: number) => void;
  children: React.ReactNode;
  className?: string;
}

function resolveConfig(c: TimelineConfig = {}): ResolvedTimelineConfig {
  return {
    defaultZoom: c.defaultZoom ?? 80,
    minZoom: c.minZoom ?? 20,
    maxZoom: c.maxZoom ?? 400,
    trackHeight: c.trackHeight ?? 48,
    headerWidth: c.headerWidth ?? 100,
    rulerHeight: c.rulerHeight ?? 32,
    snapToGrid: c.snapToGrid ?? false,
    snapInterval: c.snapInterval ?? 0.5,
  };
}

export function TimelineRoot({
  duration,
  config: configProp,
  duration: configDuration,
  onTimeChange,
  children,
  className,
}: TimelineRootProps) {
  const cfg = React.useMemo(() => resolveConfig(configProp), [configProp]);

  const [isPlaying, setIsPlaying] = React.useState(false);
  const [currentTime, setCurrentTime] = React.useState(0);
  const [zoom, setZoomState] = React.useState(cfg.defaultZoom);
  const [pxPerSec, setPxPerSec] = React.useState(zoom ?? 80);

  const pxPerSecRef = React.useRef(pxPerSec);
  pxPerSecRef.current = pxPerSec;
  // Engine is created once — stable across renders
  const engine = React.useMemo(
    () => new TimelineEngine(duration, cfg.defaultZoom),
    [], // eslint-disable-line
  );

  // Wire engine to play state
  React.useEffect(() => {
    engine.onPlayEnd(() => setIsPlaying(false));
    return () => engine.destroy();
  }, [engine]);

  React.useEffect(() => {
    if (isPlaying) engine.play();
    else engine.pause();
  }, [isPlaying, engine]);

  React.useEffect(() => {
    engine.setDuration(configDuration);
  }, [configDuration, engine]);

  React.useEffect(() => {
    engine.setDuration(duration);
  }, [duration, engine]);

  // Wire engine time updates to React state
  React.useEffect(() => {
    engine.onTimeUpdate((t) => {
      setCurrentTime(t);
    });

    return () => {
      engine.onTimeUpdate(null as any);
    };
  }, [engine]);

  const scrubTo = React.useCallback(
    (t: number) => {
      const clamped = Math.max(0, Math.min(t, duration));
      engine.seek(clamped); // direct DOM write (60fps)
      setCurrentTime(clamped); // React state (for UI components)
      onTimeChange?.(clamped);
    },
    [duration, engine, onTimeChange],
  );

  const setZoom = React.useCallback(
    (pps: number) => {
      const clamped = Math.max(cfg.minZoom, Math.min(cfg.maxZoom, pps));
      engine.setZoom(clamped);
      engine.seek(currentTime); // re-position playhead at new zoom
      setZoomState(clamped);
    },
    [cfg.minZoom, cfg.maxZoom, engine, currentTime],
  );

  const ctx: TimelineContextValue = {
    currentTime,
    duration,
    isPlaying,
    setPlaying: setIsPlaying,
    zoom,
    config: cfg,
    engine,
    scrubTo,
    setZoom,
  };

  return <TimelineCtx.Provider value={ctx}>{children}</TimelineCtx.Provider>;
}

TimelineRoot.displayName = "TimelineRoot";

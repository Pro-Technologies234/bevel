"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useVisualizerCtx } from "./visualizer-context";

export interface VisualizerCanvasProps {
  className?: string;
}

export function VisualizerCanvas({ className }: VisualizerCanvasProps) {
  const { engine } = useVisualizerCtx();
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const el = canvasRef.current;
    engine.attachCanvas(el);
    return () => engine.attachCanvas(null);
  }, [engine]);

  React.useEffect(() => {
    const el = canvasRef.current;
    if (!el) return;

    const ratio = typeof window !== "undefined" ? window.devicePixelRatio || 1 : 1;

    function resize() {
      if (!el) return;
      const { clientWidth, clientHeight } = el;
      el.width = Math.max(1, Math.round(clientWidth * ratio));
      el.height = Math.max(1, Math.round(clientHeight * ratio));
    }

    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return <canvas ref={canvasRef} className={cn("block h-full w-full", className)} />;
}

VisualizerCanvas.displayName = "VisualizerCanvas";

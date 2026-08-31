"use client";

import * as React from "react";
import { useCanvasCtx } from "./canvas-context";

export function CanvasSelectionBox() {
  const { dragState, viewport } = useCanvasCtx();

  if (dragState.type !== "select-box") return null;

  const { startX, startY, currentX, currentY } = dragState;
  const minX = Math.min(startX, currentX);
  const minY = Math.min(startY, currentY);
  const width = Math.abs(currentX - startX);
  const height = Math.abs(currentY - startY);

  // Selection box lives in viewport-local pixel space — same transform math as the
  // world layer (canvas coords * zoom + pan offset) — but the box element itself is
  // NOT inside the transformed world div, so it stays crisp at 1px regardless of zoom.
  return (
    <div
      className="pointer-events-none absolute rounded-sm border border-primary bg-primary/10"
      style={{
        left: minX * viewport.zoom + viewport.x,
        top: minY * viewport.zoom + viewport.y,
        width: width * viewport.zoom,
        height: height * viewport.zoom,
      }}
    />
  );
}

CanvasSelectionBox.displayName = "CanvasSelectionBox";

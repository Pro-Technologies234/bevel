"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useCanvasCtx } from "./canvas-context";
import type { CanvasNode } from "./types";

export interface CanvasNodeViewProps {
  node: CanvasNode;
  children: React.ReactNode;
  className?: string;
}

export function CanvasNodeView({ node, children, className }: CanvasNodeViewProps) {
  const { engine, selection } = useCanvasCtx();
  const isSelected = selection.has(node.id);

  const setRef = React.useCallback(
    (el: HTMLDivElement | null) => engine.registerNodeElement(node.id, el),
    [engine, node.id],
  );

  function onPointerDown(e: React.PointerEvent) {
    if (node.locked) return;
    e.stopPropagation(); // don't let CanvasViewport treat this as a pan/select-box start

    const ids = selection.has(node.id) ? Array.from(selection) : [node.id];
    if (!selection.has(node.id)) {
      engine.select([node.id], e.shiftKey ? "add" : "replace");
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    engine.startNodeDrag(ids, e.clientX, e.clientY);

    function onMove(ev: PointerEvent) {
      engine.updateNodeDrag(ev.clientX, ev.clientY);
    }
    function onUp() {
      engine.endNodeDrag();
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
    }
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp);
  }

  return (
    <div
      ref={setRef}
      onPointerDown={onPointerDown}
      data-selected={isSelected || undefined}
      data-locked={node.locked || undefined}
      className={cn(
        "absolute select-none",
        node.locked ? "cursor-default" : "cursor-grab active:cursor-grabbing",
        isSelected && "ring-2 ring-primary ring-offset-1 ring-offset-background rounded-md",
        className,
      )}
      style={{
        left: node.x,
        top: node.y,
        width: node.width,
        height: node.height,
        zIndex: node.zIndex ?? 0,
      }}
    >
      {children}
    </div>
  );
}

CanvasNodeView.displayName = "CanvasNodeView";

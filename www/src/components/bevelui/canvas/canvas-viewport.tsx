"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useCanvasCtx } from "./canvas-context";
import { CanvasNodeView } from "./canvas-node-view";
import { CanvasSelectionBox } from "./canvas-selection-box";
import type { CanvasNode } from "./types";

export interface CanvasViewportProps {
  className?: string;
  renderNode?: (node: CanvasNode, isSelected: boolean) => React.ReactNode;
}

export function CanvasViewport({ className, renderNode }: CanvasViewportProps) {
  const { engine, config, nodes, selection } = useCanvasCtx();

  const viewportRef = React.useRef<HTMLDivElement>(null);
  const worldRef = React.useRef<HTMLDivElement>(null);
  const spacePressed = React.useRef(false);

  React.useEffect(() => {
    engine.attachViewportElement(viewportRef.current);
    engine.attachWorldElement(worldRef.current);
    return () => {
      engine.attachViewportElement(null);
      engine.attachWorldElement(null);
    };
  }, [engine]);

  React.useEffect(() => {
    if (config.panTrigger !== "space-drag") return;
    function onKeyDown(e: KeyboardEvent) {
      if (e.code === "Space") spacePressed.current = true;
    }
    function onKeyUp(e: KeyboardEvent) {
      if (e.code === "Space") spacePressed.current = false;
    }
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("keyup", onKeyUp);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("keyup", onKeyUp);
    };
  }, [config.panTrigger]);

  function intentFor(e: React.PointerEvent): "pan" | "select-box" {
    if (config.panTrigger === "middle-mouse") return e.button === 1 ? "pan" : "select-box";
    if (config.panTrigger === "space-drag") return spacePressed.current ? "pan" : "select-box";
    // default "drag": plain drag pans, shift+drag rubber-bands
    return e.shiftKey ? "select-box" : "pan";
  }

  function onPointerDown(e: React.PointerEvent) {
    if (e.target !== viewportRef.current && e.target !== worldRef.current) return; // hit a node, ignore

    const intent = intentFor(e);
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);

    if (intent === "pan") {
      engine.panStart(e.clientX, e.clientY);
      function onMove(ev: PointerEvent) {
        engine.panMove(ev.clientX, ev.clientY);
      }
      function onUp() {
        engine.panEnd();
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    } else {
      engine.clearSelection();
      engine.startSelectBox(e.clientX, e.clientY);
      function onMove(ev: PointerEvent) {
        engine.updateSelectBox(ev.clientX, ev.clientY);
      }
      function onUp() {
        engine.endSelectBox("replace");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
      }
      window.addEventListener("pointermove", onMove);
      window.addEventListener("pointerup", onUp);
    }
  }

  function onWheel(e: React.WheelEvent) {
    e.preventDefault();
    const factor = Math.exp(-e.deltaY * 0.001);
    const current = engine.getViewport().zoom;
    engine.zoomTo(current * factor, { x: e.clientX, y: e.clientY });
  }

  return (
    <div
      ref={viewportRef}
      onPointerDown={onPointerDown}
      onWheel={onWheel}
      className={cn(
        "relative h-full w-full overflow-hidden rounded-xl border border-border",
        "touch-none select-none cursor-default bg-background",
        className,
      )}
    >
      <div ref={worldRef} className="absolute left-0 top-0 h-0 w-0">
        {nodes.map((node) => (
          <CanvasNodeView key={node.id} node={node}>
            {renderNode ? renderNode(node, selection.has(node.id)) : null}
          </CanvasNodeView>
        ))}
      </div>

      <CanvasSelectionBox />
    </div>
  );
}

CanvasViewport.displayName = "CanvasViewport";

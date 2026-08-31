"use client";

import * as React from "react";
import { CanvasRoot, CanvasViewport, useCanvas } from "@/components/bevelui/canvas";
import type { CanvasNode } from "@/components/bevelui/canvas";
import { cn } from "@/lib/utils";

const DEMO_NODES: CanvasNode[] = [
  { id: "n1", x: 40, y: 40, width: 160, height: 100, data: { label: "Drag me", color: "#c2f13c" } },
  { id: "n2", x: 260, y: 120, width: 160, height: 100, data: { label: "Or me", color: "#60a5fa" } },
  { id: "n3", x: 140, y: 260, width: 160, height: 100, data: { label: "Shift+drag to select multiple", color: "#f472b6" } },
];

function DemoNode({ node, isSelected }: { node: CanvasNode; isSelected: boolean }) {
  const data = node.data as { label: string; color: string };
  return (
    <div
      className={cn(
        "flex h-full w-full items-center justify-center rounded-lg border p-3 text-center text-[12px] font-medium shadow-sm transition-shadow",
        isSelected ? "border-transparent shadow-lg" : "border-border",
      )}
      style={{ backgroundColor: `${data.color}20`, color: data.color }}
    >
      {data.label}
    </div>
  );
}

function DemoControls() {
  const { zoomTo, zoomToFit, viewport } = useCanvas();

  return (
    <div className="flex items-center gap-2">
      <button
        type="button"
        onClick={() => zoomTo(viewport.zoom * 0.8)}
        className="rounded-md border border-border bg-card/80 px-2 py-1 text-[11px] text-foreground/80 hover:bg-muted/60"
      >
        −
      </button>
      <span className="w-10 text-center text-[11px] text-muted-foreground">
        {Math.round(viewport.zoom * 100)}%
      </span>
      <button
        type="button"
        onClick={() => zoomTo(viewport.zoom * 1.25)}
        className="rounded-md border border-border bg-card/80 px-2 py-1 text-[11px] text-foreground/80 hover:bg-muted/60"
      >
        +
      </button>
      <button
        type="button"
        onClick={() => zoomToFit(60)}
        className="rounded-md border border-border bg-card/80 px-2.5 py-1 text-[11px] font-medium text-foreground/80 hover:bg-muted/60"
      >
        Zoom to fit
      </button>
    </div>
  );
}

function DemoBody() {
  return (
    <div className="flex h-full flex-col gap-2">
      <div className="flex items-center justify-between px-1">
        <span className="text-[11px] text-muted-foreground">
          Drag nodes, shift+drag empty space to multi-select, scroll to zoom
        </span>
        <DemoControls />
      </div>
      <div className="flex-1">
        <CanvasViewport
          className="h-full"
          renderNode={(node, isSelected) => <DemoNode node={node} isSelected={isSelected} />}
        />
      </div>
    </div>
  );
}

export function CanvasDemo() {
  return (
    <div className="h-[360px]">
      <CanvasRoot defaultNodes={DEMO_NODES} config={{ panTrigger: "drag", gridSnap: 8 }}>
        <DemoBody />
      </CanvasRoot>
    </div>
  );
}

CanvasDemo.displayName = "CanvasDemo";
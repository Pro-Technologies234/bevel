"use client";

import * as React from "react";
import { useResizable } from "./resizable-context";
import { cn } from "@/lib/utils";

export interface ResizableHandleProps {
  /** Which gap this handle controls: between panel[index] and panel[index+1] */
  index: number;
  className?: string;
}

export function ResizableHandle({ index, className }: ResizableHandleProps) {
  const {
    sizes,
    direction,
    containerRef,
    setSizeDirect,
    commitSizes,
    panelConfigs,
  } = useResizable();
  const handleRef = React.useRef<HTMLDivElement>(null);
  const dragState = React.useRef<{
    startPointer: number;
    startSizeA: number;
    startSizeB: number;
    containerSize: number;
  } | null>(null);

  const configA = panelConfigs[index];
  const configB = panelConfigs[index + 1];
  const minA = configA?.minSize ?? 5;
  const minB = configB?.minSize ?? 5;
  const maxA = configA?.maxSize ?? 95;
  const maxB = configB?.maxSize ?? 95;

  function onPointerDown(e: React.PointerEvent) {
    e.preventDefault();
    e.currentTarget.setPointerCapture(e.pointerId);

    const containerEl = containerRef.current;
    if (!containerEl) return;

    const rect = containerEl.getBoundingClientRect();
    const containerSize = direction === "horizontal" ? rect.width : rect.height;

    dragState.current = {
      startPointer: direction === "horizontal" ? e.clientX : e.clientY,
      startSizeA: sizes[index],
      startSizeB: sizes[index + 1],
      containerSize,
    };
  }

  function onPointerMove(e: React.PointerEvent) {
    if (!dragState.current || e.buttons !== 1) return;

    const { startPointer, startSizeA, startSizeB, containerSize } =
      dragState.current;
    const pointer = direction === "horizontal" ? e.clientX : e.clientY;
    const deltaPercent = ((pointer - startPointer) / containerSize) * 100;

    let newA = Math.max(minA, Math.min(maxA, startSizeA + deltaPercent));
    let newB = Math.max(minB, Math.min(maxB, startSizeB - deltaPercent));

    // Clamp so they don't exceed their combined original size
    const total = startSizeA + startSizeB;
    if (newA + newB > total) {
      newA = total - newB;
    }

    // Direct DOM write — zero React re-renders during drag
    setSizeDirect(index, newA);
    setSizeDirect(index + 1, newB);
  }

  function onPointerUp(e: React.PointerEvent) {
    if (!dragState.current) return;

    const { startPointer, startSizeA, startSizeB, containerSize } =
      dragState.current;
    const pointer = direction === "horizontal" ? e.clientX : e.clientY;
    const deltaPercent = ((pointer - startPointer) / containerSize) * 100;

    let newA = Math.max(minA, Math.min(maxA, startSizeA + deltaPercent));
    let newB = Math.max(minB, Math.min(maxB, startSizeB - deltaPercent));
    const total = startSizeA + startSizeB;
    if (newA + newB > total) newA = total - newB;

    // Commit to React state (one re-render total, at the end of drag)
    const next = [...sizes];
    next[index] = newA;
    next[index + 1] = newB;
    commitSizes(next);

    dragState.current = null;
  }

  return (
    <div
      ref={handleRef}
      role="separator"
      aria-orientation={direction === "horizontal" ? "vertical" : "horizontal"}
      className={cn(
        "group relative flex-shrink-0 flex items-center justify-center",
        "bg-transparent hover:bg-border/60 active:bg-primary/80",
        "transition-colors duration-100 cursor-col-resize select-none",
        direction === "horizontal"
          ? "w-1 cursor-col-resize"
          : "h-1 cursor-row-resize",
        className,
      )}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
    >
      {/* Visual grip dots */}
      <div
        className={cn(
          "flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity",
          direction === "horizontal" ? "flex-col" : "flex-row",
        )}
      >
        {Array.from({ length: 3 }).map((_, i) => (
          <div
            key={i}
            className="w-0.5 h-0.5 rounded-full bg-muted-foreground/50"
          />
        ))}
      </div>
    </div>
  );
}

ResizableHandle.displayName = "ResizableHandle";

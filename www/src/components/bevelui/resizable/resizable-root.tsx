"use client";

import * as React from "react";
import { ResizableCtx } from "./resizable-context";
import type { ResizablePanelConfig, ResizableContextValue } from "./types";
import { cn } from "@/lib/utils";

export interface ResizableRootProps {
  defaultSizes: number[]; // must sum to 100
  direction?: "horizontal" | "vertical";
  panelConfigs?: ResizablePanelConfig[];
  onResize?: (sizes: number[]) => void;
  children: React.ReactNode;
  className?: string;
}

export function ResizableRoot({
  defaultSizes,
  direction = "horizontal",
  panelConfigs = [],
  onResize,
  children,
  className,
}: ResizableRootProps) {
  const [sizes, setSizes] = React.useState<number[]>(defaultSizes);
  const [collapsed, setCollapsed] = React.useState<boolean[]>(() =>
    panelConfigs.map((c) => c.defaultCollapsed ?? false),
  );
  const containerRef = React.useRef<HTMLDivElement>(null);

  // Write sizes as CSS vars directly — used during drag (no re-render)
  function writeCssVars(s: number[]) {
    const el = containerRef.current;
    if (!el) return;
    s.forEach((size, i) => {
      el.style.setProperty(`--panel-${i}`, `${size}%`);
    });
  }

  // Initialize CSS vars when sizes state changes
  React.useLayoutEffect(() => {
    writeCssVars(sizes);
  }, [sizes]);

  const setSizeDirect = React.useCallback((index: number, size: number) => {
    // Direct DOM write — bypasses React entirely
    const el = containerRef.current;
    if (!el) return;
    el.style.setProperty(`--panel-${index}`, `${size}%`);
  }, []);

  const commitSizes = React.useCallback(
    (next: number[]) => {
      setSizes(next);
      onResize?.(next);
    },
    [onResize],
  );

  const toggleCollapse = React.useCallback(
    (panelIndex: number) => {
      const config = panelConfigs[panelIndex];
      if (!config?.collapsible) return;
      setCollapsed((prev) => {
        const next = [...prev];
        next[panelIndex] = !prev[panelIndex];
        return next;
      });
    },
    [panelConfigs],
  );

  const ctx: ResizableContextValue = {
    sizes,
    collapsed,
    direction,
    containerRef,
    setSizeDirect,
    commitSizes,
    toggleCollapse,
    panelConfigs,
  };

  return (
    <ResizableCtx.Provider value={ctx}>
      <div
        ref={containerRef}
        className={cn(
          "flex overflow-hidden",
          direction === "horizontal" ? "flex-row" : "flex-col",
          className,
        )}
      >
        {children}
      </div>
    </ResizableCtx.Provider>
  );
}

ResizableRoot.displayName = "ResizableRoot";

"use client";

import * as React from "react";
import { useResizable } from "./resizable-context";
import { cn } from "@/lib/utils";

export interface ResizablePanelProps {
  index: number;
  children: React.ReactNode;
  className?: string;
}

export function ResizablePanel({
  index,
  children,
  className,
}: ResizablePanelProps) {
  const { direction, collapsed, panelConfigs } = useResizable();
  const config = panelConfigs[index];
  const isCollapsed = collapsed[index] ?? false;

  const sizeVar = `var(--panel-${index}, ${100 / 3}%)`;

  return (
    <div
      className={cn("overflow-hidden min-w-0 min-h-0", className)}
      style={{
        [direction === "horizontal" ? "width" : "height"]: isCollapsed
          ? `${config?.collapsedSize ?? 0}%`
          : sizeVar,
        flex: "0 0 auto",
        transition: isCollapsed
          ? "width 200ms ease, height 200ms ease"
          : undefined,
      }}
    >
      {children}
    </div>
  );
}

ResizablePanel.displayName = "ResizablePanel";

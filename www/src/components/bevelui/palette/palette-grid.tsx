"use client";

import * as React from "react";
import { SortableRoot, SortableItem, SortableHandle } from "../sortable";
import { PaletteSwatch } from "./palette-swatch";
import { usePalette } from "./palette-context";
import { cn } from "@/lib/utils";

export interface PaletteGridProps {
  className?: string;
}

export function PaletteGrid({ className }: PaletteGridProps) {
  const { colors, reorder } = usePalette();

  return (
    <SortableRoot
      items={colors}
      onReorder={reorder}
      renderOverlay={(c) => (
        <PaletteSwatch id={c.id} className="opacity-90 shadow-xl scale-105" />
      )}
    >
      <div
        className={cn(
          "grid gap-1.5",
          "grid-cols-[repeat(auto-fill,minmax(36px,1fr))]",
          "p-2 rounded-lg border border-border bg-card/80 min-w-[220px]",
          className,
        )}
      >
        {colors.map((c) => (
          <SortableItem key={c.id} id={c.id} handle>
            <div className="relative group">
              <PaletteSwatch id={c.id} />
              <SortableHandle className="absolute -top-1 -right-1 opacity-0 group-hover:opacity-100 w-4 h-4 p-0 bg-background rounded-full border border-border flex items-center justify-center transition-opacity" />
            </div>
          </SortableItem>
        ))}
      </div>
     </SortableRoot> 
  );
}

PaletteGrid.displayName = "PaletteGrid";
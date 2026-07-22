"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { DOCS_CATEGORIES, type DocsCategoryId } from "@/content/docs/manifest";

export interface DocsCategoryFilterProps {
  activeCategory: DocsCategoryId | "all";
  onSelectCategory: (categoryId: DocsCategoryId | "all") => void;
  counts?: Record<string, number>;
}

export function DocsCategoryFilter({
  activeCategory,
  onSelectCategory,
  counts,
}: DocsCategoryFilterProps) {
  return (
    <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none">
      <button
        onClick={() => onSelectCategory("all")}
        className={cn(
          "px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border",
          activeCategory === "all"
            ? "bg-primary text-primary-foreground border-primary shadow-sm"
            : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/60 hover:text-foreground"
        )}
      >
        All {counts?.all !== undefined && <span className="opacity-70 ml-1 font-mono text-[10px]">({counts.all})</span>}
      </button>

      {DOCS_CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.id;
        const count = counts?.[cat.id];

        return (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.id)}
            className={cn(
              "px-3 py-1.5 rounded-full text-xs font-medium transition-all shrink-0 border flex items-center gap-1.5",
              isActive
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-muted/30 text-muted-foreground border-border/50 hover:bg-muted/60 hover:text-foreground"
            )}
          >
            <span>{cat.label}</span>
            {count !== undefined && (
              <span className={cn("text-[10px] font-mono", isActive ? "opacity-90" : "opacity-60")}>
                ({count})
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

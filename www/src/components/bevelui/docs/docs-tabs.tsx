"use client";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DocsTabItem {
  label: string;
  children: React.ReactNode;
}

export interface DocsTabsProps {
  tabs: DocsTabItem[];
  defaultTab?: number;
  className?: string;
}

export function DocsTabs({ tabs, defaultTab = 0, className }: DocsTabsProps) {
  const [active, setActive] = React.useState(defaultTab);

  return (
    <div
      className={cn(
        "rounded-lg border border-border overflow-hidden",
        className,
      )}
    >
      {/* Tab bar */}
      <div className="flex items-center border-b border-border/60 bg-muted/20 px-1 pt-1 gap-0.5">
        {tabs.map((tab, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            className={cn(
              "px-3 py-1.5 text-xs font-medium rounded-t-md transition-colors",
              active === i
                ? "bg-background text-foreground border border-b-background border-border/60"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div>{tabs[active]?.children}</div>
    </div>
  );
}

DocsTabs.displayName = "DocsTabs";

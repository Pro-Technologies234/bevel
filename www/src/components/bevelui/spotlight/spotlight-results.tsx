"use client";

import * as React from "react";
import { useSpotlight } from "./spotlight-context";
import { SpotlightResultItem } from "./spotlight-result-item";
import { SpotlightSkeleton } from "./spotlight-skeleton";
import type { SpotlightConfig } from "./types";

export function SpotlightResults({ config }: { config: SpotlightConfig }) {
  const { results, isLoading, activeCategory } = useSpotlight();

  if (isLoading) return <SpotlightSkeleton />;

  const filtered = activeCategory === "all"
    ? results
    : results.filter(r => r.category === activeCategory);

  if (filtered.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <p className="text-[13px] text-muted-foreground/50">No results found</p>
      </div>
    );
  }

  // Group by category
  const grouped: Record<string, typeof filtered> = {};
  for (const r of filtered) {
    if (!grouped[r.category]) grouped[r.category] = [];
    grouped[r.category].push(r);
  }

  const showGroups = activeCategory === "all" && Object.keys(grouped).length > 1;

  return (
    <div className="flex flex-col py-2">
      {showGroups
        ? Object.entries(grouped).map(([catId, items]) => {
            const cat = config.categories.find(c => c.id === catId);
            return (
              <div key={catId}>
                <div className="px-4 py-1.5">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">
                    {cat?.label ?? catId}
                  </span>
                </div>
                {items.map(r => <SpotlightResultItem key={r.id} result={r} />)}
              </div>
            );
          })
        : filtered.map(r => <SpotlightResultItem key={r.id} result={r} />)}
    </div>
  );
}
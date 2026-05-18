"use client";

import * as React from "react";
import { useSpotlight } from "./spotlight-context";
import { IconClock, IconX } from "@tabler/icons-react";

export function SpotlightEmpty() {
  const { recentSearches, setQuery, removeRecent, clearHistory } = useSpotlight();

  if (recentSearches.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-10">
        <p className="text-[13px] text-muted-foreground/40">Start typing to search</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col py-2">
      <div className="flex items-center justify-between px-4 py-1.5">
        <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">Recent</span>
        <button type="button" onClick={clearHistory} className="text-[10px] text-muted-foreground/30 hover:text-muted-foreground transition-colors">
          Clear all
        </button>
      </div>
      {recentSearches.map((q, i) => (
        <div key={i} className="flex items-center gap-3 px-4 py-2 hover:bg-muted/40 transition-colors group">
          <IconClock size={14} className="text-muted-foreground/30 shrink-0" />
          <button type="button" onClick={() => setQuery(q)} className="flex-1 text-left text-[13px] text-muted-foreground/60 hover:text-foreground transition-colors truncate">
            {q}
          </button>
          <button
            type="button"
            onClick={() => removeRecent(q)}
            className="opacity-0 group-hover:opacity-100 text-muted-foreground/30 hover:text-muted-foreground transition-all"
          >
            <IconX size={12} />
          </button>
        </div>
      ))}
    </div>
  );
}
"use client";

import * as React from "react";
import { useSpotlight } from "./spotlight-context";
import { cn } from "@/lib/utils";
import type { SpotlightResult } from "./types";

export function SpotlightResultItem({ result }: { result: SpotlightResult }) {
  const { close } = useSpotlight();

  function handleSelect() {
    if (result.onSelect) result.onSelect();
    else if (result.href) window.open(result.href, "_blank");
    close();
  }

  const Icon = typeof result.icon !== "string" ? result.icon : null;
  const imgSrc = typeof result.icon === "string" ? result.icon : null;

  return (
    <button
      type="button"
      onClick={handleSelect}
      className="flex items-center gap-3 w-full px-4 py-2.5 hover:bg-muted/40 transition-colors text-left group"
    >
      {/* Icon */}
      <div className="w-8 h-8 rounded-lg border border-border bg-muted/50 flex items-center justify-center shrink-0 overflow-hidden">
        {imgSrc  && <img  src={imgSrc} alt="" className="w-5 h-5 object-cover" />}
        {Icon    && <Icon size={15} strokeWidth={1.8} className="text-muted-foreground/60" />}
        {!result.icon && (
          <span className="text-[11px] font-bold text-muted-foreground/40">
            {result.title[0]?.toUpperCase()}
          </span>
        )}
      </div>

      {/* Text */}
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-medium text-foreground truncate group-hover:text-primary transition-colors">
          {result.title}
        </p>
        {result.subtitle && (
          <p className="text-[11px] text-muted-foreground/50 truncate">{result.subtitle}</p>
        )}
      </div>

      {/* Badge */}
      {result.badge && (
        <span className="text-[10px] font-mono text-muted-foreground/30 shrink-0 ml-2">{result.badge}</span>
      )}
    </button>
  );
}
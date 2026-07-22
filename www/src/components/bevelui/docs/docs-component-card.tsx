"use client";

import * as React from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { IconArrowRight, IconSparkles } from "@tabler/icons-react";
import type { DocsManifestItem } from "@/content/docs/manifest";
import { getSystemHref, getTierBadge, getCategoryLabel } from "@/content/docs/manifest";

export interface DocsComponentCardProps {
  system: DocsManifestItem;
}

export function DocsComponentCard({ system }: DocsComponentCardProps) {
  const href = getSystemHref(system.route);
  const badge = getTierBadge(system.tier);
  const Icon = system.icon ?? IconSparkles;
  const categoryLabel = getCategoryLabel(system.category);

  return (
    <Link
      href={href}
      className="group relative flex flex-col justify-between overflow-hidden rounded-2xl border border-border/60 bg-muted/20 hover:bg-muted/40 hover:border-border transition-all duration-200"
    >
      {/* Top Preview Frame (AI Canvas style) */}
      <div className="relative aspect-[16/9] w-full overflow-hidden bg-black/40 border-b border-border/40 p-4 flex flex-col justify-between">
        {/* Subtle grid background pattern */}
        <div className="absolute inset-0 bg-[radial-gradient(#ffffff0a_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />

        {/* Top toolbar in preview card */}
        <div className="relative z-10 flex items-center justify-between gap-2">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-background/80 backdrop-blur-xs border border-border/50 text-[11px] font-medium text-muted-foreground">
            <Icon size={13} className="text-primary" />
            {categoryLabel}
          </span>

          {badge && (
            <Badge
              variant={badge.variant === "red" ? "destructive" : "secondary"}
              className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full"
            >
              {badge.label}
            </Badge>
          )}
        </div>

        {/* Center icon watermark/demo visual preview */}
        <div className="relative z-10 my-auto flex flex-col items-center justify-center text-center py-4">
          <div className="size-12 rounded-xl bg-card/80 border border-border/80 flex items-center justify-center shadow-lg group-hover:scale-105 group-hover:border-primary/50 transition-all duration-200">
            <Icon size={24} className="text-foreground group-hover:text-primary transition-colors" />
          </div>
        </div>
      </div>

      {/* Card Body */}
      <div className="p-5 flex flex-col gap-3 flex-1 justify-between">
        <div className="flex flex-col gap-2">
          <div className="flex items-center justify-between gap-2">
            <h3 className="text-base font-semibold text-foreground tracking-tight group-hover:text-primary transition-colors">
              {system.title}
            </h3>
            <IconArrowRight
              size={15}
              className="text-muted-foreground/50 group-hover:text-primary group-hover:translate-x-0.5 transition-all shrink-0"
            />
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed line-clamp-2">
            {system.description}
          </p>
        </div>

        {/* Use-case tags & Footer button */}
        <div className="flex flex-col gap-3 pt-2">
          {system.useCases && system.useCases.length > 0 && (
            <div className="flex items-center gap-1.5 flex-wrap">
              {system.useCases.map((tag) => (
                <span
                  key={tag}
                  className="px-2 py-0.5 rounded-md bg-muted/60 text-[10px] font-medium text-muted-foreground/80 border border-border/30"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}

          <div className="flex items-center justify-between pt-2 border-t border-border/30 text-[11px] font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            <span>View System</span>
            <span className="text-primary">→</span>
          </div>
        </div>
      </div>
    </Link>
  );
}

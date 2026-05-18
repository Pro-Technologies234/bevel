import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface DocsPageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  features?: string[];
  className?: string;
}

export function DocsPageHeader({
  title,
  description,
  badge,
  features,
  className,
}: DocsPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {badge && (
        <span className="text-[10px] uppercase select-none">{badge}</span>
      )}

      <h1 className="text-3xl font-bold tracking-tighter text-foreground">
        {title}
      </h1>

      <p className="text-foreground/70 leading-relaxed text-sm font-extralight max-w-2xl">
        {description}
      </p>

      {features && features.length > 0 && (
        <div className="flex flex-wrap items-center gap-x-5 gap-y-1.5 pt-1">
          {features.map((f, i) => (
            <Badge
              key={i}
              variant={"secondary"}
              className="flex items-center gap-2 text-[11px] bg-secondary/70 text-foreground/80 font-mono rounded-full"
            >
              {f}
            </Badge>
          ))}
        </div>
      )}

      {/* <div className="h-px bg-gradient-to-r from-primary/40 via-border/30 to-transparent mt-2" /> */}
    </div>
  );
}

DocsPageHeader.displayName = "DocsPageHeader";

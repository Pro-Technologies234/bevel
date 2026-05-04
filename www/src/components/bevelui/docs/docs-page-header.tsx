import * as React from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

export interface DocsPageHeaderProps {
  title: string;
  description: string;
  badge?: string;
  className?: string;
}

export function DocsPageHeader({
  title,
  description,
  badge,
  className,
}: DocsPageHeaderProps) {
  return (
    <div className={cn("flex flex-col gap-3", className)}>
      {badge && (
        <Badge
          variant="secondary"
          className="bg-muted/60 p-3 gap-2 text-[10px] uppercase select-none text-foreground/80"
        >
          {badge}
        </Badge>
      )}

      <h1 className="text-3xl font-semibold tracking-tight text-foreground">
        {title}
      </h1>

      <p className="text-foreground/80 text-base leading-relaxed max-w-xl">
        {description}
      </p>

      <div className="h-px bg-border/60 mt-1" />
    </div>
  );
}

DocsPageHeader.displayName = "DocsPageHeader";

import * as React from "react";
import { cn } from "@/lib/utils";

export interface DocsNavLink {
  label: string;
  href: string;
}

export interface DocsNavigationProps {
  prev?: DocsNavLink;
  next?: DocsNavLink;
  className?: string;
}

export function DocsNavigation({ prev, next, className }: DocsNavigationProps) {
  if (!prev && !next) return null;

  return (
    <div
      className={cn(
        "mt-12 flex items-center justify-between pt-6 border-t border-border/60",
        className,
      )}
    >
      {prev ? (
        <a href={prev.href} className="flex flex-col gap-0.5 text-left group">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Previous
          </span>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            ← {prev.label}
          </span>
        </a>
      ) : (
        <div />
      )}

      {next ? (
        <a href={next.href} className="flex flex-col gap-0.5 text-right group">
          <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
            Next
          </span>
          <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
            {next.label} →
          </span>
        </a>
      ) : (
        <div />
      )}
    </div>
  );
}

DocsNavigation.displayName = "DocsNavigation";

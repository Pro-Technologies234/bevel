import * as React from "react";
import { cn } from "@/lib/utils";

/**
 * Every demo leads with one of these. The point of a demo is to answer
 * "what is this and why would I use it" before any interaction happens —
 * so this sits above the fold, not as a caption underneath.
 */
export function DemoIntro({
  eyebrow,
  children,
  className,
}: {
  eyebrow: string;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <span className="font-mono text-[10px] font-semibold uppercase tracking-wider text-primary/80">
        {eyebrow}
      </span>
      <p className="max-w-xl text-[13px] leading-relaxed text-muted-foreground">
        {children}
      </p>
    </div>
  );
}

/** Small centered mono caption for "try this" interaction hints below a demo. */
export function DemoHint({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p className={cn("text-center font-mono text-[11px] text-muted-foreground/40", className)}>
      {children}
    </p>
  );
}

/**
 * Inline capability chips — for the parts of a system a single interactive
 * demo can't act out (e.g. every export format, every accepted file type)
 * but that someone scanning the demo should still see named.
 */
export function DemoFeatureRow({ items, className }: { items: string[]; className?: string }) {
  return (
    <div className={cn("flex flex-wrap gap-1.5", className)}>
      {items.map((item) => (
        <span
          key={item}
          className="rounded-[4px] border border-border/60 bg-muted/30 px-2 py-0.5 font-mono text-[10.5px] text-muted-foreground/80"
        >
          {item}
        </span>
      ))}
    </div>
  );
}

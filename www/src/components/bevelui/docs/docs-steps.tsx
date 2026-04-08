import * as React from "react";
import { cn } from "@/lib/utils";

export interface DocsStep {
  title: string;
  description?: string;
  children?: React.ReactNode;
}

export interface DocsStepsProps {
  steps: DocsStep[];
  className?: string;
}

export function DocsSteps({ steps, className }: DocsStepsProps) {
  return (
    <div className={cn("flex flex-col", className)}>
      {steps.map((step, i) => {
        const isLast = i === steps.length - 1;
        return (
          <div key={i} className="flex gap-4">
            {/* Left — number + connector */}
            <div className="flex flex-col items-center shrink-0">
              <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
                <span className="text-[11px] font-semibold text-primary">
                  {i + 1}
                </span>
              </div>
              {!isLast && (
                <div className="w-px flex-1 bg-border/60 my-1.5 min-h-[24px]" />
              )}
            </div>

            {/* Right — content */}
            <div className={cn("flex flex-col gap-3 min-w-0", !isLast && "pb-8")}>
              <div className="flex flex-col gap-1 pt-0.5">
                <span className="text-sm font-semibold text-foreground">
                  {step.title}
                </span>
                {step.description && (
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    {step.description}
                  </p>
                )}
              </div>
              {step.children && (
                <div className="w-full">{step.children}</div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

DocsSteps.displayName = "DocsSteps";

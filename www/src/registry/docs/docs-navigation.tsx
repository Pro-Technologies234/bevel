import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";

export interface DocsNavigationProps extends React.HTMLProps<HTMLElement> {
  asChild?: boolean;
}

export const DocsNavigation = React.forwardRef<
  HTMLElement,
  DocsNavigationProps
>(({ asChild, children, className, ...props }, ref) => {
  const Component = asChild ? Slot : "div";

  return (
    <Component
      ref={ref as React.Ref<any>}
      className={cn(
        "mt-12 flex items-center justify-between pt-6 border-t border-border/60",
        className,
      )}
      {...props}
    >
      <a href="#" className="flex flex-col gap-0.5 text-left group">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Previous
        </span>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          ← Quick start
        </span>
      </a>
      <a href="#" className="flex flex-col gap-0.5 text-right group">
        <span className="text-[10px] text-muted-foreground uppercase tracking-wide">
          Next
        </span>
        <span className="text-sm font-medium text-muted-foreground group-hover:text-foreground transition-colors">
          Theming →
        </span>
      </a>
    </Component>
  );
});

DocsNavigation.displayName = "DocsNavigation";

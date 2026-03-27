import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export type TypographyType =
  | "h1"
  | "h2"
  | "h3"
  | "h4"
  | "h5"
  | "h6"
  | "span"
  | "p";

export interface DocsTypographyProps extends React.HTMLProps<HTMLElement> {
  step: number;
  asChild?: boolean;
  as?: TypographyType;
}

export const DocsTypography = React.forwardRef<
  HTMLElement, // Changed to HTMLElement
  DocsTypographyProps
>(({ step, asChild, children, className, as = "p", ...props }, ref) => {
  const Component = asChild ? Slot : as;

  return (
    <Component
      ref={ref as React.Ref<any>}
      data-tour-step={step}
      className={cn("relative inline-block", className)}
      {...props}
    >
      {children}
    </Component>
  );
});

DocsTypography.displayName = "DocsTypography";

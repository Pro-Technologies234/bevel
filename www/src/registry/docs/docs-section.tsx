import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";


export interface DocsSectionProps extends React.HTMLProps<HTMLElement> {
  asChild?: boolean;
  id: string;
}

export const DocsSection = React.forwardRef<
  HTMLElement,
  DocsSectionProps
>(
  (
    { asChild, children, className, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : "section";

    return (
      <Component
        ref={ref as React.Ref<any>}
        className={cn("flex flex-col gap-3 mb-10 w-full", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

DocsSection.displayName = "DocsSection";

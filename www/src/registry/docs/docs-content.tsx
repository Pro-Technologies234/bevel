import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";


export interface DocsContentProps extends React.HTMLProps<HTMLElement> {
  asChild?: boolean;
}

export const DocsContent = React.forwardRef<
  HTMLElement,
  DocsContentProps
>(
  (
    { asChild, children, className, ...props },
    ref,
  ) => {
    const Component = asChild ? Slot : "div";

    return (
      <Component
        ref={ref as React.Ref<any>}
        className={cn("flex-1 min-w-0 px-10 py-12 w-full", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

DocsContent.displayName = "DocsContent";

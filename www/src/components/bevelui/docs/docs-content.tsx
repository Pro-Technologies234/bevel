import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface DocsContentProps extends React.HTMLAttributes<HTMLDivElement> {
  asChild?: boolean;
}

export const DocsContent = React.forwardRef<HTMLDivElement, DocsContentProps>(
  ({ asChild, children, className, ...props }, ref) => {
    const Component = asChild ? (Slot as any) : "div";

    return (
      <Component
        ref={ref}
        className={cn(
          "flex-1 min-w-0 px-4 md:px-8 lg:px-12 py-12  w-full flex flex-col gap-10",
          className,
        )}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

DocsContent.displayName = "DocsContent";

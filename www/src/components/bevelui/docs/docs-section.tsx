import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface DocsSectionProps extends React.HTMLAttributes<HTMLElement> {
  asChild?: boolean;
  id: string;
}

export const DocsSection = React.forwardRef<HTMLElement, DocsSectionProps>(
  ({ asChild, children, className, id, ...props }, ref) => {
    const Component = asChild ? (Slot as any) : "section";

    return (
      <Component
        ref={ref}
        id={id}
        className={cn("flex flex-col gap-4 w-full scroll-mt-20", className)}
        {...props}
      >
        {children}
      </Component>
    );
  },
);

DocsSection.displayName = "DocsSection";

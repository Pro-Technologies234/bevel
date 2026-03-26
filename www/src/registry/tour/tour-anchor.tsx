import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";
import { HTMLMotionProps, motion } from "motion/react";

export interface TourAnchorProps extends HTMLMotionProps<"div"> {
  step: number;
  asChild?: boolean;
}

export const TourAnchor = React.forwardRef<HTMLDivElement, TourAnchorProps>(
  ({ step, asChild, children, className, ...props }, ref) => {
    const Component = asChild ? Slot : "div";
    const MotionComponent = motion(Component);

    return (
      <MotionComponent
        ref={ref}
        data-tour-step={step}
        className={cn("relative inline-block", className)}
        {...props}
      >
        {children}
      </MotionComponent>
    );
  },
);
TourAnchor.displayName = "TourAnchor";

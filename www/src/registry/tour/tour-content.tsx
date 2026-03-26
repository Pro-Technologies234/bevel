import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { motion, AnimatePresence } from "framer-motion";
import {
  useFloating,
  flip,
  shift,
  offset,
  autoUpdate,
} from "@floating-ui/react";
import { cn } from "@/lib/utils";
import { useTour } from "./tour-context";

export const TourContent = React.forwardRef<HTMLDivElement, any>(
  ({ step, asChild, children, className, ...props }, ref) => {
    const { currentStep, isOpen } = useTour();
    const isActive = currentStep === step;
    const { refs, floatingStyles, context } = useFloating({
      open: isActive && isOpen,
      placement: "bottom",
      whileElementsMounted: autoUpdate,
      middleware: [offset(12), flip(), shift({ padding: 10 })],
    });

    React.useLayoutEffect(() => {
      const anchor = document.querySelector(`[data-tour-step="${step}"]`);
      if (anchor) refs.setReference(anchor);
    }, [step, refs]);

    const Component = asChild ? Slot : "div";
    const MotionComponent = motion(Component);

    return (
      <AnimatePresence>
        {isOpen && isActive && (
          <MotionComponent
            ref={refs.setFloating}
            style={floatingStyles}
            layoutId="tour-card"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className={cn(
              "fixed z-50 min-w-[280px] rounded-xl border bg-popover p-4 shadow-xl",
              className,
            )}
            {...(props as any)}
          >
            {children}
          </MotionComponent>
        )}
      </AnimatePresence>
    );
  },
);

TourContent.displayName = "TourContent";

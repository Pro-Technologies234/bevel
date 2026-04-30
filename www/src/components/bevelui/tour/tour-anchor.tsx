import * as React from "react";
import { createPortal } from "react-dom";
import { Slot } from "@radix-ui/react-slot";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useTour } from "./tour-context";

function mergeRefs<T>(...refs: React.Ref<T>[]): React.RefCallback<T> {
  return (node: T) => {
    refs.forEach((ref) => {
      if (typeof ref === "function") ref(node);
      else if (ref && "current" in ref)
        (ref as React.RefObject<T>).current = node;
    });
  };
}

const RING_PADDING = 6;

function PortalRing({ anchorEl }: { anchorEl: Element | null }) {
  const [rect, setRect] = React.useState<DOMRect | null>(null);

  React.useLayoutEffect(() => {
    if (!anchorEl) return;

    function measure() {
      if (anchorEl) setRect(anchorEl.getBoundingClientRect());
    }

    measure();
    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);
    const ro = new ResizeObserver(measure);
    ro.observe(anchorEl);

    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [anchorEl]);

  if (!rect) return null;

  return createPortal(
    <motion.span
      layoutId="tour-highlight-ring"
      className="pointer-events-none fixed rounded-xl border-2 border-primary z-[201]"
      style={{
        top: rect.top - RING_PADDING,
        left: rect.left - RING_PADDING,
        width: rect.width + RING_PADDING * 2,
        height: rect.height + RING_PADDING * 2,
      }}
      initial={{ opacity: 0, scale: 0.92 }}
      animate={{
        opacity: 1,
        scale: 1,
        top: rect.top - RING_PADDING,
        left: rect.left - RING_PADDING,
        width: rect.width + RING_PADDING * 2,
        height: rect.height + RING_PADDING * 2,
      }}
      exit={{ opacity: 0, scale: 0.92 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    />,
    document.body,
  );
}

export interface TourAnchorProps extends React.HTMLAttributes<HTMLElement> {
  /** 1-based step index — must match a step in your TourStepDef array */
  step: number;
  /** Merge props onto child element (no wrapper div). Uses Radix Slot. */
  asChild?: boolean;
  /** Padding around the anchor element for the highlight ring */
  ringPadding?: number;
  /** Custom class names for the highlight ring */
  ringClassName?: string;
}

export const TourAnchor = React.forwardRef<HTMLElement, TourAnchorProps>(
  (
    {
      step,
      asChild = false,
      children,
      className,
      ringPadding,
      ringClassName,
      ...props
    },
    ref,
  ) => {
    const { currentStep, isOpen } = useTour();
    const isActive = isOpen && currentStep === step;
    const innerRef = React.useRef<HTMLElement | null>(null);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => setMounted(true), []);

    if (asChild) {
      return (
        <>
          <Slot
            ref={mergeRefs(innerRef, ref) as React.Ref<HTMLElement>}
            data-tour-step={step}
            className={cn(isActive && "relative z-[201]", className)}
            {...props}
          >
            {children}
          </Slot>

          {mounted && (
            <AnimatePresence>
              {isActive && <PortalRing anchorEl={innerRef.current} />}
            </AnimatePresence>
          )}
        </>
      );
    }

    return (
      <div
        ref={mergeRefs(innerRef, ref as React.Ref<HTMLDivElement>)}
        data-tour-step={step}
        className={cn(
          "relative inline-block",
          isActive && "z-[201]",
          className,
        )}
        {...props}
      >
        {children}

        <AnimatePresence>
          {isActive && (
            <motion.span
              layoutId="tour-highlight-ring"
              className={cn(
                "pointer-events-none absolute rounded-xl border-2 border-primary animate-pulse",
                ringClassName,
              )}
              style={{ inset: `-${ringPadding ?? RING_PADDING}px` }}
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.92 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
            />
          )}
        </AnimatePresence>
      </div>
    );
  },
);

TourAnchor.displayName = "TourAnchor";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import { useTour } from "./tour-context";

const PADDING = 8;

interface Rect {
  top: number;
  left: number;
  width: number;
  height: number;
}

function useAnchorRect(step: number, isOpen: boolean): Rect | null {
  const [rect, setRect] = React.useState<Rect | null>(null);

  React.useLayoutEffect(() => {
    if (!isOpen) {
      setRect(null);
      return;
    }

    function measure() {
      const el = document.querySelector(`[data-tour-step="${step}"]`);
      if (!el) return;
      const r = el.getBoundingClientRect();
      setRect({
        top: r.top - PADDING,
        left: r.left - PADDING,
        width: r.width + PADDING * 2,
        height: r.height + PADDING * 2,
      });
    }

    measure();

    window.addEventListener("scroll", measure, true);
    window.addEventListener("resize", measure);

    const el = document.querySelector(`[data-tour-step="${step}"]`);
    const ro = new ResizeObserver(measure);
    if (el) ro.observe(el);

    return () => {
      window.removeEventListener("scroll", measure, true);
      window.removeEventListener("resize", measure);
      ro.disconnect();
    };
  }, [step, isOpen]);

  return rect;
}

export function TourOverlay() {
  const { currentStep, isOpen, skip } = useTour();
  const rect = useAnchorRect(currentStep, isOpen);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);
  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && rect && (
        <motion.div
          key="tour-overlay"
          className="fixed inset-0 z-[200]"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={skip}
          aria-hidden
        >
          <svg
            className="absolute inset-0 w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            style={{ pointerEvents: "none" }}
          >
            <defs>
              <mask id="tour-mask">
                <rect width="100%" height="100%" fill="white" />
                <motion.rect
                  rx={10}
                  fill="black"
                  animate={{
                    x: rect.left,
                    y: rect.top,
                    width: rect.width,
                    height: rect.height,
                  }}
                  transition={{ type: "spring", stiffness: 300, damping: 30 }}
                />
              </mask>
            </defs>

            <rect
              width="100%"
              height="100%"
              fill="rgba(0, 0, 0, 0.65)"
              mask="url(#tour-mask)"
            />
          </svg>

          <motion.div
            className="absolute"
            style={{ pointerEvents: "none", borderRadius: 10 }}
            animate={{
              top: rect.top,
              left: rect.left,
              width: rect.width,
              height: rect.height,
            }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          />
        </motion.div>
      )}
    </AnimatePresence>,
    document.body,
  );
}

"use client";

import * as React from "react";
import { createPortal } from "react-dom";
import { AnimatePresence, motion } from "motion/react";
import {
  useFloating,
  autoUpdate,
  offset,
  flip,
  shift,
  arrow,
  FloatingArrow,
  limitShift,
  type Placement,
} from "@floating-ui/react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconX,
  IconPlayerPlay,
  IconPlayerPause,
} from "@tabler/icons-react";
import { useTour } from "./tour-context";
import type { TourMedia } from "./tour-types";

// ─── Media block ──────────────────────────────────────────────────────────────

function TourMediaBlock({ media }: { media: TourMedia }) {
  const [playing, setPlaying] = React.useState(true);
  const videoRef = React.useRef<HTMLVideoElement>(null);

  if (media.type === "image" || media.type === "gif") {
    return (
      <div className="mb-3 -mx-4 -mt-4 overflow-hidden rounded-lg">
        <img
          src={media.src}
          alt={media.alt ?? "Tour illustration"}
          className="w-full object-cover max-h-40"
          draggable={false}
        />
      </div>
    );
  }

  if (media.type === "video") {
    return (
      <div className="mb-3 -mx-4 -mt-4 relative overflow-hidden rounded-lg bg-black group">
        <video
          ref={videoRef}
          src={media.src}
          poster={media.poster}
          autoPlay
          loop
          muted
          playsInline
          className="w-full object-cover max-h-40"
        />
        <button
          onClick={() => {
            if (!videoRef.current) return;
            if (playing) {
              videoRef.current.pause();
            } else {
              videoRef.current.play();
            }
            setPlaying((p) => !p);
          }}
          className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-black/30"
        >
          {playing ? (
            <IconPlayerPause size={28} className="text-white" />
          ) : (
            <IconPlayerPlay size={28} className="text-white" />
          )}
        </button>
      </div>
    );
  }

  return null;
}

// ─── Progress dots ────────────────────────────────────────────────────────────

function ProgressDots({
  total,
  current,
  onGoTo,
}: {
  total: number;
  current: number;
  onGoTo: (step: number) => void;
}) {
  return (
    <div className="flex items-center gap-1.5">
      {Array.from({ length: total }).map((_, i) => (
        <button
          key={i}
          onClick={() => onGoTo(i + 1)}
          className={cn(
            "rounded-full transition-all duration-200",
            i + 1 === current
              ? "w-4 h-1.5 bg-primary"
              : "w-1.5 h-1.5 bg-muted-foreground/30 hover:bg-muted-foreground/60"
          )}
          aria-label={`Go to step ${i + 1}`}
        />
      ))}
    </div>
  );
}

// ─── TourCard ─────────────────────────────────────────────────────────────────

export function TourCard() {
  const {
    currentStep,
    totalSteps,
    isOpen,
    currentStepDef,
    next,
    prev,
    skip,
    goTo,
  } = useTour();

  const arrowRef = React.useRef<SVGSVGElement>(null);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => setMounted(true), []);

  const placement = (currentStepDef?.side ?? "bottom") as Placement;

  const { refs, floatingStyles, context } = useFloating({
    placement,
    strategy: "fixed",
    // autoUpdate keeps position correct on scroll/resize
    whileElementsMounted: autoUpdate,
    middleware: [
      offset(currentStepDef?.sideOffset ?? 16),
      // flip() tries the opposite side if card would overflow
      flip({
        fallbackAxisSideDirection: "start",
        padding: 12,
      }),
      // shift() slides the card along the axis to stay in viewport
      shift({
        padding: 12,
        limiter: limitShift(),
      }),
      arrow({ element: arrowRef }),
    ],
  });

  // KEY FIX: useLayoutEffect so the reference is set synchronously before
  // floating-ui calculates position — prevents the top-left flash.
  // We intentionally omit `refs` from deps (it's stable from useFloating).
  React.useLayoutEffect(() => {
    if (!isOpen) {
      refs.setReference(null);
      return;
    }
    const anchor = document.querySelector<Element>(
      `[data-tour-step="${currentStep}"]`
    );
    refs.setReference(anchor ?? null);
  }, [currentStep, isOpen]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!mounted) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && currentStepDef && (
        /*
          KEY FIX: No `key` prop here — we do NOT remount the card between
          steps. Remounting resets useFloating and causes the top-left flash.
          Instead we animate the content change inside with AnimatePresence.
        */
       
          <div
        // 1. Floating UI only touches this outer div
        ref={refs.setFloating}
style={{ 
    ...floatingStyles, 
    zIndex: 210,
    position: 'fixed',
    top: 0,
    left: 0,
    // ADD THIS:
    transition: 'transform 0.3s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.15s ease-out',
    // Optional: ignore transitions when first opening so it doesn't "fly in" from 0,0
    transitionProperty: isOpen ? 'transform, opacity' : 'none',
  }}
      >

        <motion.div
          ref={refs.setFloating}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.15, ease: [0.16, 1, 0.3, 1] }}
          className={cn(
            "w-[300px] rounded-xl border border-border bg-popover p-4",
            "text-popover-foreground shadow-xl outline-none",
            "flex flex-col gap-3"
          )}
          role="dialog"
          aria-label={`Tour step ${currentStep} of ${totalSteps}`}
          // Prevent click from bubbling to overlay (which would skip the tour)
          onClick={(e) => e.stopPropagation()}
        >
          {/* Arrow always points at the anchor */}
          <FloatingArrow
            ref={arrowRef}
            context={context}
            className="fill-popover stroke-border"
            strokeWidth={1}
            width={14}
            height={7}
          />

          {/* Animate card content between steps */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`tour-content-${currentStep}`}
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              transition={{ duration: 0.12 }}
              className="flex flex-col gap-3"
            >
              {/* Media */}
              <div className="p-1" >
              {currentStepDef.media && (
                <TourMediaBlock media={currentStepDef.media} />
              )}
              </div>

              {/* Header */}
              <div className="flex items-start justify-between gap-2">
                <div className="flex flex-col gap-0.5">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wide">
                    Step {currentStep} of {totalSteps}
                  </span>
                  <h3 className="text-sm font-semibold leading-snug">
                    {currentStepDef.title}
                  </h3>
                </div>
                <button
                  onClick={skip}
                  className="rounded-md p-1 text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors shrink-0 -mt-0.5"
                  aria-label="Close tour"
                >
                  <IconX size={14} strokeWidth={2} />
                </button>
              </div>

              {/* Description */}
              <p className="text-xs text-muted-foreground leading-relaxed">
                {currentStepDef.description}
              </p>
            </motion.div>
          </AnimatePresence>

          {/* Footer — always visible, not animated with content */}
          <div className="flex items-center justify-between pt-1 border-t border-border/40">
            <ProgressDots
              total={totalSteps}
              current={currentStep}
              onGoTo={goTo}
            />

            <div className="flex items-center gap-1.5">
              {currentStep > 1 && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 px-2 text-xs cursor-pointer gap-1"
                  onClick={prev}
                >
                  <IconArrowLeft size={12} strokeWidth={2} />
                  Back
                </Button>
              )}

              {currentStep < totalSteps ? (
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs cursor-pointer gap-1"
                  onClick={next}
                >
                  Next
                  <IconArrowRight size={12} strokeWidth={2} />
                </Button>
              ) : (
                <Button
                  size="sm"
                  className="h-7 px-3 text-xs cursor-pointer"
                  onClick={skip}
                >
                  Finish
                </Button>
              )}
            </div>
          </div>

          <p className="text-[10px] text-muted-foreground/40 text-center -mt-1">
            ← → to navigate · Esc to close
          </p>
        </motion.div>
      </div>
      )}
    </AnimatePresence>,
    document.body
  );
}
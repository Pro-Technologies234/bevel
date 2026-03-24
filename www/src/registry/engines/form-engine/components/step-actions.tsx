"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconLoader2,
  IconChevronRight,
  IconCheck,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import React, { ReactNode } from "react";
import { useFormEngineContext } from "../context";

/**
 * Layout behaviour:
 *
 * flow    — Single-column, full-width next button. Back sits below centered.
 *           Typical for card-style or centered modal forms.
 *
 * panel   — Compact side-by-side. Back left, Next right with fixed min-width.
 *           Designed for drawer / side-panel contexts.
 *
 * wizard  — Back on left (icon only on mobile), Next on right with label.
 *           Classic multi-step wizard bar across a full-page layout.
 */

// =============================================================================
// CONSTANTS
// =============================================================================

const layoutConfig = {
  stack: {
    footer: "flex-col items-center gap-3",
    nextWrapper: "order-1 w-full",
    backWrapper: "order-2",
    nextFull: true,
    backIconOnly: false,
  },
  split: {
    footer: "flex-row items-center justify-between gap-4",
    nextWrapper: "order-2 min-w-[130px]",
    backWrapper: "order-1",
    nextFull: false,
    backIconOnly: false,
  },
  compact: {
    footer: "flex-row items-center justify-between gap-4",
    nextWrapper: "order-2 min-w-[160px]",
    backWrapper: "order-1",
    nextFull: false,
    backIconOnly: true, // icon-only back on mobile for wizard
  },
} satisfies Record<
  ActionsLayout,
  {
    footer: string;
    nextWrapper: string;
    backWrapper: string;
    nextFull: boolean;
    backIconOnly: boolean;
  }
>;

export function StepActions({
  loading,
  submitLabel = "Complete Setup",
  nextLabel = "Continue",
  backLabel = "Go back",
  loadingLabel = "Processing...",
  layout = "stack",
  hideBackOnFirst = true,
  styles,
}: StepActionsProps) {
  const {
    isFirstStep,
    isLastStep,
    isSubmitting,
    isValidating,
    goBack,
    goNext,
  } = useFormEngineContext();
  const config = layoutConfig[layout];
  const showBack = !isFirstStep || !hideBackOnFirst;
  return (
    <footer
      className={cn(
        "w-full flex transition-all duration-300",
        config.footer,
        styles?.container,
      )}
    >
      {/* ── Back Action ─────────────────────────────────────────────── */}
      <div className={cn("flex items-center", config.backWrapper)}>
        <AnimatePresence mode="wait">
          {showBack && (
            <motion.button
              key="back-btn"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isFirstStep ? 0.35 : 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              type="button"
              disabled={isFirstStep || loading}
              onClick={goBack}
              aria-label={backLabel}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground",
                "disabled:pointer-events-none disabled:opacity-35",
                // wizard: show only icon on mobile, label on sm+
                config.backIconOnly && "gap-0 sm:gap-1.5",
                styles?.backBtn,
              )}
            >
              {styles?.backIcon ?? <IconArrowLeft size={16} />}
              <span className={cn(config.backIconOnly && "hidden sm:inline")}>
                {backLabel}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* ── Primary Action (Next / Submit) ──────────────────────────── */}
      <div
        className={cn(
          config.nextWrapper,
          config.nextFull ? "w-full" : "w-auto",
        )}
      >
        <Button
          size="lg"
          disabled={isSubmitting || isValidating}
          onClick={goNext}
          type="button"
          className={cn(
            "relative text-base font-bold",
            "transition-all duration-200",
            "hover:scale-[1.02] active:scale-[0.98]",
            "shadow-[0_8px_32px_rgba(0,0,0,0.12)]",
            "disabled:pointer-events-none disabled:opacity-50",
            config.nextFull ? "w-full" : "w-full sm:w-auto sm:px-8",
            styles?.nextBtn,
          )}
        >
          <AnimatePresence mode="wait">
            {loading ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {styles?.loadingIcon ?? (
                  <IconLoader2 className="animate-spin size-[18px]" />
                )}
                {loadingLabel}
              </motion.span>
            ) : isLastStep ? (
              <motion.span
                key="submit"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {submitLabel}
                {styles?.submitIcon ?? <IconCheck size={18} />}
              </motion.span>
            ) : (
              <motion.span
                key="next"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {nextLabel}
                {styles?.nextIcon ?? <IconChevronRight size={18} />}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </footer>
  );
}

// =============================================================================
// TYPES
// =============================================================================

export type ActionsLayout = "split" | "stack" | "compact";

export interface StepActionsProps {
  loading?: boolean;
  submitLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  loadingLabel?: string;
  hideBackOnFirst?: boolean;
  layout?: ActionsLayout;
  styles?: {
    container?: string;
    nextBtn?: string;
    backBtn?: string;
    nextIcon?: ReactNode;
    backIcon?: ReactNode;
    loadingIcon?: ReactNode;
    submitIcon?: ReactNode;
  };
}

StepActions.displayName = "StepActions";

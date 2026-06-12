"use client";

import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useChecklist } from "./checklist-context";
import { ChecklistItem } from "./checklist-item";
import { ChecklistProgressRing } from "./checklist-progress-ring";
import { IconX, IconSparkles } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { ChecklistConfig } from "./types";

export function ChecklistWidget({ config }: { config: ChecklistConfig }) {
  const {
    steps,
    isOpen,
    toggle,
    close,
    progress,
    completedCount,
    requiredCount,
    isComplete,
  } = useChecklist();

  const posClass =
    config.position === "bottom-left" ? "left-6 bottom-6" : "right-6 bottom-6";

  return (
    <div className={cn("fixed z-50 flex flex-col items-end gap-3", posClass)}>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="w-80 rounded-xl border border-border bg-card shadow-2xl shadow-black/40 overflow-hidden p-1"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 pt-4 pb-3 border-b border-border/60">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-semibold text-foreground">
                  {config.title ?? "Get started"}
                </span>
                {config.subtitle && (
                  <span className="text-[11px] text-muted-foreground/60">
                    {config.subtitle}
                  </span>
                )}
              </div>
              <button
                type="button"
                onClick={close}
                className="text-muted-foreground/40 hover:text-foreground transition-colors"
              >
                <IconX size={14} />
              </button>
            </div>

            {/* Progress bar */}
            <div className="px-4 py-2.5 border-b border-border/40">
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[10px] font-mono text-muted-foreground/50 uppercase tracking-wider">
                  {completedCount} of {requiredCount} complete
                </span>
                <span className="text-[10px] font-mono text-primary/70">
                  {progress}%
                </span>
              </div>
              <div className="h-1 bg-muted/50 rounded-full overflow-hidden">
                <motion.div
                  className="h-full bg-primary rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            </div>

            {/* Steps */}
            {isComplete ? (
              <div className="flex flex-col items-center gap-2 py-8 px-4">
                <div className="w-10 h-10 rounded-full bg-primary/15 border border-primary/30 flex items-center justify-center">
                  <IconSparkles size={18} className="text-primary" />
                </div>
                <p className="text-[13px] font-semibold text-foreground">
                  You're all set
                </p>
                <p className="text-[11px] text-muted-foreground/60 text-center">
                  All steps completed. You're ready to go.
                </p>
              </div>
            ) : (
              <div className="flex flex-col divide-y divide-border/40 py-1 max-h-72 overflow-y-auto space-y-1">
                {steps.map((step) => (
                  <ChecklistItem key={step.id} step={step} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating trigger */}
      <motion.button
        type="button"
        onClick={toggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="relative flex items-center justify-center w-12 h-12 rounded-full bg-card border border-border shadow-lg shadow-black/30 hover:border-primary/40 transition-colors"
        title="Setup checklist"
      >
        <ChecklistProgressRing
          progress={progress}
          size={44}
          strokeWidth={2.5}
        />
        <span className="absolute text-[10px] font-bold text-primary tabular-nums">
          {completedCount}/{requiredCount}
        </span>
      </motion.button>
    </div>
  );
}

ChecklistWidget.displayName = "ChecklistWidget";

import { ReactNode } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "../context";

// =============================================================================
// TYPES
// =============================================================================

export interface StepProgressProps {
  className?: string;
  variants?: "dots" | "segments" | "numbers";
  renderStep?: (index: number, state: StepProgressState) => ReactNode
}

export type StepProgressState = "active" | "inactive" | "current"

export function StepProgress({
  className,
  variants,
  renderStep,
}: StepProgressProps) {
    const {  currentStep, totalSteps } = useFormEngineContext()
    const stepNumber = currentStep;
    const isActive = stepNumber === currentStep;
    const isCompleted = stepNumber < currentStep;

    if (renderStep) return null;

    switch(variants) {
        case "dots":
            return(
                <PillStep state=""  />
            )
    }
}

StepProgress.displayName = "StepProgress";

// =============================================================================
// TYPES
// =============================================================================

export interface PillStepProps {
  state: StepProgressState;
  className?: string;
  onClick?: () => void;
}

const PILL_VARIANTS = {
  current: {
    width: 24,
    backgroundColor: "bg-primary",
  },
  completed: {
    width: 6,
    backgroundColor: "bg-foreground",
  },
  inactive: {
    width: 6,
    backgroundColor: "bg-foreground/40",
  },
};

export function PillStep({ state, className, onClick }: PillStepProps) {
    const isActive = state === "active";
  return (
    <div
      onClick={onClick}
      className={cn("relative py-4 flex items-center cursor-pointer", className)}
    >
      <motion.div
        initial={false}
        animate={PILL_VARIANTS[state]}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("h-1.5 rounded-full", PILL_VARIANTS[state].backgroundColor)}
      />

      {isActive && (
        <motion.div
          layoutId="pill-glow"
          className="absolute inset-0 bg-primary/20 blur-md rounded-full -z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        />
      )}
    </div>
  );
}
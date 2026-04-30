import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "./form-engine-context";

export type FormEngineProgressVariant = "dots" | "segments" | "numbers";
export type FormEngineProgressState = "active" | "inactive" | "completed";

export interface FormEngineProgressProps {
  className?: string;
  variant?: FormEngineProgressVariant;
  renderStep?: (index: number, state: FormEngineProgressState) => ReactNode;
}

interface PillStepProps {
  state: FormEngineProgressState;
  className?: string;
  onClick?: () => void;
}

const PILL_STATE = {
  active: { width: 24, backgroundColor: "bg-primary" },
  completed: { width: 6, backgroundColor: "bg-foreground" },
  inactive: { width: 6, backgroundColor: "bg-foreground/30" },
} as const;

export function FormEngineProgressPill({
  state,
  className,
  onClick,
}: PillStepProps) {
  const isActive = state === "active";

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative py-4 flex items-center",
        onClick && "cursor-pointer",
        className,
      )}
    >
      <motion.div
        initial={false}
        animate={PILL_STATE[state]}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={cn("h-1.5 rounded-full", PILL_STATE[state].backgroundColor)}
      />

      <AnimatePresence>
        {isActive && (
          <motion.div
            layoutId="pill-glow"
            className="absolute inset-0 bg-primary/40 blur-md rounded-full "
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}

export function FormEngineProgress({
  className,
  variant = "dots",
  renderStep,
}: FormEngineProgressProps) {
  const { currentStep, totalSteps, goTo } = useFormEngineContext();
  const steps = Array.from({ length: totalSteps });

  function getState(i: number): FormEngineProgressState {
    if (i === currentStep) return "active";
    if (i < currentStep) return "completed";
    return "inactive";
  }

  if (renderStep) {
    return (
      <div className={cn("flex items-center gap-2", className)}>
        {steps.map((_, i) => renderStep(i, getState(i)))}
      </div>
    );
  }

  if (variant === "dots") {
    return (
      <div className={cn("flex items-center justify-center gap-2", className)}>
        {steps.map((_, i) => (
          <FormEngineProgressPill
            key={i}
            state={getState(i)}
            onClick={() => goTo(i)}
          />
        ))}
      </div>
    );
  }

  return null;
}

FormEngineProgress.displayName = "FormEngineProgress";

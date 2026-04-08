"use client";

import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconCheck,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "./form-engine-context";

export interface FormEngineNavigationProps {
  backLabel?: string;
  nextLabel?: string;
  submitLabel?: string;
  className?: string;
}

/**
 * FormEngineNavigation — minimal back/next/submit buttons.
 * For the full-featured version with layout presets and icon customisation,
 * use FormEngineActions instead.
 */
export function FormEngineNavigation({
  backLabel = "Back",
  nextLabel = "Continue",
  submitLabel = "Submit",
  className,
}: FormEngineNavigationProps) {
  const {
    isFirstStep,
    isLastStep,
    isValidating,
    isSubmitting,
    goBack,
    goNext,
  } = useFormEngineContext();

  const busy = isValidating || isSubmitting;

  return (
    <div className={cn("flex items-center gap-3", className)}>
      {!isFirstStep && (
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={busy}
          className="gap-2 cursor-pointer"
        >
          <IconArrowLeft size={14} strokeWidth={2} />
          {backLabel}
        </Button>
      )}

      <Button
        type="button"
        onClick={goNext}
        disabled={busy}
        className="ms-auto gap-2 cursor-pointer"
      >
        {busy && (
          <IconLoader2 size={14} strokeWidth={2} className="animate-spin" />
        )}
        {!busy && isLastStep && <IconCheck size={14} strokeWidth={2.5} />}
        {isLastStep ? submitLabel : nextLabel}
        {!isLastStep && !busy && (
          <IconArrowRight size={14} strokeWidth={2} />
        )}
      </Button>
    </div>
  );
}

FormEngineNavigation.displayName = "FormEngineNavigation";

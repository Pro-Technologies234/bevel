"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconArrowRight,
  IconLoader2,
  IconCheck,
} from "@tabler/icons-react";
import { useFormEngineContext } from "./form-engine-context";


export interface FormEngineNavigationProps {
  /** Override the "Back" button label */
  backLabel?: string;
  /** Override the "Next" button label */
  nextLabel?: string;
  /** Override the "Submit" button label */
  submitLabel?: string;
  /** Override the "Skip" button label */
  skipLabel?: string;
  className?: string;
}

export function FormEngineNavigation({
  backLabel = "Back",
  nextLabel = "Continue",
  submitLabel = "Submit",
  skipLabel = "Skip for now",
  className,
}: FormEngineNavigationProps) {
  const {
    isFirstStep,
    isLastStep,
    isValidating,
    isSubmitting,
    goNext,
    goBack,
    // submit,
  } = useFormEngineContext();

  const busy = isValidating || isSubmitting;

  // In RTL, Left arrow means "forward" (next) and right means "back"
  const BackIcon =  IconArrowLeft;
  const NextIcon = IconArrowRight;

  return (
    <div
      className={cn("flex items-center gap-3", className)}
    >

      {/* Back */}
      {!isFirstStep && (
        <Button
          type="button"
          variant="outline"
          onClick={goBack}
          disabled={busy}
          className="gap-2 cursor-pointer"
        >
          <BackIcon size={14} strokeWidth={2} />
          {backLabel}
        </Button>
      )}

      {/* Next / Submit */}
      <Button
        type="button"
        onClick={goNext}
        disabled={busy}
        className={cn(
          "gap-2 cursor-pointer",
          !isFirstStep ? "ms-auto" : "ms-auto",
        )}
      >
        {busy && (
          <IconLoader2 size={14} strokeWidth={2} className="animate-spin" />
        )}
        {!busy && isLastStep && (
          <IconCheck size={14} strokeWidth={2.5} />
        )}
        {isLastStep ? submitLabel : nextLabel}
        {!isLastStep && !busy && (
          <NextIcon size={14} strokeWidth={2} />
        )}
      </Button>
    </div>
  );
}

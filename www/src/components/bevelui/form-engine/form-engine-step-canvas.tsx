"use client";

import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import type { FormEngineStepDef } from "./form-engine-types";
import { FormEngineField } from "./form-engine-field";
import type { FormEngineActionsProps } from "./form-engine-actions";
import { FormEngineActions } from "./form-engine-actions";
import { useFormEngineContext } from "./form-engine-context";

// ─── FormEngineStepCanvasItem ─────────────────────────────────────────────────

interface FormEngineStepCanvasItemProps {
  when: number;
  active: number;
  step: FormEngineStepDef;
  actionsProps?: FormEngineActionsProps;
  unmount?: boolean;
  className?: string;
}

export function FormEngineStepCanvasItem({
  when,
  active,
  step,
  unmount = true,
  actionsProps,
  className,
}: FormEngineStepCanvasItemProps) {
  const renderedFields = step.fields.map((field) => (
    <FormEngineField key={field.key} field={field} />
  ));

  if (active !== when) {
    return unmount ? null : <div aria-hidden />;
  }

  // Custom layout — consumer controls structure
  if (step.layout) {
    const fields = <>{renderedFields}</>;
    const actions = <FormEngineActions {...actionsProps} />;
    return step.layout(fields, actions);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.25, ease: "easeInOut" }}
        className={cn("w-full space-y-4", className)}
      >
        {renderedFields}
      </motion.div>
    </AnimatePresence>
  );
}

// ─── FormEngineStepCanvas ─────────────────────────────────────────────────────

interface FormEngineStepCanvasProps {
  actionsProps?: FormEngineActionsProps;
  unmount?: boolean;
  className?: string;
}

export function FormEngineStepCanvas({
  unmount = true,
  className,
  actionsProps,
}: FormEngineStepCanvasProps) {
  const { currentStep, config } = useFormEngineContext();

  return (
    <>
      {config.steps.map((step, i) => (
        <FormEngineStepCanvasItem
          key={step.id}
          step={step}
          when={i}
          active={currentStep}
          unmount={unmount}
          className={className}
          actionsProps={actionsProps}
        />
      ))}
    </>
  );
}

FormEngineStepCanvas.displayName = "FormEngineStepCanvas";
FormEngineStepCanvasItem.displayName = "FormEngineStepCanvasItem";

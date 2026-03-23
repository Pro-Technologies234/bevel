// utilities/multistep/form-step.tsx
"use client";

import { PropsWithChildren, ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FormField, FormStep } from "../types";
import { FieldRenderer } from "./field-renderer";
import { StepActions, StepActionsProps } from "./step-actions";

// =============================================================================
// TYPES
// =============================================================================

export interface StepCanvasProps<T> {
  when: number;
  active: number;
  step: FormStep<T>;
  actionsProps?: StepActionsProps;
  unmount?: boolean;
  className?: string;
}

// =============================================================================
// COMPONENT
// =============================================================================

export function StepCanvas<T extends Record<string, unknown>>({
  when,
  active,
  step,
  unmount = true,
  actionsProps,
  className,
}: StepCanvasProps<T>) {
  function renderFields<T extends Record<string, unknown>>(
    fields: FormField<T>[],
  ) {
    return fields.map((field,i) => <FieldRenderer key={String(field.key)} field={field} />);
  }
  if (active !== when) {
    return unmount ? null : <div></div>;
  }


if (step.layout) {
  const fields = <>{renderFields(step.fields)}</>
  const actions = <StepActions {...actionsProps} /> // placeholder for now, StepActions comes later
  return step.layout(fields, actions)
}

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn("w-full", className)}
      >
        {renderFields(step.fields)}
          <StepActions {...actionsProps} />
      </motion.div>
    </AnimatePresence>
  );
}

StepCanvas.displayName = "StepCanvas";

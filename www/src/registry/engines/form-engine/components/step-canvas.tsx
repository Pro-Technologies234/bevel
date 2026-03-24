// utilities/multistep/form-step.tsx
"use client";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { FormField, FormStep } from "../types";
import { FieldRenderer } from "./field-renderer";
import { StepActions, StepActionsProps } from "./step-actions";
import { useFormEngineContext } from "../context";

export function StepCanvasItem<T extends Record<string, unknown>>({
  when,
  active,
  step,
  unmount = true,
  actionsProps,
  className,
}: StepCanvasProps<T>) {
  function renderFields(fields: FormField<T>[]) {
    return fields.map((field, i) => (
      <FieldRenderer key={String(field.key)} field={field} />
    ));
  }
  if (active !== when) {
    return unmount ? null : <div></div>;
  }

  if (step.layout) {
    const fields = <>{renderFields(step.fields)}</>;
    const actions = <StepActions {...actionsProps} />;
    return step.layout(fields, actions);
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={active}
        initial={{ x: 20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        exit={{ x: -20, opacity: 0 }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
        className={cn("w-full space-y-4", className)}
      >
        {renderFields(step.fields)}
      </motion.div>
    </AnimatePresence>
  );
}

export function StepCanvas<T extends Record<string, unknown>>({
  unmount = true,
  className,
  actionsProps,
}: Omit<StepCanvasProps<T>, "when" | "active" | "step">) {
  const { currentStep, config } = useFormEngineContext<T>();

  return (
    <>
      {(config.steps as FormStep<T>[]).map((step, i) => (
        <StepCanvasItem
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

export interface StepCanvasProps<T> {
  when: number;
  active: number;
  step: FormStep<T>;
  actionsProps?: StepActionsProps;
  unmount?: boolean;
  className?: string;
}

StepCanvas.displayName = "StepCanvas";
StepCanvasItem.displayName = "StepCanvasItem";

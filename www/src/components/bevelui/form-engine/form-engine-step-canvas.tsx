import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { FormEngineField } from "./form-engine-field";

import { useFormEngineContext } from "./form-engine-context";

interface FormEngineStepCanvasProps {
  className?: string;
}

/**
 * FormEngineStepCanvas — renders the active step's fields (and actions).
 *
 * Used inside FormEngine (batteries-included).
 * If you need headless field rendering, use FormEngineStep instead.
 */
export function FormEngineStepCanvas({ className }: FormEngineStepCanvasProps) {
  const { currentStep, config } = useFormEngineContext();

  return (
    <AnimatePresence mode="wait" initial={false}>
      {config.steps.map((step, i) => {
        if (i !== currentStep) return null;

        const renderedFields = (step.fields ?? []).map((field) => (
          <FormEngineField key={field.key} field={field} />
        ));

        if (step.layout) {
          return (
            <motion.div
              key={step.id}
              initial={{ x: 10, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -10, opacity: 0 }}
              transition={{ duration: 0.16, ease: "easeOut" }}
            >
              {step.layout(<>{renderedFields}</>)}
            </motion.div>
          );
        }

        return (
          <motion.div
            key={step.id}
            initial={{ x: 10, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -10, opacity: 0 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className={cn("w-full flex flex-col gap-4", className)}
          >
            {renderedFields}
          </motion.div>
        );
      })}
    </AnimatePresence>
  );
}

FormEngineStepCanvas.displayName = "FormEngineStepCanvas";

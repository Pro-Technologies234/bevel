"use client";

import { cn } from "@/lib/utils";
import { FormEngineContext } from "./form-engine-context";
import { useFormEngineState } from "./form-engine-hook";
import { FormEngineProgress } from "./form-engine-progress";
import { FormEngineStepMeta } from "./form-engine-step-meta";
import { FormEngineStepCanvas } from "./form-engine-step-canvas";
import type { FormEngineActionsProps } from "./form-engine-actions";
import type { FormEngineProps } from "./form-engine-types";

interface FormEngineComponentProps extends FormEngineProps {
  actionsProps?: FormEngineActionsProps;
}

/**
 * FormEngine — batteries-included component.
 * Renders: progress dots → step title/description → fields → actions.
 *
 * Actions live inside FormEngineStepCanvas and animate with each step.
 * For full layout control, use FormEngineRoot instead.
 *
 * @example — simple usage
 * <FormEngine config={config} onSubmit={onSubmit} />
 *
 * @example — with zod validation
 * <FormEngine
 *   config={config}
 *   plugins={[createZodPlugin(schemas)]}
 *   onSubmit={onSubmit}
 * />
 *
 * @example — custom action layout
 * <FormEngine
 *   config={config}
 *   onSubmit={onSubmit}
 *   actionsProps={{ submitLabel: "Create account", layout: "split" }}
 * />
 */
export function FormEngine({
  config,
  plugins,
  defaultValues,
  className,
  actionsProps,
  onSubmit,
}: FormEngineComponentProps) {
  const engine = useFormEngineState({
    config,
    plugins,
    defaultValues,
    onSubmit,
  });

  return (
    <FormEngineContext.Provider value={engine}>
      <div className={cn("flex flex-col gap-6 w-full", className)}>
        <FormEngineProgress />
        <FormEngineStepMeta />
        {/* FormEngineStepCanvas renders both fields and actions */}
        <FormEngineStepCanvas actionsProps={actionsProps} />
      </div>
    </FormEngineContext.Provider>
  );
}

FormEngine.displayName = "FormEngine";

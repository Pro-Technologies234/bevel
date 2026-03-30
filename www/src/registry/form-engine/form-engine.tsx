"use client";

import { cn } from "@/lib/utils";
import { FormEngineContext } from "./form-engine-context";
import { useFormEngineState } from "./form-engine-hook";
import { FormEngineProgress } from "./form-engine-progress";
import { FormEngineStepMeta } from "./form-engine-step-meta";
import { FormEngineStepCanvas } from "./form-engine-step-canvas";
import { FormEngineActions, type FormEngineActionsProps } from "./form-engine-actions";
import type { FormEngineProps } from "./form-engine-types";

interface FormEngineComponentProps extends FormEngineProps {
  actionsProps?: FormEngineActionsProps;
}

/**
 * FormEngine — the batteries-included component.
 * Renders: progress dots → step title/description → fields → actions.
 *
 * For full layout control, use FormEngineRoot instead.
 *
 * @example — simple usage
 * <FormEngine config={config} plugins={[createZodPlugin(schemas)]} />
 *
 * @example — with custom action labels
 * <FormEngine
 *   config={config}
 *   actionsProps={{ submitLabel: "Create account", layout: "split" }}
 * />
 */
export function FormEngine({
  config,
  plugins,
  className,
  actionsProps,
}: FormEngineComponentProps) {
  const engine = useFormEngineState({ config, plugins });

  return (
    <FormEngineContext.Provider value={engine}>
      <div className={cn("flex flex-col gap-6 w-full", className)}>
        <FormEngineProgress />
        <FormEngineStepMeta />
        <FormEngineStepCanvas actionsProps={actionsProps} />
        <FormEngineActions {...actionsProps} />
      </div>
    </FormEngineContext.Provider>
  );
}

FormEngine.displayName = "FormEngine";

"use client";

import { cn } from "@/lib/utils";
import { FormEngineContext } from "./form-engine-context";
import { useFormEngineState } from "./form-engine-hook";
import type { FormEngineRootProps } from "./form-engine-types";

/**
 * FormEngineRoot — provides the engine context without rendering any UI.
 * Use this when you want full control of the layout.
 *
 * @example
 * <FormEngineRoot config={config} plugins={[validationPlugin]}>
 *   <FormEngineStepMeta />
 *   <FormEngineStepCanvas />
 *   <FormEngineNavigation submitLabel="Create account" />
 * </FormEngineRoot>
 */
export function FormEngineRoot({
  config,
  plugins,
  className,
  children,
}: FormEngineRootProps) {
  const engine = useFormEngineState({ config, plugins });

  return (
    <FormEngineContext.Provider value={engine}>
      <div className={cn("flex flex-col gap-6 w-full", className)}>
        {children}
      </div>
    </FormEngineContext.Provider>
  );
}

FormEngineRoot.displayName = "FormEngineRoot";

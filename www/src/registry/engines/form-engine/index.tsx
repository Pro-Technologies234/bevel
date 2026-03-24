import { cn } from "@/lib/utils";
import { StepActions } from "./components/step-actions";
import { StepCanvas } from "./components/step-canvas";
import { StepMeta } from "./components/step-meta";
import { StepProgress } from "./components/step-progress";
import { FormEngineContext, FormEngineContextValue } from "./context";
import { useFormEngine } from "./hooks/use-form-engine";
import { FormEngineProps } from "./types";

export function FormEngine<
  T extends Record<string, unknown>,
  C extends Record<string, unknown>,
>({
  config,
  reactive,
  context,
  plugins,
  className,
  schema,
  onSubmit,
}: FormEngineProps<T, C>) {
  const engine = useFormEngine<T, C>({
    config,
    context,
    reactive,
    plugins,
  });
  const currentStepConfig = config.steps[engine.currentStep];

  return (
    <FormEngineContext.Provider
      value={engine as FormEngineContextValue<Record<string, unknown>>}
    >
      <div className={cn("flex flex-col gap-6 w-full", className)}>
        <StepProgress />
        <StepMeta />
        <StepCanvas />
        <StepActions />
      </div>
    </FormEngineContext.Provider>
  );
}

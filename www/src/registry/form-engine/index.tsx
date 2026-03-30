import { cn } from "@/lib/utils";
import { StepActions } from "./components/step-actions";
import { StepCanvas } from "./components/step-canvas";
import { StepMeta } from "./components/step-meta";
import { StepProgress } from "./components/step-progress";
import { FormEngineContext } from "./form-engine-context";
import { useFormEngine } from "./use-form-engine";
import { FormEngineContextValue, FormEngineProps } from "./form-engine-types";
import { FormEngineNavigation } from "./form-engine-navigation";

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
        <FormEngineNavigation />
      </div>
    </FormEngineContext.Provider>
  );
}

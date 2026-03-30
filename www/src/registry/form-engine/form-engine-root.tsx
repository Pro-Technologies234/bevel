import { cn } from "@/lib/utils";
import { FormEngineContext,  } from "./form-engine-context";
import { useFormEngine } from "./use-form-engine";
import { FormEngineContextValue, FormEngineRootProps } from "./form-engine-types";

export function FormEngineRoot<
  T extends Record<string, unknown>,
  C extends Record<string, unknown>,
>({
  config,
  reactive,
  context,
  plugins,
  children,
  className,
}: FormEngineRootProps<T, C>) {
  const engine = useFormEngine({ config, reactive, context, plugins });

  return (
    <FormEngineContext.Provider
      value={engine as FormEngineContextValue<Record<string, unknown>>}
    >
      <div className={cn("flex flex-col gap-6 w-full", className)}>
        {children}
      </div>
    </FormEngineContext.Provider>
  );
}

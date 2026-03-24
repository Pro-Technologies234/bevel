import { cn } from "@/lib/utils";
import { FormEngineContext, FormEngineContextValue } from "../context";
import { useFormEngine } from "../hooks/use-form-engine";
import { FormEngineRootProps } from "../types";

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

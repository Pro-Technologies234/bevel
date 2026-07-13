import { createContext, useContext } from "react";
import type { FormEngineContextValue } from "./types";

export const FormEngineContext = createContext<FormEngineContextValue | null>(
  null,
);

/**
 * useFormEngineContext — access the form engine state from any child component.
 * Must be used inside <FormEngine> or <FormEngineRoot>.
 */
export function useFormEngineContext(): FormEngineContextValue {
  const ctx = useContext(FormEngineContext);
  if (!ctx) {
    throw new Error(
      "useFormEngineContext must be used within <FormEngine> or <FormEngineRoot>",
    );
  }
  return ctx;
}

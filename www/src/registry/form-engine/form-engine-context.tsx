import { createContext, useContext } from "react";
import { FieldDependencyResult, FormEngineContextValue, FormEngineProps } from "./form-engine-types";
import { FieldErrors, UseFormReturn } from "react-hook-form";

// ─── Field state ───────────────────────────────────────────────────────────────


// ─── Context value ─────────────────────────────────────────────────────────────



// ─── Context ───────────────────────────────────────────────────────────────────

const FormEngineContext = createContext<FormEngineContextValue<
  Record<string, unknown>
> | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export { FormEngineContext };

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useFormEngineContext<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>,
>(): FormEngineContextValue<T, C> {
  const ctx = useContext(FormEngineContext);
  if (!ctx) {
    throw new Error(
      "useFormEngineContext must be used within <FormEngine component",
    );
  }
  return ctx as FormEngineContextValue<T, C>;
}

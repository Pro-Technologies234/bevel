import { createContext, useContext } from "react";
import { FieldDependencyResult, FormEngineProps } from "./types";
import { FieldErrors, UseFormReturn } from "react-hook-form";

// ─── Field state ───────────────────────────────────────────────────────────────

export type FieldState = {
  visible: boolean;
  disabled: boolean;
  options?: { label: string; value: string }[];
};

// ─── Context value ─────────────────────────────────────────────────────────────

export type FormEngineContextValue<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
> = {
  form: UseFormReturn<T>
  values: T;
  setFieldValue: (field: keyof T, value: unknown) => void;

  // Step state
  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => Promise<void>;
  goBack: () => void;
  goTo: (step: number) => void;

  // Field state — visibility, disabled, options per field
  fieldState: Record<keyof T, FieldState>;

  // Loading and error state
  isSubmitting: boolean;
  isValidating: boolean;
  errors: FieldErrors<T>;

  // Context passed from outside
  context: C;

  // Config
  config: FormEngineProps<T, C>["config"];
  reactive?: FormEngineProps<T, C>["reactive"];
};

// ─── Context ───────────────────────────────────────────────────────────────────

const FormEngineContext = createContext<FormEngineContextValue<
  Record<string, unknown>
> | null>(null);

// ─── Provider ──────────────────────────────────────────────────────────────────

export { FormEngineContext };

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useFormEngineContext<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>
>(): FormEngineContextValue<T, C> {
  const ctx = useContext(FormEngineContext);
  if (!ctx) {
    throw new Error(
      "useFormEngineContext must be used inside a FormEngine component",
    );
  }
  return ctx as FormEngineContextValue<T, C>;
}
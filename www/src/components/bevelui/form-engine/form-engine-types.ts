import type { JSX, ReactNode } from "react";
import type { FieldErrors, UseFormReturn } from "react-hook-form";
import type { ZodSchema } from "zod";
import type { CardSelectProps } from "@/components/bevelui/controls/card-select";
import type { ChipSelectProps } from "@/components/bevelui/controls/chip-select";
import type { RatingFieldProps } from "@/components/bevelui/controls/rating-field";
import type { SelectFieldProps } from "@/components/bevelui/controls/select-field";
import type { TagInputProps } from "@/components/bevelui/controls/tag-input";
import type { Icon } from "@tabler/icons-react";

// ─── Form mode ────────────────────────────────────────────────────────────────

export type FormEngineMode = "multi-step" | "single";
export type FormEngineValidation = "per-step" | "on-submit";

// ─── Plugin system ────────────────────────────────────────────────────────────

/**
 * Plugins are the primary extension point for the form engine.
 *
 * @example — zod validation plugin (use the built-in helper)
 * plugins={[createZodPlugin(mySchema)]}
 *
 * @example — analytics plugin
 * plugins={[{
 *   name: "analytics",
 *   onStepChange: (step, values) => track("step_viewed", { step }),
 *   onSubmit: (values) => track("form_submitted"),
 * }]}
 */
export type FormEnginePlugin = {
  name: string;
  onMount?: (values: Record<string, unknown>) => void;
  onStepChange?: (step: number, values: Record<string, unknown>) => void;
  onFieldChange?: (
    field: string,
    value: unknown,
    values: Record<string, unknown>,
  ) => void;
  /**
   * Return false to block navigation away from this step.
   * Runs after react-hook-form per-step trigger passes.
   * Use this for async checks (username availability, server validation).
   */
  onValidate?: (
    step: number,
    values: Record<string, unknown>,
  ) => Promise<boolean> | boolean;
  onSubmit?: (values: Record<string, unknown>) => Promise<void>;
};

// ─── Field variants ───────────────────────────────────────────────────────────

export type TextInputProps = {
  icon?: Icon;
};

export type FormEngineFieldVariant =
  | { variant: "text"; props?: TextInputProps }
  | { variant: "number"; props?: TextInputProps }
  | { variant: "email"; props?: TextInputProps }
  | { variant: "password"; props?: TextInputProps }
  | { variant: "textarea"; props?: TextInputProps }
  | { variant: "checkbox"; props?: never }
  | { variant: "date"; props?: never }
  | { variant: "phone"; props?: never }
  | { variant: "select"; props?: SelectFieldProps }
  | { variant: "card-select"; props?: CardSelectProps }
  | { variant: "chip-select"; props?: ChipSelectProps }
  | { variant: "tag-input"; props?: TagInputProps }
  | { variant: "rating"; props?: RatingFieldProps }
  | { variant: "file"; props?: never };

// ─── Field definition ─────────────────────────────────────────────────────────

export type FormEngineFieldDef = {
  /** Must match a key in your form values */
  key: string;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  /**
   * Conditionally show or hide this field.
   * Return true to show, false to hide.
   *
   * @example
   * showWhen: (values) => values.plan === "pro"
   */
  showWhen?: (values: Record<string, unknown>) => boolean;
} & FormEngineFieldVariant;

// ─── Step definition ──────────────────────────────────────────────────────────

export type FormEngineStepDef = {
  id: string;
  title?: string;
  description?: string;
  fields: FormEngineFieldDef[];
  /**
   * Custom layout — receives rendered fields and actions as JSX.
   *
   * @example
   * layout: (fields, actions) => (
   *   <div className="grid grid-cols-2 gap-8">
   *     <div>{fields}</div>
   *     <div className="mt-auto">{actions}</div>
   *   </div>
   * )
   */
  layout?: (fields: JSX.Element, actions: JSX.Element) => JSX.Element;
  /**
   * Async guard — called after validation passes.
   * Return false to block navigation (e.g. check username availability).
   */
  guard?: (values: Record<string, unknown>) => Promise<boolean> | boolean;
};

// ─── Config ───────────────────────────────────────────────────────────────────

export type FormEngineConfig = {
  id?: string;
  mode?: FormEngineMode;
  validation?: FormEngineValidation;
  /**
   * Full-form Zod schema.
   * For per-step zod validation, use createZodPlugin() instead.
   */
  schema?: ZodSchema;
  steps: FormEngineStepDef[];
};

// ─── Field state ──────────────────────────────────────────────────────────────

export type FormEngineFieldState = {
  visible: boolean;
  disabled: boolean;
};

// ─── Context value ────────────────────────────────────────────────────────────

export type FormEngineContextValue = {
  /** The react-hook-form instance. Expose for advanced consumers. */
  form: UseFormReturn<Record<string, unknown>>;
  values: Record<string, unknown>;
  setFieldValue: (field: string, value: unknown) => void;

  currentStep: number;
  totalSteps: number;
  isFirstStep: boolean;
  isLastStep: boolean;
  goNext: () => Promise<void>;
  goBack: () => void;
  goTo: (step: number) => void;

  /** Computed visibility/disabled per field key */
  fieldState: Record<string, FormEngineFieldState>;

  isSubmitting: boolean;
  isValidating: boolean;
  errors: FieldErrors<Record<string, unknown>>;

  config: FormEngineConfig;
  plugins: FormEnginePlugin[];
};

// ─── Component props ──────────────────────────────────────────────────────────

export type FormEngineProps = {
  config: FormEngineConfig;
  plugins?: FormEnginePlugin[];
  className?: string;
};

export type FormEngineRootProps = {
  config: FormEngineConfig;
  plugins?: FormEnginePlugin[];
  className?: string;
  children: ReactNode;
  onSubmit: (values: Record<string, unknown>) => Promise<void>;
};

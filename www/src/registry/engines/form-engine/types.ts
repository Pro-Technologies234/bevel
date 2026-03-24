import { InputGroupAddon } from "@/components/ui/input-group";
import { CardSelectProps } from "@/registry/controls/card-select";
import { ChipSelectProps } from "@/registry/controls/chip-select";
import { RatingFieldProps } from "@/registry/controls/rating-field";
import { SelectFieldProps } from "@/registry/controls/select-field";
import { TagInputProps } from "@/registry/controls/tag-input";
import { Icon } from "@tabler/icons-react";
import { JSX, ReactNode } from "react";
import { ZodSchema } from "zod";

// ─── Form level ────────────────────────────────────────────────────────────────

export type FormMode = "multi-step" | "single";
export type FormValidation = "per-step" | "on-submit";

// ─── Plugin system ─────────────────────────────────────────────────────────────

export type FormPluginHooks<T extends Record<string, unknown>> = {
  onMount?: (values: T) => void;
  onStepChange?: (step: number, values: T) => void;
  onFieldChange?: (field: keyof T, value: unknown, values: T) => void;
  onValidate?: (step: number, values: T) => Promise<boolean>;
  onSubmit?: (values: T) => Promise<void>;
  onReset?: (values: T) => void;
};

export type FormPlugin<T extends Record<string, unknown>> = {
  name: string;
} & FormPluginHooks<T>;

// ─── Field variants ────────────────────────────────────────────────────────────

export type TextInputProps = {
  icon?: Icon;
  align?: "inline-start" | "inline-end" | "block-start" | "block-end";
};

export type FieldVariant =
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

// ─── Conditional logic ─────────────────────────────────────────────────────────

export type FieldConditionOperator =
  | "equals"
  | "not"
  | "contains"
  | "gt"
  | "lt"
  | "is-empty"
  | "is-not-empty";

export type SimpleCondition<T> = {
  field: keyof T;
  operator: FieldConditionOperator;
  value?: unknown;
};

export type CompoundCondition<T> = {
  operator: "and" | "or";
  conditions: SimpleCondition<T>[];
};

// Config-level — only reacts to form field values
export type ConfigFieldCondition<T> = SimpleCondition<T> | CompoundCondition<T>;

// Engine-level — full access to form values and external context
export type EngineFieldCondition<T, C> =
  | ConfigFieldCondition<T>
  | ((values: T, context: C) => boolean);

// ─── Reactive dependency ───────────────────────────────────────────────────────

export type FieldDependencyResult = {
  options?: { label: string; value: string }[];
  value?: unknown;
  disabled?: boolean;
};

// Config-level — reacts to a specific form field
export type ConfigFieldDependency<T> = {
  field: keyof T;
  effect: (
    value: unknown,
  ) => FieldDependencyResult | Promise<FieldDependencyResult>;
};

// Engine-level — full access, field is optional
export type EngineFieldDependency<T, C> = {
  field?: keyof T;
  effect: (
    value: unknown,
    values: T,
    context: C,
  ) => FieldDependencyResult | Promise<FieldDependencyResult>;
};

// ─── Field ─────────────────────────────────────────────────────────────────────

export type FormField<T> = {
  key: keyof T;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  // Config-level reactivity only
  showWhen?: ConfigFieldCondition<T>;
  dependsOn?: ConfigFieldDependency<T>;
} & FieldVariant;

// ─── Step ──────────────────────────────────────────────────────────────────────

export type FormStep<T> = {
  id: string;
  title?: string;
  description?: string;
  layout?: (fields: JSX.Element, actions: JSX.Element) => JSX.Element;
  guard?: (values: T) => Promise<boolean>;
  fields: FormField<T>[];
};

// ─── Reactive map — engine level override ──────────────────────────────────────

export type FieldReactiveConfig<T, C> = {
  showWhen?: EngineFieldCondition<T, C>;
  dependsOn?: EngineFieldDependency<T, C>;
};

export type ReactiveMap<T extends Record<string, unknown>, C> = {
  [K in keyof T]?: FieldReactiveConfig<T, C>;
};

// ─── Config ────────────────────────────────────────────────────────────────────

export type FormConfig<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>,
> = {
  id?: string;
  mode?: FormMode;
  validation?: FormValidation;
  schema?: ZodSchema;
  steps: FormStep<T>[];
  plugins?: FormPlugin<T>[];
  onSubmit: (values: T) => Promise<void>;
};

// ─── FormEngine props ──────────────────────────────────────────────────────────

export type FormEngineProps<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>,
> = {
  config: FormConfig<T>;
  schema?: ZodSchema;
  reactive?: ReactiveMap<T, C>;
  context?: C;
  plugins?: FormPlugin<T>[];
  className?: string;
  onSubmit?: (values: T) => Promise<void>;
};

export type FormEngineRootProps<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>,
> = {
  config: FormConfig<T>;
  reactive?: ReactiveMap<T, C>;
  context?: C;
  plugins?: FormPlugin<T>[];
  className?: string;
  children: ReactNode;
};

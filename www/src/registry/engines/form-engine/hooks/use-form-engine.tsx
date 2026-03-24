import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  DefaultValues,
  Path,
  PathValue,
  Resolver,
  useForm,
  UseFormReturn,
} from "react-hook-form";
import { FieldState, FormEngineContextValue } from "../context";
import {
  CompoundCondition,
  EngineFieldCondition,
  FieldDependencyResult,
  FormEngineProps,
  SimpleCondition,
} from "../types";
import { zodResolver } from "@hookform/resolvers/zod";
import z from "zod";

// ─── Condition evaluator ───────────────────────────────────────────────────────

function evaluateSimple<T>(condition: SimpleCondition<T>, values: T): boolean {
  const fieldValue = values[condition.field];
  switch (condition.operator) {
    case "equals":
      return fieldValue === condition.value;
    case "not":
      return fieldValue !== condition.value;
    case "contains":
      return String(fieldValue)
        .toLowerCase()
        .includes(String(condition.value).toLowerCase());
    case "gt":
      return Number(fieldValue) > Number(condition.value);
    case "lt":
      return Number(fieldValue) < Number(condition.value);
    case "is-empty":
      return (
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    case "is-not-empty":
      return !(
        fieldValue === undefined ||
        fieldValue === null ||
        fieldValue === "" ||
        (Array.isArray(fieldValue) && fieldValue.length === 0)
      );
    default:
      return true;
  }
}

function evaluateCondition<T, C>(
  condition: EngineFieldCondition<T, C>,
  values: T,
  context: C,
): boolean {
  if (typeof condition === "function") return condition(values, context);
  if ("conditions" in condition) {
    const compound = condition as CompoundCondition<T>;
    if (compound.operator === "and")
      return compound.conditions.every((c) => evaluateSimple(c, values));
    return compound.conditions.some((c) => evaluateSimple(c, values));
  }
  return evaluateSimple(condition as SimpleCondition<T>, values);
}

// ─── Hook ──────────────────────────────────────────────────────────────────────

export function useFormEngine<
  T extends Record<string, unknown>,
  C extends Record<string, unknown> = Record<string, unknown>,
>({
  config,
  reactive,
  context = {} as C,
  plugins = [],
  schema,
  onSubmit,
}: FormEngineProps<T, C> & {
  schema?: z.ZodType<T>;
  onSubmit?: (values: T) => Promise<void>;
}): FormEngineContextValue<T, C> {
  // ── Initial values ──────────────────────────────────────────────────────────
  const initialValues = useMemo(() => {
    const vals = {} as T;
    config.steps.forEach((step) => {
      step.fields.forEach((field) => {
        vals[field.key] = undefined as unknown as T[keyof T];
      });
    });
    return vals;
  }, [config]);

  // ── react-hook-form ─────────────────────────────────────────────────────────
  const form = useForm<T>({
    defaultValues: initialValues as DefaultValues<T>,
    resolver: schema ? zodResolver(schema as any) : undefined,
    mode: config.validation === "per-step" ? "onBlur" : "onSubmit",
  });

  const values = form.watch();
  const errors = form.formState.errors;
  const isSubmitting = form.formState.isSubmitting;

  // ── Step state ──────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);
  const [fieldOptions, setFieldOptions] = useState<
    Partial<Record<keyof T, { label: string; value: string }[]>>
  >({});

  const allPlugins = useMemo(
    () => [...(config.plugins ?? []), ...plugins],
    [config.plugins, plugins],
  );

  // ── Mount ───────────────────────────────────────────────────────────────────
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      allPlugins.forEach((p) => p.onMount?.(values));
    }
  }, []);

  // ── Field state ─────────────────────────────────────────────────────────────
  const fieldState = useMemo(() => {
    const state = {} as Record<keyof T, FieldState>;
    config.steps.forEach((step) => {
      step.fields.forEach((field) => {
        const engineReactive = reactive?.[field.key];
        const showWhenCondition = engineReactive?.showWhen ?? field.showWhen;

        let visible = true;
        if (showWhenCondition) {
          visible = evaluateCondition(
            showWhenCondition as EngineFieldCondition<T, C>,
            values,
            context,
          );
        }

        state[field.key] = {
          visible,
          disabled: field.disabled ?? false,
          options: fieldOptions[field.key],
        };
      });
    });
    return state;
  }, [values, context, reactive, config, fieldOptions]);

  // ── dependsOn effect ────────────────────────────────────────────────────────
  useEffect(() => {
    config.steps.forEach((step) => {
      step.fields.forEach(async (field) => {
        const engineReactive = reactive?.[field.key];
        const dependency = engineReactive?.dependsOn ?? field.dependsOn;
        if (!dependency) return;

        const watchedValue = dependency.field
          ? values[dependency.field]
          : undefined;

        const result: FieldDependencyResult = await dependency.effect(
          watchedValue,
          values,
          context,
        );

        if (result.options) {
          setFieldOptions((prev) => ({
            ...prev,
            [field.key]: result.options,
          }));
        }
      });
    });
  }, [values, context]);

  // ── setFieldValue ───────────────────────────────────────────────────────────
  const setFieldValue = useCallback(
    (field: keyof T, value: unknown) => {
      form.setValue(field as Path<T>, value as PathValue<T, Path<T>>);
      const next = form.getValues();
      allPlugins.forEach((p) => p.onFieldChange?.(field, value, next));
    },
    [form, allPlugins],
  );

  // ── Navigation ──────────────────────────────────────────────────────────────
  const totalSteps = config.mode === "single" ? 1 : config.steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goNext = useCallback(async () => {
    const step = config.steps[currentStep];
    setIsValidating(true);

    // Per-step validation via react-hook-form
    if (config.validation === "per-step") {
      const stepFieldNames = step.fields.map((f) => f.key as Path<T>);
      const valid = await form.trigger(stepFieldNames);
      if (!valid) {
        setIsValidating(false);
        return;
      }
    }

    // Step guard
    if (step.guard) {
      const passed = await step.guard(values);
      if (!passed) {
        setIsValidating(false);
        return;
      }
    }

    // Plugin validators
    for (const plugin of allPlugins) {
      if (plugin.onValidate) {
        const passed = await plugin.onValidate(currentStep, values);
        if (!passed) {
          setIsValidating(false);
          return;
        }
      }
    }

    setIsValidating(false);

    const resolvedSubmit = onSubmit ?? config.onSubmit;

    if (isLastStep) {
      await form.handleSubmit(async (data) => {
        if (resolvedSubmit) await resolvedSubmit(data);
        for (const plugin of allPlugins) {
          await plugin.onSubmit?.(data);
        }
      })();
    } else {
      setCurrentStep((prev) => {
        const next = prev + 1;
        allPlugins.forEach((p) => p.onStepChange?.(next, values));
        return next;
      });
    }
  }, [currentStep, values, isLastStep, config, allPlugins, form]);

  const goBack = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.max(0, prev - 1);
      allPlugins.forEach((p) => p.onStepChange?.(next, values));
      return next;
    });
  }, [values, allPlugins]);

  const goTo = useCallback(
    (step: number) => {
      setCurrentStep(step);
      allPlugins.forEach((p) => p.onStepChange?.(step, values));
    },
    [values, allPlugins],
  );

  return {
    form,
    values,
    setFieldValue,
    currentStep,
    totalSteps,
    isFirstStep,
    isLastStep,
    goNext,
    goBack,
    goTo,
    fieldState,
    isSubmitting,
    isValidating,
    errors,
    context,
    config,
    reactive,
  };
}

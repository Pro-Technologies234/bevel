"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  useForm,
  type DefaultValues,
  type Path,
  type PathValue,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type {
  FormEngineConfig,
  FormEngineContextValue,
  FormEngineFieldState,
  FormEnginePlugin,
  FormEngineRootProps,
} from "./form-engine-types";

// ─── useFormEngineState ───────────────────────────────────────────────────────

export interface UseFormEngineStateProps extends Pick<
  FormEngineRootProps,
  "config" | "plugins" | "onSubmit" | "defaultValues"
> {
  config: FormEngineConfig;
  plugins?: FormEnginePlugin[];
}

/**
 * useFormEngineState — the core logic hook.
 * Returns everything that goes into FormEngineContext.
 * Internal use only — consumers use useFormEngineContext().
 */
export function useFormEngineState({
  config,
  defaultValues,
  plugins = [],
  onSubmit,
}: UseFormEngineStateProps): FormEngineContextValue {
  // ── Build initial values from step fields ─────────────────────────────────
  const initialValues = useMemo<Record<string, unknown>>(() => {
    const vals: Record<string, unknown> = {};
    config.steps.forEach((step,index) => {
      step.fields.forEach((field) => {
        vals[field.key] = field.defaultValue ?? defaultValues?.[index]?.[field.key];
      });
    });
    return vals;
  }, [config]);

  // ── react-hook-form ───────────────────────────────────────────────────────
  const form = useForm<Record<string, unknown>>({
    defaultValues: initialValues as DefaultValues<Record<string, unknown>>,
    resolver: config.resolver || config.schema ? zodResolver(config.schema as any) : undefined,
    mode: config.validation === "per-step" ? "onTouched" : "onSubmit",
  });

  const values = form.watch();
  const errors = form.formState.errors;
  const isSubmitting = form.formState.isSubmitting;

  // ── Step state ────────────────────────────────────────────────────────────
  const [currentStep, setCurrentStep] = useState(0);
  const [isValidating, setIsValidating] = useState(false);

  const allPlugins = useMemo(
    () => [...(plugins ?? []), ...plugins],
    [plugins, plugins],
  );

  // ── Mount hook ────────────────────────────────────────────────────────────
  const mounted = useRef(false);
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      allPlugins.forEach((p) => p.onMount?.(values));
    }
  }, []); // eslint-disable-line

  // ── Field state — visibility ──────────────────────────────────────────────
  const fieldState = useMemo<Record<string, FormEngineFieldState>>(() => {
    const state: Record<string, FormEngineFieldState> = {};
    config.steps.forEach((step) => {
      step.fields.forEach((field) => {
        const visible = field.showWhen ? field.showWhen(values) : true;
        state[field.key] = {
          visible,
          disabled: field.disabled ?? false,
        };
      });
    });
    return state;
  }, [values, config]);

  // ── setFieldValue ─────────────────────────────────────────────────────────
  const setFieldValue = useCallback(
    (field: string, value: unknown) => {
      form.setValue(
        field as Path<Record<string, unknown>>,
        value as PathValue<
          Record<string, unknown>,
          Path<Record<string, unknown>>
        >,
        { shouldDirty: true, shouldValidate: config.validation === "per-step" },
      );
      const next = form.getValues();
      allPlugins.forEach((p) => p.onFieldChange?.(field, value, next));
    },
    [form, allPlugins, config.validation],
  );

  // ── Navigation helpers ────────────────────────────────────────────────────
  const totalSteps = config.mode === "single" ? 1 : config.steps.length;
  const isFirstStep = currentStep === 0;
  const isLastStep = currentStep === totalSteps - 1;

  const goNext = useCallback(async () => {
    const step = config.steps[currentStep];
    setIsValidating(true);

    try {
      // 1. react-hook-form per-step field validation
      if (config.validation === "per-step") {
        const stepFields = step.fields.map(
          (f) => f.key as Path<Record<string, unknown>>,
        );
        const valid = await form.trigger(stepFields);
        if (!valid) return;
      }

      // 2. Step guard
      if (step.guard) {
        const passed = await step.guard(form.getValues());
        if (!passed) return;
      }

      // 3. Plugin validators (run in sequence — all must pass)
      for (const plugin of allPlugins) {
        if (plugin.onValidate) {
          const passed = await plugin.onValidate(currentStep, form.getValues());
          if (!passed) return;
        }
      }

      // 4. Submit on last step, advance on any other step
      if (isLastStep) {
        await form.handleSubmit(async (data) => {
          await onSubmit(data);
          for (const plugin of allPlugins) {
            await plugin.onSubmit?.(data);
          }
        })();
      } else {
        setCurrentStep((prev) => {
          const next = prev + 1;
          allPlugins.forEach((p) => p.onStepChange?.(next, form.getValues()));
          return next;
        });
      }
    } finally {
      setIsValidating(false);
    }
  }, [currentStep, isLastStep, config, allPlugins, form]);

  const goBack = useCallback(() => {
    setCurrentStep((prev) => {
      const next = Math.max(0, prev - 1);
      allPlugins.forEach((p) => p.onStepChange?.(next, form.getValues()));
      return next;
    });
  }, [allPlugins, form]);

  const goTo = useCallback(
    (step: number) => {
      const clamped = Math.max(0, Math.min(step, totalSteps - 1));
      setCurrentStep(clamped);
      allPlugins.forEach((p) => p.onStepChange?.(clamped, form.getValues()));
    },
    [allPlugins, form, totalSteps],
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
    config,
    plugins: allPlugins,
  };
}

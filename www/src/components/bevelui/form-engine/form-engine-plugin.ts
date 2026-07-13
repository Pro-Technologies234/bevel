import type { ZodSchema } from "zod";
import type { FormEnginePlugin, FormEngineValidateResult } from "./types";

/**
 * createZodPlugin — per-step Zod validation.
 *
 * Pass a map of step index → Zod schema. Field-level error messages from Zod
 * are automatically applied to the form fields — they show up in the UI
 * without any extra wiring.
 *
 * @example
 * const validationPlugin = createZodPlugin({
 *   0: z.object({
 *     name: z.string().min(2, "Name must be at least 2 characters"),
 *     email: z.string().email("Enter a valid email address"),
 *   }),
 *   1: z.object({
 *     plan: z.enum(["free", "pro"], { error: "Please select a plan" }),
 *   }),
 * });
 *
 * <FormEngine config={config} plugins={[validationPlugin]} />
 */
export function createZodPlugin(
  schemas: Record<number, ZodSchema>,
): FormEnginePlugin {
  return {
    name: "zod-validation",
    async onValidate(step, values): Promise<FormEngineValidateResult> {
      const schema = schemas[step];
      if (!schema) return true;

      const result = schema.safeParse(values);
      if (result.success) return true;

      const errors: Record<string, string> = {};
      result.error.issues.forEach((err) => {
        const key = err.path.join(".");
        if (key && !errors[key]) {
          errors[key] = err.message;
        }
      });

      return { success: false, errors };
    },
  };
}

/**
 * createLogPlugin — development lifecycle logger.
 *
 * @example
 * plugins={[createLogPlugin()]}
 */
export function createLogPlugin(prefix = "[FormEngine]"): FormEnginePlugin {
  return {
    name: "logger",
    onMount: (v) => console.log(prefix, "mounted", v),
    onStepChange: (step, v) => console.log(prefix, `step → ${step}`, v),
    onFieldChange: (field, value) => console.log(prefix, `"${field}" →`, value),
    onValidate: async (step) => {
      console.log(prefix, `validating step ${step}`);
      return true;
    },
    onSubmit: async (v) => console.log(prefix, "submitted", v),
  };
}

/**
 * createAnalyticsPlugin — pass your own track function.
 *
 * @example
 * plugins={[
 *   createAnalyticsPlugin((event, data) => mixpanel.track(event, data))
 * ]}
 */
export function createAnalyticsPlugin(
  track: (event: string, data?: Record<string, unknown>) => void,
): FormEnginePlugin {
  return {
    name: "analytics",
    onMount: () => track("form_started"),
    onStepChange: (step) => track("form_step_viewed", { step }),
    onSubmit: async () => track("form_submitted"),
  };
}

/**
 * createServerValidationPlugin — block navigation based on a server check.
 * Return { success: false, errors } to show field-level error messages.
 *
 * @example
 * createServerValidationPlugin(async (step, values) => {
 *   if (step !== 0) return true;
 *   const res = await fetch(`/api/check-email?email=${values.email}`);
 *   const { available } = await res.json();
 *   return available
 *     ? true
 *     : { success: false, errors: { email: "This email is already taken." } };
 * })
 */
export function createServerValidationPlugin(
  validate: (
    step: number,
    values: Record<string, unknown>,
  ) => Promise<boolean | { success: false; errors: Record<string, string> }>,
): FormEnginePlugin {
  return {
    name: "server-validation",
    onValidate: validate,
  };
}

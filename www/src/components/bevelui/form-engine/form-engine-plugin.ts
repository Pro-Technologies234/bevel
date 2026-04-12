import type { ZodSchema } from "zod";
import type { FormEngineConfig, FormEnginePlugin } from "./form-engine-types";
import { toast } from "sonner";

/**
 * Creates a per-step Zod validation plugin.
 *
 * Pass a map of step index → zod schema.
 * The plugin calls schema.safeParse() on the current step's values
 * and blocks navigation if it fails.
 *
 * @example
 * const validationPlugin = createZodPlugin({
 *   0: z.object({ name: z.string().min(2), email: z.string().email() }),
 *   1: z.object({ plan: z.enum(["free", "pro"]) }),
 * });
 *
 * <FormEngine config={config} plugins={[validationPlugin]} />
 */
export function createZodPlugin(
  schemas: Record<number, ZodSchema>,
): FormEnginePlugin {
  return {
    name: "zod-validation",
    async onValidate(step, values) {
      const schema = schemas[step];
      if (!schema) return true;
      const result = schema.safeParse(values);
      return result.success;
    },
  };
}

/**
 * Creates a logging plugin for development.
 * Logs every lifecycle event to the console.
 *
 * @example
 * plugins={[createLogPlugin()]}
 */
export function createLogPlugin(prefix = "[FormEngine]"): FormEnginePlugin {
  return {
    name: "logger",
    onMount: (v) => console.log(prefix, "mounted", v),
    onStepChange: (step, v) => console.log(prefix, `step ${step}`, v),
    onFieldChange: (field, value) =>
      console.log(prefix, `field "${field}" changed`, value),
    onValidate: async (step) => {
      console.log(prefix, `validating step ${step}`);
      return true;
    },
    onSubmit: async (v) => console.log(prefix, "submitted", v),
  };
}

/**
 * Creates an analytics plugin.
 * Pass your own track function.
 *
 * @example
 * plugins={[createAnalyticsPlugin((event, data) => mixpanel.track(event, data))]}
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

import { type ReactNode } from "react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "./form-engine-context";

export interface FormEngineStepProps {
  /**
   * Must match the id in config.steps.
   * Used to determine whether this step is active.
   */
  id: string;
  children: ReactNode;
  className?: string;
}

/**
 * FormEngineStep — renders children only when this step is active.
 *
 * Use inside FormEngineRoot when you want full control of field rendering —
 * bring your own form library, use shadcn inputs directly, whatever you need.
 * The engine handles step flow; you handle the fields.
 *
 * @example — with react-hook-form
 * const form = useForm();
 *
 * const steps: FormEngineStepDef[] = [
 *   { id: "account", title: "Create your account", validate: () => form.trigger(["name", "email"]) },
 *   { id: "plan", title: "Choose a plan" },
 * ];
 *
 * <FormEngineRoot config={{ steps }} onSubmit={form.handleSubmit(onSubmit)}>
 *   <FormEngineProgress />
 *   <FormEngineStepMeta />
 *
 *   <FormEngineStep id="account" className="flex flex-col gap-4">
 *     <Input {...form.register("name")} placeholder="Full name" />
 *     <Input {...form.register("email")} type="email" placeholder="Email" />
 *   </FormEngineStep>
 *
 *   <FormEngineStep id="plan">
 *     <CardSelect
 *       options={planOptions}
 *       value={form.watch("plan")}
 *       onChange={(v) => form.setValue("plan", v)}
 *     />
 *   </FormEngineStep>
 *
 *   <FormEngineNavigation submitLabel="Create account" />
 * </FormEngineRoot>
 *
 * @example — with Formik
 * const formik = useFormik({ ... });
 *
 * const steps = [
 *   { id: "account", validate: () => formik.validateForm().then(e => !Object.keys(e).length) },
 * ];
 */
export function FormEngineStep({
  id,
  children,
  className,
}: FormEngineStepProps) {
  const { currentStep, config } = useFormEngineContext();
  const stepIndex = config.steps.findIndex((s) => s.id === id);
  const isActive = stepIndex !== -1 && stepIndex === currentStep;

  return (
    <AnimatePresence mode="wait" initial={false}>
      {isActive && (
        <motion.div
          key={id}
          initial={{ x: 10, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -10, opacity: 0 }}
          transition={{ duration: 0.16, ease: "easeOut" }}
          className={cn("w-full", className)}
        >
          {children}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

FormEngineStep.displayName = "FormEngineStep";

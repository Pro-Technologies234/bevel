"use client";

import { z, ZodSchema } from "zod";
import pageData from "@/content/docs/form-engine.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  FormEngineRoot,
  FormEngineProgress,
  FormEngineStepMeta,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createLogPlugin,
  type FormEngineConfig,
  type FormEnginePlugin,
} from "@/components/bevelui/form-engine";
import {
  IconCheck,
  IconRocket,
  IconCreditCard,
  IconSparkles,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { FormEngineDemo } from "@/components/demo/form-engine";
import {
  FormEngineBackButton,
  FormEngineNextButton,
} from "../form-engine/form-engine-navigation";
import { TagInput } from "../controls/tag-input";
import { SelectField } from "../controls/select-field";
import { CardSelect } from "../controls/card-select";

// ─── Showcase Demo: Custom Layout with FormEngineRoot ────────────────────────

const showcaseConfig: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "account",
      title: "Create your account",
      description: "Start with your basic information.",
      fields: [
        {
          key: "name",
          variant: "text",
          label: "Full name",
          placeholder: "Alex Johnson",
          required: true,
        },
        {
          key: "email",
          variant: "email",
          label: "Work email",
          placeholder: "alex@company.com",
          required: true,
        },
        {
          key: "password",
          variant: "password",
          label: "Password",
          placeholder: "At least 8 characters",
          required: true,
        },
      ],
    },
    {
      id: "workspace",
      title: "Tell us about your team",
      description: "We'll tailor your experience.",
      fields: [
        {
          key: "workspace",
          variant: "text",
          label: "Company name",
          placeholder: "Acme Inc.",
          required: true,
        },
        {
          key: "teamSize",
          variant: "custom",
          label: "Team size",
          render: ({ value, onChange }) => (
            <SelectField
              value={(value as any) || ""}
              onChange={onChange}
              options={[
                { value: "1", label: "Just me" },
                { value: "2-10", label: "2–10 employees" },
                { value: "11-50", label: "11–50 employees" },
                { value: "51+", label: "51+ employees" },
              ]}
            />
          ),
        },
        {
          key: "plan",
          variant: "custom",
          label: "Choose your plan",
          required: true,
          render: ({ value, onChange }) => (
            <CardSelect
              columns={3}
              layout={"grid"}
              options={[
                {
                  value: "free",
                  label: "Free",
                  description: "For individuals",
                },
                {
                  value: "pro",
                  label: "Pro",
                  description: "$12/seat/mo",
                },
                {
                  value: "enterprise",
                  label: "Enterprise",
                  description: "Custom pricing",
                },
              ]}
            />
          ),
        },
      ],
    },
    {
      id: "invite",
      title: "Invite your teammates",
      description: "Collaborate from day one.",
      fields: [
        {
          key: "invites",
          label: "Email addresses",
          placeholder: "colleague@company.com",
          variant: "custom",
          render: ({ value, onChange }) => (
            <TagInput
              value={(value as string[]) || []}
              onChange={onChange}
              placeholder="Enter email addresses..."
              validate={(val: string) => {
                const valid = /.+@.+\..+/.test(val);
                if (!valid) toast.error("Input a valid Email address");
                return valid;
              }}
              variant={"default"}
              size={"sm"}
              tagClassName={"bg-cyan-700  text-white border-none"}
            />
          ),
        },
      ],
    },
  ],
};

const showcaseSchemas = {
  0: z.object({
    name: z.string().min(2, "Name is required"),
    email: z.email("Invalid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  1: z.object({
    workspace: z.string().min(1, "Company name is required"),
    plan: z.enum(["free", "pro", "enterprise"], {
      error: "Please select a plan",
    }),
  }),
  3: z.object({
    invites: z.array(z.string()),
  }),
};

export function createZodValidatePlugin(
  schemas: Record<number, ZodSchema>,
): FormEnginePlugin {
  return {
    name: "zod-validation",
    async onValidate(step, values) {
      const schema = schemas[step];
      if (!schema) return true;
      const result = schema.safeParse(values);
      if (result.error) {
        const msg = result.error.issues[0].message || "Error";
        toast.error(msg);
      }
      return result.success;
    },
  };
}

export function FormEngineShowcase() {
  const [submitted, setSubmitted] = useState(false);

  const plugins: FormEnginePlugin[] = [
    createZodValidatePlugin(showcaseSchemas),
    createLogPlugin("[showcase]"),
  ];

  const handleSubmit = async (values: unknown) => {
    await new Promise((r) => setTimeout(r, 1500));
    console.log("Showcase submitted:", values);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-4xl mx-auto">
        <div className="rounded-2xl border border-border bg-popover/60 shadow-xl py-22 px-4 md:p-16 text-center">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-gradient-to-br from-pink-500/20 to-pink-500/5 flex items-center justify-center mb-6">
            <IconSparkles
              size={32}
              strokeWidth={1.8}
              className="text-pink-500"
            />
          </div>
          <h2 className="text-2xl font-semibold mb-2 font-sans">
            You're all set!
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xs mx-auto">
            Your workspace is ready. We've sent a confirmation to your email.
          </p>
          <div className="flex gap-3 justify-center">
            <Button className=" rounded-full text-xs p-4">
              Go to dashboard
            </Button>
            <Button
              className=" rounded-full text-xs p-4"
              onClick={() => setSubmitted(false)}
              variant={"outline"}
            >
              <IconPlayerPlay />
              Start over
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-5xl mx-auto">
      <FormEngineRoot
        config={showcaseConfig}
        plugins={plugins}
        defaultValues={{
          0: {
            name: "",
            email: "",
            password: "",
          },
          1: {
            workspace: "",
            plan: "pro",
          },
          2: {
            invites: ["bevelui@gmail.com"],
          },
        }}
        onSubmit={handleSubmit}
      >
        <div className="rounded-2xl border border-border bg-popover/60 shadow-lg overflow-hidden">
          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Left sidebar – progress and step meta */}
            <div className="bg-muted/5 border-r border-border p-6 flex flex-col">
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <IconRocket
                    size={22}
                    strokeWidth={1.8}
                    className="text-primary"
                  />
                  <span className="font-semibold text-lg tracking-tight">
                    Bevel
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">
                  Join thousands of teams building better products.
                </p>
              </div>

              <div className="flex-1 not-md:hidden">
                <FormEngineProgress
                  className="space-y-0 flex-col items-start"
                  renderStep={(step, state) => {
                    const isActive = state == "active";
                    const isCompleted = state == "completed";
                    const meta = showcaseConfig.steps[step];
                    return (
                      <div className="flex items-start gap-3 py-2">
                        <div
                          className={cn(
                            "w-6 h-6 rounded-full flex items-center justify-center text-xs font-medium shrink-0 transition-colors",
                            isCompleted
                              ? "bg-primary text-primary-foreground"
                              : isActive
                                ? "bg-primary/20 text-primary border-2 border-primary"
                                : "bg-muted text-muted-foreground",
                          )}
                        >
                          {isCompleted ? <IconCheck size={12} /> : step + 1}
                        </div>
                        <div>
                          <p className="text-sm font-medium">{meta.title}</p>
                          {meta.description && (
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {meta.description}
                            </p>
                          )}
                        </div>
                      </div>
                    );
                  }}
                />
              </div>
              <div className="flex-1 md:hidden">
                <FormEngineProgress variant="circle" />
              </div>

              <div className="pt-6 mt-6 border-t border-border/60">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <IconCreditCard size={14} />
                  <span>Secure • No credit card required</span>
                </div>
              </div>
            </div>

            {/* Right content – fields and navigation */}
            <div className="md:col-span-2 p-6 flex flex-col min-h-[500px]">
              <div className="mb-6">
                <FormEngineStepMeta />
              </div>

              <div className="flex-1">
                <FormEngineStepCanvas />
              </div>

              <div className="pt-4 mt-6 border-t border-border/60">
                <FormEngineNavigation layout="split">
                  <FormEngineBackButton label="Back" className="rounded-full" />
                  <FormEngineNextButton
                    nextLabel="Continue"
                    submitLabel="Complete setup"
                    className="ml-auto rounded-full"
                  />
                </FormEngineNavigation>
              </div>
            </div>
          </div>
        </div>
      </FormEngineRoot>
    </div>
  );
}

export function FormEngineContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{
        FormEngineDemo,
        FormEngineShowcase,
      }}
    />
  );
}

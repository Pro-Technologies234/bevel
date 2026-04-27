"use client";

import { z, ZodSchema } from "zod";
import pageData from "@/content/docs/form-engine.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  FormEngine,
  FormEngineRoot,
  FormEngineProgress,
  FormEngineStepMeta,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createZodPlugin,
  createLogPlugin,
  type FormEngineConfig,
  type FormEnginePlugin,
} from "@/components/bevelui/form-engine";
import {
  IconCheck,
  IconRocket,
  IconUser,
  IconBuilding,
  IconCreditCard,
  IconSparkles,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { useState } from "react";
import { docsFormEngineMetadata } from "@/lib/metadata";
export const metadata = docsFormEngineMetadata;
// ─── Original Demo (kept for docs) ───────────────────────────────────────────

const stepSchemas = {
  0: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  1: z.object({
    workspace: z.string().min(2, "Workspace name is required"),
    plan: z.enum(["free", "pro", "enterprise"], {
      error: "Please select a plan",
    }),
  }),
};

const config: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "account",
      title: "Create your account",
      description: "Your login credentials.",
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
          label: "Email address",
          placeholder: "alex@acme.com",
          required: true,
        },
        {
          key: "password",
          variant: "password",
          label: "Password",
          placeholder: "8+ characters",
          required: true,
        },
      ],
    },
    {
      id: "workspace",
      title: "Set up your workspace",
      description: "Where your team will work.",
      fields: [
        {
          key: "workspace",
          variant: "text",
          label: "Workspace name",
          placeholder: "Acme Inc.",
          required: true,
        },
        {
          key: "plan",
          variant: "card-select",
          label: "Choose a plan",
          required: true,
          props: {
            columns: 2,
            size: "sm",
            layout: "grid",
            options: [
              { value: "free", label: "Free", description: "$0/mo" },
              {
                value: "pro",
                label: "Pro",
                description: "$12/mo",
                badge: "Popular",
              },
              {
                value: "enterprise",
                label: "Enterprise",
                description: "Custom",
              },
            ],
          },
        },
        {
          key: "role",
          variant: "chip-select",
          label: "Your role",
          props: {
            options: [
              { value: "engineering", label: "Engineering" },
              { value: "design", label: "Design" },
              { value: "product", label: "Product" },
              { value: "marketing", label: "Marketing" },
              { value: "other", label: "Other" },
            ],
          },
        },
      ],
    },
    {
      id: "billing",
      title: "Add billing details",
      description: "Optional — you can do this later from settings.",
      fields: [
        {
          key: "cardName",
          variant: "text",
          label: "Name on card",
          placeholder: "Alex Johnson",
        },
        {
          key: "cardNumber",
          variant: "text",
          label: "Card number",
          placeholder: "1234 5678 9012 3456",
        },
      ],
    },
  ],
};

export function FormEngineDemo() {
  const [submitted, setSubmitted] = useState(false);

  const plugins: FormEnginePlugin[] = [
    createZodPlugin(stepSchemas),
    createLogPlugin("[demo]"),
  ];

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
          <IconCheck size={24} strokeWidth={2.5} className="text-primary" />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-base font-semibold">Account created!</span>
          <span className="text-sm text-muted-foreground">
            This is what your onSubmit receives.
          </span>
        </div>
        <button
          onClick={() => setSubmitted(false)}
          className="text-xs text-muted-foreground underline hover:text-foreground transition-colors"
        >
          Reset demo
        </button>
      </div>
    );
  }

  return (
    <Card className="w-full max-w-md min-h-[70vh] max-h-[70vh] h-full flex flex-col items-center w-full">
      <CardContent className="flex-1 flex flex-col w-full">
        <FormEngineRoot
          onSubmit={async (values: unknown) => {
            await new Promise((r) => setTimeout(r, 1200));
            console.log("Form submitted:", values);
            setSubmitted(true);
          }}
          config={config}
          plugins={plugins}
          // actionsProps={{
          //   submitLabel: "Create account",
          //   nextLabel: "Continue",
          //   layout: "split",
          // }}

          className="flex flex-col items-center justify-between h-full flex-1 w-full"
        >
          <FormEngineStepMeta />
          <FormEngineStepCanvas className="w-full" />
          <FormEngineNavigation nextBtnClassName="rounded-full px-4 py-4!" />
        </FormEngineRoot>
      </CardContent>
    </Card>
  );
}

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
          variant: "select",
          label: "Team size",
          props: {
            options: [
              { value: "1", label: "Just me" },
              { value: "2-10", label: "2–10 employees" },
              { value: "11-50", label: "11–50 employees" },
              { value: "51+", label: "51+ employees" },
            ],
          },
        },
        {
          key: "plan",
          variant: "card-select",
          label: "Choose your plan",
          required: true,
          props: {
            columns: 3,
            options: [
              {
                value: "free",
                label: "Free",
                description: "For individuals",
                preview: "/images/tour-1.png",
              },
              {
                value: "pro",
                label: "Pro",
                description: "$12/seat/mo",
                badge: "Most popular",
                preview: "/images/car.webp",
              },
              {
                value: "enterprise",
                label: "Enterprise",
                description: "Custom pricing",
                preview: (
                  <video
                    className="w-full h-full object-cover"
                    src={"/videos/tour-1.webm"}
                  />
                ),
              },
            ],
          },
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
          variant: "tag-input",
          label: "Email addresses",
          placeholder: "colleague@company.com",
          props: {
            validate: (val: string) => {
              const valid = /.+@.+\..+/.test(val);
              if (!valid) toast.error("Input a valid Email address");
              return valid;
            },
            variant: "default",
            size: "sm",
            tagClassName: "bg-cyan-700  text-white border-none",
          },
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
        <div className="rounded-2xl border border-border bg-popover/60 shadow-2xl overflow-hidden">
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

              <div className="flex-1">
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
                <FormEngineNavigation
                  submitLabel="Complete setup"
                  nextLabel="Continue"
                  backLabel="Back"
                  className="flex justify-between items-center"
                  backBtnClassName={"p-4 rounded-md"}
                  nextBtnClassName={"p-4 rounded-md"}
                />
              </div>
            </div>
          </div>
        </div>
      </FormEngineRoot>
    </div>
  );
}

// Missing import for cn
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function FormEnginePage() {
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

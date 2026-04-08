"use client";

import { z } from "zod";
import pageData from "@/content/docs/form-engine.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  FormEngine,
  createZodPlugin,
  createLogPlugin,
  type FormEngineConfig,
  type FormEnginePlugin,
} from "@/components/bevelui/form-engine";
import { IconCheck } from "@tabler/icons-react";
import { useState } from "react";

// ─── Zod schemas — one per step ───────────────────────────────────────────────

const stepSchemas = {
  0: z.object({
    name: z.string().min(2, "Name must be at least 2 characters"),
    email: z.string().email("Enter a valid email address"),
    password: z.string().min(8, "Password must be at least 8 characters"),
  }),
  1: z.object({
    workspace: z.string().min(2, "Workspace name is required"),
    plan: z.enum(["free", "pro", "enterprise"], {
      required_error: "Please select a plan",
    }),
  }),
  // Step 2 (billing) is optional — no schema
};

// ─── Config ───────────────────────────────────────────────────────────────────

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
            columns: 3,
            size: "sm",
            options: [
              {
                value: "free",
                label: "Free",
                description: "$0/mo",
              },
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
  onSubmit: async (values) => {
    // Simulate an API call
    await new Promise((r) => setTimeout(r, 1200));
    console.log("Form submitted:", values);
  },
};

// ─── Demo ─────────────────────────────────────────────────────────────────────

function FormEngineDemo() {
  const [submitted, setSubmitted] = useState(false);

  const submittedConfig: FormEngineConfig = {
    ...config,
    onSubmit: async (values) => {
      await new Promise((r) => setTimeout(r, 1200));
      setSubmitted(true);
    },
  };

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
    <div className="w-full max-w-md">
      <FormEngine
        config={submittedConfig}
        plugins={plugins}
        actionsProps={{
          submitLabel: "Create account",
          nextLabel: "Continue",
          layout: "split",
        }}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FormEnginePage() {
  return (
    <DocPageRenderer page={pageData as any} demoRegistry={{ FormEngineDemo }} />
  );
}

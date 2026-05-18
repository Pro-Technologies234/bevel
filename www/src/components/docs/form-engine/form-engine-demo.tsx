import {
  FormEngine,
  createZodPlugin,
  createLogPlugin,
  type FormEnginePlugin,
  FormEngineConfig,
} from "@/components/bevelui/form-engine";
import { IconDiscountCheck } from "@tabler/icons-react";
import { useState } from "react";
import z from "zod";
import { Button } from "@/components/ui/button";
import { CardSelect } from "@/components/bevelui/controls/card-select";
import { ChipSelect } from "@/components/bevelui/controls/chip-select";

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
          variant: "custom",
          label: "Choose a plan",
          required: true,
          render: ({ value, onChange, disabled }) => (
            <CardSelect
              className="border"
              onChange={onChange}
              data-selected={value === "pro"}
              data-disabled={disabled}
              columns={2}
              layout="grid"
              options={[
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
              ]}
            />
          ),
        },
        {
          key: "role",
          variant: "custom",
          label: "Your role",
          render: ({ value, onChange, disabled }) => (
            <ChipSelect
              defaultValue={value as string}
              options={[
                { value: "engineering", label: "Engineering" },
                { value: "design", label: "Design" },
                { value: "product", label: "Product" },
                { value: "marketing", label: "Marketing" },
                { value: "other", label: "Other" },
              ]}
            />
          ),
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

export function FormEngineDemo() {
  const [submitted, setSubmitted] = useState(false);

  const plugins: FormEnginePlugin[] = [
    createZodPlugin(stepSchemas),
    createLogPlugin("[demo]"),
  ];

  if (submitted) {
    return (
      <div className="flex flex-col items-center gap-4 py-12 text-center">
        <div className="animate-bounce p-2 rounded-full bg-primary/10 flex items-center justify-center">
          <IconDiscountCheck size={54} className="text-primary " />
        </div>
        <div className="flex flex-col gap-1">
          <span className="text-xl font-semibold">Account created!</span>
          <span className="text-sm text-muted-foreground">
            This is what your onSubmit receives.
          </span>
        </div>
        <Button onClick={() => setSubmitted(false)}>Reset demo</Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-sm mx-auto">
      <FormEngine
        onSubmit={async (values: unknown) => {
          await new Promise((r) => setTimeout(r, 1200));
          console.log("Form submitted:", values);
          setSubmitted(true);
        }}
        config={config}
        plugins={plugins}
        stepMetaProps={{
          className: " text-center",
        }}
        navigationProps={{
          layout: "split",
        }}
      />
    </div>
  );
}

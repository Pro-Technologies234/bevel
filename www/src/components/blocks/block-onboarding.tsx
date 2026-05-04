"use client";

/**
 * Block: SaaS Multi-step Onboarding
 * Systems used: Form Engine (config-driven) + Controls (CardSelect, ChipSelect, TagInput)
 * Scenario: A SaaS app's post-signup onboarding flow that collects
 * role, preferences, and team details before showing the dashboard.
 *
 * Drop into: app/blocks/onboarding/page.tsx
 */

import { useState } from "react";
import { z } from "zod";
import {
  FormEngineRoot,
  FormEngineProgress,
  FormEngineStepMeta,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createZodPlugin,
  type FormEngineConfig,
} from "@/components/bevelui/form-engine";
import {
  IconBriefcase,
  IconCode,
  IconPalette,
  IconChartBar,
  IconShoppingCart,
  IconBuildingSkyscraper,
  IconRocket,
  IconSparkles,
} from "@tabler/icons-react";

// ─── Options ──────────────────────────────────────────────────────────────────

const ROLES = [
  {
    value: "engineer",
    label: "Engineer",
    description: "I build products",
    icon: <IconCode size={18} />,
  },
  {
    value: "designer",
    label: "Designer",
    description: "I craft the experience",
    icon: <IconPalette size={18} />,
  },
  {
    value: "pm",
    label: "Product Manager",
    description: "I define what we build",
    icon: <IconBriefcase size={18} />,
  },
  {
    value: "analyst",
    label: "Analyst",
    description: "I measure what matters",
    icon: <IconChartBar size={18} />,
  },
  {
    value: "marketer",
    label: "Marketer",
    description: "I grow the product",
    icon: <IconShoppingCart size={18} />,
  },
  {
    value: "founder",
    label: "Founder",
    description: "I do everything",
    icon: <IconBuildingSkyscraper size={18} />,
  },
];

const GOALS = [
  { value: "ship-faster", label: "Ship features faster" },
  { value: "reduce-bugs", label: "Reduce bugs in production" },
  { value: "improve-ux", label: "Improve user experience" },
  { value: "grow-team", label: "Scale my team" },
  { value: "analytics", label: "Better analytics" },
  { value: "collaboration", label: "Improve collaboration" },
  { value: "automate", label: "Automate workflows" },
  { value: "revenue", label: "Increase revenue" },
];

// ─── Per‑step Zod schemas ─────────────────────────────────────────────────────
const stepSchemas = {
  0: z.object({
    role: z.string().min(1, "Please select your role"),
  }),
  1: z.object({
    goals: z.array(z.string()).min(1, "Select at least one goal"),
  }),
  2: z.object({
    teamName: z.string().min(2, "Team name must be at least 2 characters"),
    teammates: z.array(z.string()).optional(),
  }),
};

// ─── Form Engine configuration ────────────────────────────────────────────────
const ONBOARDING_CONFIG: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "role",
      title: "What's your role?",
      description: "Help us personalise your experience.",
      fields: [
        {
          key: "role",
          variant: "card-select",
          label: "Your role",
          required: true,
          props: {
            options: ROLES,
            layout: "grid",
            columns: 3,
          },
        },
      ],
    },
    {
      id: "goals",
      title: "What are your main goals?",
      description: "Pick everything that applies — we'll tailor your setup.",
      fields: [
        {
          key: "goals",
          variant: "chip-select",
          label: "Your goals",
          required: true,
          props: {
            options: GOALS,
            multiple: true,
          },
        },
      ],
    },
    {
      id: "team",
      title: "Set up your workspace",
      description: "Name your team and invite people to join.",
      fields: [
        {
          key: "teamName",
          variant: "text",
          label: "Team name",
          placeholder: "e.g. Acme, Design Team, Startup Inc.",
          required: true,
        },
        {
          key: "teammates",
          variant: "tag-input",
          label: "Invite teammates",
          props: {
            placeholder: "name@company.com — press Enter to add",
            validate: (tag: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(tag),
            // invalidMessage: "Enter a valid email address",
          },
        },
      ],
    },
  ],
};

// ─── Component ────────────────────────────────────────────────────────────────

export default function OnboardingBlock() {
  const [done, setDone] = useState(false);
  const [teamName, setTeamName] = useState("");

  const handleSubmit = async (values: Record<string, unknown>) => {
    // The engine already validated everything – we can proceed.
    setTeamName((values.teamName as string) || "your team");
    console.log("Onboarding complete:", values);
    setDone(true);
  };

  if (done) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center space-y-4 max-w-sm">
          <div className="size-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto">
            <IconSparkles size={28} className="text-primary" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight">
            You're all set, {teamName}!
          </h1>
          <p className="text-sm text-muted-foreground">
            Your workspace is ready. We've personalised everything based on your
            role and goals.
          </p>
          <button
            onClick={() => setDone(false)}
            className="text-xs text-muted-foreground underline underline-offset-4"
          >
            Reset demo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left panel — branding */}
      <div className="hidden lg:flex w-96 bg-card border-r border-border flex-col p-10 shrink-0">
        <div className="flex items-center gap-2 mb-auto">
          <div className="size-7 rounded-md bg-primary" />
          <span className="font-semibold text-sm">Acme</span>
        </div>

        <div className="space-y-6 mb-auto">
          <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium">
            <IconRocket size={13} />
            Quick setup · 3 steps
          </div>
          <h1 className="text-3xl font-semibold tracking-tight leading-tight">
            Welcome aboard.
            <br />
            Let's get you set up.
          </h1>
          <p className="text-sm text-muted-foreground leading-relaxed">
            It only takes a couple of minutes. Tell us a bit about yourself and
            your team and we'll have your workspace ready to go.
          </p>

          <div className="space-y-3 pt-4">
            {[
              "Personalised dashboard",
              "Team invitations sent automatically",
              "Start shipping in minutes",
            ].map((item) => (
              <div
                key={item}
                className="flex items-center gap-2.5 text-sm text-muted-foreground"
              >
                <div className="size-4 rounded-full bg-primary/20 flex items-center justify-center shrink-0">
                  <div className="size-1.5 rounded-full bg-primary" />
                </div>
                {item}
              </div>
            ))}
          </div>
        </div>

        <p className="text-xs text-muted-foreground">
          Trusted by 10,000+ teams worldwide
        </p>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-lg">
          <FormEngineRoot
            config={ONBOARDING_CONFIG}
            plugins={[createZodPlugin(stepSchemas)]}
            onSubmit={handleSubmit}
          >
            <div className="mb-8">
              <FormEngineProgress />
            </div>
            <FormEngineStepMeta />
            <div className="mt-6">
              <FormEngineStepCanvas />
            </div>
            <div className="mt-8">
              <FormEngineNavigation
              // submitLabel="Finish setup"
              // nextLabel="Continue"
              // backLabel="Back"
              />
            </div>
          </FormEngineRoot>
        </div>
      </div>
    </div>
  );
}

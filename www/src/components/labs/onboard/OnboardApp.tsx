"use client";

import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import {
  FormEngine,
  FormEngineNavigation,
  FormEngineRoot,
  FormEngineStepCanvas,
  createZodPlugin,
} from "@/components/bevelui/form-engine";
import {
  TourRoot,
  TourAnchor,
  TourTrigger,
  useTour,
} from "@/components/bevelui/tour";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconBoltFilled,
  IconCheck,
  IconLayoutDashboard,
  IconUsers,
  IconChartBar,
  IconSettings,
  IconBell,
  IconTrendingUp,
  IconArrowRight,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { FormEngineConfig } from "@/components/bevelui/form-engine";
import { BevelIcon, BrandMark } from "@/components/shared/brand-mark";
import {
  OnboardingFormHeader,
  OnboardingFormMeta,
} from "./onbording-form-blocks";
import { OnboardingDashboard } from "./onboarding-dashbord";

// ─── Schemas ──────────────────────────────────────────────────────────────────

const schemas = {
  0: z.object({
    firstName: z.string().min(2, "At least 2 characters"),
    lastName: z.string().min(2, "At least 2 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "At least 8 characters"),
  }),
  1: z.object({
    company: z.string().min(2, "Company name is required"),
    role: z.enum(["engineering", "design", "product", "founder", "other"], {
      error: "Select your role",
    }),
    teamSize: z.enum(["solo", "2-5", "6-20", "20+"], {
      error: "Select team size",
    }),
  }),
  2: z.object({
    plan: z.enum(["free", "pro", "team"], {
      error: "Select a plan",
    }),
  }),
};

// ─── Form config ──────────────────────────────────────────────────────────────

const config: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "account",
      title: "Create your account",
      description: "Start with your personal details.",
      fields: [
        {
          key: "firstName",
          variant: "text",
          label: "First name",
          placeholder: "Alex",
          required: true,
        },
        {
          key: "lastName",
          variant: "text",
          label: "Last name",
          placeholder: "Johnson",
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
          placeholder: "8+ characters",
          required: true,
        },
      ],
    },
    {
      id: "workspace",
      title: "Set up your workspace",
      description: "Tell us about your team.",
      fields: [
        {
          key: "company",
          variant: "text",
          label: "Company or project name",
          placeholder: "Acme Inc.",
          required: true,
        },
        {
          key: "role",
          variant: "chip-select",
          label: "Your role",
          required: true,
          props: {
            activeClassName: "bg-rose-400 text-white",
            options: [
              { value: "engineering", label: "Engineering" },
              { value: "design", label: "Design" },
              { value: "product", label: "Product" },
              { value: "founder", label: "Founder" },
              { value: "other", label: "Other" },
            ],
          },
        },
        {
          key: "teamSize",
          variant: "chip-select",
          label: "Team size",
          required: true,
          props: {
            activeClassName: "bg-pink-600 text-white",
            options: [
              { value: "solo", label: "Just me" },
              { value: "2-5", label: "2–5" },
              { value: "6-20", label: "6–20" },
              { value: "20+", label: "20+" },
            ],
          },
        },
      ],
    },
    {
      id: "plan",
      title: "Choose your plan",
      description: "Start free. Upgrade when you're ready.",
      fields: [
        {
          key: "plan",
          variant: "card-select",
          label: "Plan",
          required: true,
          props: {
            layout: "grid",
            columns: 2,
            options: [
              {
                value: "free",
                label: "Free",
                description: "4 systems, forever",
              },
              {
                value: "pro",
                label: "Pro",
                description: "$49 one-time",
                badge: "Popular",
              },
              {
                value: "team",
                label: "Team",
                description: "$199/year",
              },
            ],
          },
        },
      ],
    },
  ],
};

// ─── Main Onboard app ─────────────────────────────────────────────────────────

export default function OnboardApp() {
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const submittingConfig: FormEngineConfig = {
    ...config,
  };

  return (
    <div className="h-screen flex flex-col w-full overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      <div className=" fixed bottom-0 md:gap-24 translate-y-80 inset-x-0 flex justify-between">
        <div className=" size-120 flex-1 rounded-full blur-[8rem] bg-rose-500/20 -translate-x-50" />
        <div className=" size-120 flex-1 rounded-full blur-[8rem] bg-rose-500/20 translate-x-50" />
      </div>
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex flex-col w-full items-center justify-center"
          >
            <FormEngineRoot
              config={submittingConfig}
              plugins={[createZodPlugin(schemas)]}
              onSubmit={async (values) => {
                await new Promise((r) => setTimeout(r, 800));
                setFormValues(values as Record<string, string>);
                setSubmitted(true);
              }}
              className="flex-1"
            >
              <OnboardingFormHeader />
              <OnboardingFormMeta />
              <div className="w-full max-w-lg mx-auto bg-background rounded-2xl p-6">
                <FormEngineStepCanvas />
                <FormEngineNavigation
                  submitLabel="Create account"
                  nextLabel="Continue"
                  styles={{
                    container: "mt-6",
                    nextBtn:
                      " rounded-md h-10 rounded-full bg-rose-500 hover:bg-rose-500/90 text-white hover:text-white cursor-pointer",
                  }}
                />
              </div>
            </FormEngineRoot>

            <p className="text-center text-[11px] text-muted-foreground mt-4 flex-1">
              Already have an account?{" "}
              <button className="underline hover:text-foreground">
                Sign in
              </button>
            </p>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Success bar */}
            <div className="flex items-center gap-2 px-6 py-3 bg-green-400/5 border-b border-green-400/20">
              <div className="w-5 h-5 rounded-full bg-green-400/20 flex items-center justify-center">
                <IconCheck
                  size={12}
                  strokeWidth={2.5}
                  className="text-green-500"
                />
              </div>
              <span className="text-sm font-medium text-green-400">
                Account created! Here's your workspace — the tour will guide you
                through it.
              </span>
              <Button
                variant="outline"
                size="sm"
                className="ml-auto  text-green-500 hover:text-green-500 rounded-full cursor-pointer"
                onClick={() => setSubmitted(false)}
              >
                <IconArrowRight size={12} className="rotate-180" /> Reset demo
              </Button>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <OnboardingDashboard
                name={`${formValues.firstName ?? ""} ${formValues.lastName ?? ""}`}
                company={formValues.company ?? ""}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

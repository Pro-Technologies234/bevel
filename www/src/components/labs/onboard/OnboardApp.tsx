"use client";

import { useState } from "react";
import { z } from "zod";
import { motion, AnimatePresence } from "motion/react";
import { FormEngine, createZodPlugin } from "@/components/bevelui/form-engine";
import { TourRoot, TourAnchor, TourTrigger, useTour } from "@/components/bevelui/tour";
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
      required_error: "Select your role",
    }),
    teamSize: z.enum(["solo", "2-5", "6-20", "20+"], {
      required_error: "Select team size",
    }),
  }),
  2: z.object({
    plan: z.enum(["free", "pro", "team"], {
      required_error: "Select a plan",
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
            columns: 3,
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
  onSubmit: async (values) => {
    await new Promise((r) => setTimeout(r, 800));
  },
};

// ─── Result dashboard (what the user sees after signup) ───────────────────────

const TOUR_STEPS = [
  {
    step: 1,
    title: "Welcome to your workspace",
    description: "Everything you need is here. Let us show you around — it'll take 30 seconds.",
    side: "bottom" as const,
  },
  {
    step: 2,
    title: "Your navigation",
    description: "Switch between Dashboard, Users, Analytics, and Settings from here.",
    side: "right" as const,
  },
  {
    step: 3,
    title: "Key metrics",
    description: "Your most important numbers at a glance. Click any card to drill in.",
    side: "bottom" as const,
  },
  {
    step: 4,
    title: "Notifications",
    description: "New signups, alerts, and activity appear here.",
    side: "bottom" as const,
  },
];

function ResultDashboard({ name, company }: { name: string; company: string }) {
  return (
    <TourRoot steps={TOUR_STEPS} defaultOpen>
      <div className="flex h-full rounded-xl overflow-hidden border border-border bg-background">
        {/* Sidebar */}
        <TourAnchor step={2} asChild>
          <aside className="w-44 shrink-0 border-r border-border bg-muted/10 flex flex-col py-4 px-3 gap-1">
            <TourAnchor step={1} asChild>
              <div className="px-2 pb-4 mb-1 border-b border-border/60">
                <div className="flex items-center gap-2 mb-1">
                  <div className="w-5 h-5 rounded bg-primary/20 flex items-center justify-center">
                    <IconBoltFilled size={10} className="text-primary" />
                  </div>
                  <span className="text-xs font-bold truncate">{company || "My Workspace"}</span>
                </div>
                <span className="text-[10px] text-muted-foreground">Free plan</span>
              </div>
            </TourAnchor>

            {[
              { icon: IconLayoutDashboard, label: "Dashboard", active: true },
              { icon: IconUsers, label: "Users", active: false },
              { icon: IconChartBar, label: "Analytics", active: false },
              { icon: IconSettings, label: "Settings", active: false },
            ].map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center gap-2 px-2 py-1.5 rounded-md text-xs font-medium transition-colors text-left w-full",
                  item.active
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                )}
              >
                <item.icon size={13} strokeWidth={1.8} />
                {item.label}
              </button>
            ))}
          </aside>
        </TourAnchor>

        {/* Main */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-border/60">
            <div>
              <h2 className="text-sm font-semibold">Dashboard</h2>
              <p className="text-[11px] text-muted-foreground">
                Welcome, {name || "there"} 👋
              </p>
            </div>
            <TourAnchor step={4}>
              <button className="relative w-8 h-8 rounded-lg border border-border flex items-center justify-center hover:bg-muted/50 transition-colors">
                <IconBell size={14} strokeWidth={1.8} />
                <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-primary" />
              </button>
            </TourAnchor>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto p-4 flex flex-col gap-4">
            <TourAnchor step={3}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {[
                  { label: "Total users", value: "0", delta: "—" },
                  { label: "Active today", value: "0", delta: "—" },
                  { label: "Revenue", value: "$0", delta: "—" },
                  { label: "Conversion", value: "0%", delta: "—" },
                ].map((m) => (
                  <div
                    key={m.label}
                    className="p-3 rounded-xl border border-border/60 bg-muted/10"
                  >
                    <p className="text-[10px] text-muted-foreground mb-1">{m.label}</p>
                    <p className="text-lg font-bold">{m.value}</p>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-0.5 mt-0.5">
                      <IconTrendingUp size={9} /> {m.delta}
                    </p>
                  </div>
                ))}
              </div>
            </TourAnchor>

            {/* Empty state */}
            <div className="flex-1 rounded-xl border border-dashed border-border/60 bg-muted/5 flex flex-col items-center justify-center gap-3 p-8 text-center">
              <IconChartBar size={24} strokeWidth={1.2} className="text-muted-foreground/50" />
              <p className="text-sm text-muted-foreground">
                No data yet. Start inviting users to see activity here.
              </p>
              <Button size="sm" variant="outline" className="gap-1.5">
                <IconUsers size={12} />
                Invite team members
              </Button>
            </div>
          </div>
        </div>
      </div>
    </TourRoot>
  );
}

// ─── Main Onboard app ─────────────────────────────────────────────────────────

export default function OnboardApp() {
  const [submitted, setSubmitted] = useState(false);
  const [formValues, setFormValues] = useState<Record<string, string>>({});

  const submittingConfig: FormEngineConfig = {
    ...config,
    onSubmit: async (values) => {
      await new Promise((r) => setTimeout(r, 800));
      setFormValues(values as Record<string, string>);
      setSubmitted(true);
    },
  };

  return (
    <div className="h-full flex flex-col">
      <AnimatePresence mode="wait">
        {!submitted ? (
          <motion.div
            key="form"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex-1 flex items-center justify-center p-6"
          >
            <div className="w-full max-w-md">
              {/* Logo */}
              <div className="flex items-center gap-2 justify-center mb-8">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <IconBoltFilled size={16} color="#0a0a0a" />
                </div>
                <span className="text-lg font-bold">Bevel UI</span>
              </div>

              <FormEngine
                config={submittingConfig}
                plugins={[createZodPlugin(schemas)]}
                actionsProps={{ submitLabel: "Create account", nextLabel: "Continue →" }}
              />

              <p className="text-center text-[11px] text-muted-foreground mt-4">
                Already have an account?{" "}
                <button className="underline hover:text-foreground">Sign in</button>
              </p>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="result"
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex-1 flex flex-col"
          >
            {/* Success bar */}
            <div className="flex items-center gap-2 px-6 py-3 bg-primary/5 border-b border-primary/20">
              <div className="w-5 h-5 rounded-full bg-primary/20 flex items-center justify-center">
                <IconCheck size={12} strokeWidth={2.5} className="text-primary" />
              </div>
              <span className="text-sm font-medium text-primary">
                Account created! Here's your workspace — the tour will guide you through it.
              </span>
              <Button
                variant="ghost"
                size="sm"
                className="ml-auto text-xs gap-1 text-primary hover:text-primary"
                onClick={() => setSubmitted(false)}
              >
                <IconArrowRight size={12} className="rotate-180" /> Reset demo
              </Button>
            </div>

            <div className="flex-1 p-4 overflow-hidden">
              <ResultDashboard
                name={formValues.firstName ?? ""}
                company={formValues.company ?? ""}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

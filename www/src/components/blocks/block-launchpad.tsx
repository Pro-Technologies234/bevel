"use client";

/**
 * BLOCK: Launchpad — SaaS Activation Flow
 * A complete post-signup experience: multi-step onboarding → app dashboard → product tour.
 * Bevel: Form Engine (onboarding) + Product Tour (app discovery) + Command Palette (power users)
 * shadcn: Card, Badge, Button, Progress, Avatar, Separator, Tabs, ScrollArea
 * motion/react: step transitions, celebration animation, tour highlight pulses
 */

import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { z } from "zod";

// ─── Bevel Form Engine ────────────────────────────────────────────────────────
import {
  FormEngineRoot,
  FormEngineProgress,
  FormEngineStepMeta,
  FormEngineStepCanvas,
  FormEngineNavigation,
  createZodPlugin,
  type FormEngineConfig,
} from "@/components/bevelui/form-engine";

// ─── Bevel Product Tour ───────────────────────────────────────────────────────
import { TourRoot, TourAnchor, TourTrigger } from "@/components/bevelui/tour";
import type { TourStepDef } from "@/components/bevelui/tour";

// ─── Bevel Command Palette ────────────────────────────────────────────────────
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
} from "@/components/bevelui/command-palette";
import type { CommandPaletteSection } from "@/components/bevelui/command-palette";

// ─── shadcn ───────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  IconRocket,
  IconSparkles,
  IconBolt,
  IconSearch,
  IconBell,
  IconPlus,
  IconLayoutDashboard,
  IconUsers,
  IconSettings,
  IconTrendingUp,
  IconChevronRight,
  IconCircleCheck,
  IconPlayerPlay,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type Phase = "onboarding" | "celebrate" | "app";

// ─── App Tour Steps ───────────────────────────────────────────────────────────
const TOUR_STEPS: TourStepDef[] = [
  {
    id: "command-trigger",
    step: 1,
    title: "Command palette at your fingertips",
    description:
      "Press ⌘K anytime to search, navigate, or trigger any action across the app without leaving the keyboard.",
    side: "bottom",
  },
  {
    id: "metrics",
    step: 2,
    title: "Your metrics, live",
    description:
      "These cards reflect real-time data. Click any metric to drill into a full breakdown report.",
    side: "bottom",
  },
  {
    id: "activity-feed",
    step: 3,
    title: "Team activity feed",
    description:
      "Everything your team does appears here in real time — commits, deployments, comments, and reviews.",
    side: "left",
  },
  {
    id: "quick-actions",
    step: 4,
    title: "Quick actions panel",
    description:
      "Your most-used shortcuts live here. You can customise this panel in Settings → Shortcuts.",
    side: "left",
  },
];

// ─── Command Palette Data ─────────────────────────────────────────────────────
const PALETTE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "nav",
    title: "Navigate",
    items: [
      {
        id: "n1",
        title: "Dashboard",
        icon: <IconLayoutDashboard size={16} />,
        meta: "⌘1",
      },
      {
        id: "n2",
        title: "Team",
        icon: <IconUsers size={16} />,
        meta: "⌘2",
      },
      {
        id: "n3",
        title: "Settings",
        icon: <IconSettings size={16} />,
        meta: "⌘,",
      },
    ],
  },
  {
    id: "actions",
    title: "Quick Actions",
    items: [
      {
        id: "a1",
        title: "Invite team member",
        icon: <IconPlus size={16} />,
      },
      {
        id: "a2",
        title: "View analytics",
        icon: <IconTrendingUp size={16} />,
      },
      {
        id: "a3",
        title: "Start product tour",
        icon: <IconPlayerPlay size={16} />,
      },
    ],
  },
];

// ─── Onboarding Form Configuration ────────────────────────────────────────────
// Per‑step Zod schemas used by the zod plugin.
const stepSchemas = {
  0: z.object({
    workspaceName: z.string().min(2, "Workspace name required"),
    role: z.string().min(1, "Select your role"),
  }),
  1: z.object({
    goals: z.array(z.string()).min(1, "Select at least one goal"),
  }),
  2: z.object({
    timezone: z.string().min(1, "Select your timezone"),
    teammates: z.array(z.string()).optional(),
  }),
};

const ONBOARDING_CONFIG: FormEngineConfig = {
  mode: "multi-step",
  validation: "per-step",
  steps: [
    {
      id: "workspace",
      title: "Name your workspace",
      description: "This is how your team will identify it.",
      fields: [
        {
          key: "workspaceName",
          variant: "text",
          label: "Workspace name",
          placeholder: "Acme, Design Team, My Startup…",
          required: true,
        },
        {
          key: "role",
          variant: "card-select",
          label: "Your role",
          props: {
            options: [
              {
                value: "engineer",
                label: "Engineer",
                description: "I build products",
              },
              {
                value: "designer",
                label: "Designer",
                description: "I craft UI/UX",
              },
              {
                value: "pm",
                label: "PM",
                description: "I define what we build",
              },
              {
                value: "founder",
                label: "Founder",
                description: "I do everything",
              },
            ],
            layout: "grid",
            columns: 4,
          },
        },
      ],
    },
    {
      id: "goals",
      title: "What brings you here?",
      description: "We'll personalise your setup based on your goals.",
      fields: [
        {
          key: "goals",
          variant: "chip-select",
          label: "Select your goals",
          required: true,
          props: {
            options: [
              { value: "ship-faster", label: "Ship faster" },
              { value: "reduce-bugs", label: "Reduce bugs" },
              { value: "improve-ux", label: "Better UX" },
              { value: "collaboration", label: "Team collaboration" },
              { value: "analytics", label: "Analytics & data" },
              { value: "automation", label: "Automation" },
              { value: "scale", label: "Scale the team" },
              { value: "revenue", label: "Grow revenue" },
            ],
            multiple: true,
          },
        },
      ],
    },
    {
      id: "team",
      title: "Set up your team",
      description: "Your timezone and any teammates you want to invite.",
      fields: [
        {
          key: "timezone",
          variant: "select",
          label: "Timezone",
          required: true,
          props: {
            options: [
              {
                group: "Americas",
                options: [
                  { value: "et", label: "Eastern (ET)" },
                  { value: "ct", label: "Central (CT)" },
                  { value: "pt", label: "Pacific (PT)" },
                ],
              },
              {
                group: "Europe & Africa",
                options: [
                  { value: "gmt", label: "London (GMT)" },
                  { value: "cet", label: "Paris (CET)" },
                  { value: "wat", label: "Lagos (WAT)" },
                ],
              },
              {
                group: "Asia & Pacific",
                options: [
                  { value: "ist", label: "Mumbai (IST)" },
                  { value: "sgt", label: "Singapore (SGT)" },
                ],
              },
            ],
            placeholder: "Select your timezone",
          },
        },
        {
          key: "teammates",
          variant: "tag-input",
          label: "Invite teammates",
          props: {
            placeholder: "name@company.com — press Enter",
            validate: (t: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t),
            // invalidMessage: "Enter a valid email",
          },
        },
      ],
    },
  ],
};

// ─── Dashboard App Component ──────────────────────────────────────────────────
function DashboardApp({ workspaceName }: { workspaceName: string }) {
  const metrics = [
    { label: "Monthly Revenue", value: "$48,295", change: "+12.5%", up: true },
    { label: "Active Users", value: "3,842", change: "+8.1%", up: true },
    { label: "Churn Rate", value: "2.4%", change: "-0.3%", up: true },
    { label: "NPS Score", value: "68", change: "+4", up: true },
  ];

  const activity = [
    { user: "MK", action: "deployed to production", time: "2m ago" },
    { user: "SR", action: "merged PR #142 — dark mode fixes", time: "15m ago" },
    { user: "JD", action: "closed 3 support tickets", time: "1h ago" },
    { user: "LM", action: "added 5 test cases to auth module", time: "2h ago" },
    { user: "MK", action: "opened PR #143 — rate limiting", time: "3h ago" },
    { user: "SR", action: "updated user docs for v2.1", time: "4h ago" },
  ];

  const quickActions = [
    { icon: IconPlus, label: "Invite teammate" },
    { icon: IconTrendingUp, label: "View analytics" },
    { icon: IconBell, label: "Notification settings" },
    { icon: IconSettings, label: "Workspace settings" },
  ];

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Sidebar */}
      <aside className="w-56 border-r border-border flex flex-col p-3 shrink-0">
        <div className="flex items-center gap-2 px-2 py-3 mb-2">
          <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
            <IconBolt size={14} className="text-primary-foreground" />
          </div>
          <span className="font-semibold text-sm truncate">
            {workspaceName}
          </span>
        </div>

        {[
          { icon: IconLayoutDashboard, label: "Dashboard", active: true },
          { icon: IconTrendingUp, label: "Analytics" },
          { icon: IconUsers, label: "Team" },
          { icon: IconSettings, label: "Settings" },
        ].map(({ icon: Icon, label, active }) => (
          <button
            key={label}
            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-md text-sm transition-colors ${
              active
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            }`}
          >
            <Icon size={14} />
            {label}
          </button>
        ))}

        <div className="mt-auto pt-3 border-t border-border">
          <div className="flex items-center gap-2 px-2 py-1">
            <Avatar className="size-6">
              <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                JD
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-muted-foreground truncate">You</span>
            <Badge variant="secondary" className="ml-auto text-[9px] py-0">
              Pro
            </Badge>
          </div>
        </div>
      </aside>

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="h-12 border-b border-border flex items-center justify-between px-5 shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">Good morning,</span>
            <span className="font-medium">Jamie 👋</span>
          </div>
          <div className="flex items-center gap-2">
            <TourAnchor asChild step={1}>
              <CommandPaletteTrigger asChild>
                <button className="flex items-center gap-2 bg-muted hover:bg-muted/80 px-3 py-1.5 rounded-md text-xs text-muted-foreground transition-colors cursor-pointer">
                  <IconSearch size={12} />
                  Search…{" "}
                  <kbd className="ml-1 text-[10px] bg-background border border-border px-1 rounded font-mono">
                    ⌘K
                  </kbd>
                </button>
              </CommandPaletteTrigger>
            </TourAnchor>
            <TourTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs cursor-pointer"
              >
                <IconPlayerPlay size={12} />
                Take tour
              </Button>
            </TourTrigger>
          </div>
        </header>

        <ScrollArea className="flex-1">
          <div className="p-6 space-y-6">
            {/* Metrics */}
            <TourAnchor asChild step={2}>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {metrics.map((m, i) => (
                  <motion.div
                    key={m.label}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: i * 0.08 }}
                  >
                    <Card className="p-4 space-y-2 hover:border-primary/20 transition-colors cursor-pointer">
                      <span className="text-xs text-muted-foreground">
                        {m.label}
                      </span>
                      <p className="text-xl font-semibold tracking-tight">
                        {m.value}
                      </p>
                      <span
                        className={`text-xs flex items-center gap-1 font-medium ${
                          m.up ? "text-green-500" : "text-red-400"
                        }`}
                      >
                        <IconTrendingUp size={11} />
                        {m.change}
                      </span>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TourAnchor>

            {/* Content row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
              {/* Activity feed */}
              <TourAnchor asChild step={3}>
                <Card className="lg:col-span-2 p-0 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-border">
                    <span className="text-sm font-medium">Team Activity</span>
                    <Badge variant="secondary" className="text-[10px]">
                      Live
                    </Badge>
                  </div>
                  <div className="divide-y divide-border/60">
                    {activity.map((a, i) => (
                      <motion.div
                        key={i}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.2 + i * 0.05 }}
                        className="flex items-center gap-3 px-4 py-2.5"
                      >
                        <Avatar className="size-7 shrink-0">
                          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                            {a.user}
                          </AvatarFallback>
                        </Avatar>
                        <p className="text-xs flex-1 min-w-0">
                          <span className="font-medium">{a.user}</span>{" "}
                          <span className="text-muted-foreground">
                            {a.action}
                          </span>
                        </p>
                        <span className="text-[10px] text-muted-foreground shrink-0">
                          {a.time}
                        </span>
                      </motion.div>
                    ))}
                  </div>
                </Card>
              </TourAnchor>

              {/* Quick actions */}
              <TourAnchor asChild step={4}>
                <Card className="p-4 space-y-3">
                  <span className="text-sm font-medium">Quick Actions</span>
                  <div className="space-y-1.5">
                    {quickActions.map(({ icon: Icon, label }) => (
                      <button
                        key={label}
                        className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
                      >
                        <Icon size={14} />
                        {label}
                        <IconChevronRight size={12} className="ml-auto" />
                      </button>
                    ))}
                  </div>
                  <Separator />
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs">
                      <span className="text-muted-foreground">Onboarding</span>
                      <span className="text-primary font-medium">3/5 done</span>
                    </div>
                    <Progress value={60} className="h-1.5" />
                  </div>
                </Card>
              </TourAnchor>
            </div>
          </div>
        </ScrollArea>
      </div>
    </div>
  );
}

// ─── Celebrate Screen ─────────────────────────────────────────────────────────
function CelebrateScreen({
  name,
  onContinue,
}: {
  name: string;
  onContinue: () => void;
}) {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center">
      <div className="text-center space-y-6 max-w-md px-6">
        <motion.div
          initial={{ scale: 0, rotate: -10 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: "spring", stiffness: 200, damping: 12 }}
          className="size-20 rounded-3xl bg-primary/10 flex items-center justify-center mx-auto"
        >
          <IconSparkles size={36} className="text-primary" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="space-y-3"
        >
          <h1 className="text-3xl font-bold tracking-tight">
            {name} is ready!
          </h1>
          <p className="text-muted-foreground leading-relaxed">
            Your workspace is set up. We've personalised your dashboard based on
            your role and goals. Let's take a quick tour so you know where
            everything lives.
          </p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex gap-3 justify-center"
        >
          <Button onClick={onContinue} className="gap-2 cursor-pointer">
            <IconRocket size={15} />
            Take me to my dashboard →
          </Button>
        </motion.div>
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="text-xs text-muted-foreground underline underline-offset-4 cursor-pointer"
          onClick={onContinue}
        >
          Skip tour, I'll explore myself
        </motion.button>
      </div>
    </div>
  );
}

// ─── Onboarding Flow ──────────────────────────────────────────────────────────
function OnboardingFlow({
  onComplete,
}: {
  onComplete: (name: string) => void;
}) {
  return (
    <div className="min-h-screen bg-background text-foreground flex">
      {/* Left panel */}
      <div className="hidden lg:flex w-80 bg-card border-r border-border flex-col p-10 shrink-0">
        <div className="flex items-center gap-2.5 mb-auto">
          <div className="size-8 rounded-xl bg-primary flex items-center justify-center">
            <IconBolt size={16} className="text-primary-foreground" />
          </div>
          <span className="font-semibold">Launchpad</span>
        </div>
        <div className="space-y-8 mb-auto">
          <div>
            <Badge className="mb-4 bg-primary/10 text-primary border-primary/20 gap-1">
              <IconRocket size={11} />3 steps · ~2 minutes
            </Badge>
            <h2 className="text-2xl font-bold leading-tight tracking-tight">
              Set up your workspace in minutes.
            </h2>
            <p className="text-sm text-muted-foreground mt-3 leading-relaxed">
              We'll personalise your dashboard, configure your notifications,
              and invite your team automatically.
            </p>
          </div>
          <div className="space-y-3">
            {[
              "Personalised dashboard based on your role",
              "Team invites sent automatically",
              "Guided tour so nothing is confusing",
            ].map((item) => (
              <div
                key={item}
                className="flex items-start gap-2.5 text-sm text-muted-foreground"
              >
                <IconCircleCheck
                  size={15}
                  className="text-primary mt-0.5 shrink-0"
                />
                {item}
              </div>
            ))}
          </div>
        </div>
        <p className="text-xs text-muted-foreground">
          Used by 12,000+ teams worldwide
        </p>
      </div>

      {/* Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <FormEngineRoot
            config={ONBOARDING_CONFIG}
            plugins={[createZodPlugin(stepSchemas)]}
            onSubmit={async (values) => {
              // values contain all form data
              onComplete(values.workspaceName as string);
            }}
          >
            <div className="mb-8">
              <FormEngineProgress />
            </div>
            <FormEngineStepMeta />
            <div className="mt-5">
              <FormEngineStepCanvas />
            </div>
            <div className="mt-8">
              <FormEngineNavigation
                submitLabel="Finish setup →"
                nextLabel="Continue →"
                backLabel="← Back"
              />
            </div>
          </FormEngineRoot>
        </div>
      </div>
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function LaunchpadBlock() {
  const [phase, setPhase] = useState<Phase>("onboarding");
  const [workspaceName, setWorkspaceName] = useState("");

  return (
    <AnimatePresence mode="wait">
      {phase === "onboarding" && (
        <motion.div
          key="onboarding"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <OnboardingFlow
            onComplete={(name) => {
              setWorkspaceName(name);
              setPhase("celebrate");
            }}
          />
        </motion.div>
      )}
      {phase === "celebrate" && (
        <motion.div
          key="celebrate"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <CelebrateScreen
            name={workspaceName}
            onContinue={() => setPhase("app")}
          />
        </motion.div>
      )}
      {phase === "app" && (
        <motion.div
          key="app"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="h-screen"
        >
          <TourRoot steps={TOUR_STEPS} defaultOpen>
            <CommandPaletteRoot
              sections={PALETTE_SECTIONS}
              onSelect={(item) => {
                if (item.id === "a3") {
                  // Start tour programmatically if needed
                }
              }}
            >
              <DashboardApp workspaceName={workspaceName} />
            </CommandPaletteRoot>
          </TourRoot>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

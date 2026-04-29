"use client";

import { useState, Suspense, lazy } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  IconBoltFilled,
  IconExternalLink,
  IconMaximize,
  IconCloud,
  IconUsers,
  IconRocket,
  IconBriefcase,
  IconPackage,
  IconSettings,
  IconArrowRight,
  IconFlask,
  IconFlaskFilled,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Wrapper } from "../shared/wrapper";
// Lazy load each lab — heavy components, no need to load all at once
const VaultApp = lazy(() => import("@/components/labs/vault/VaultApp"));
const OnboardApp = lazy(() => import("@/components/labs/onboard/OnboardApp"));
const LaunchpadApp = lazy(
  () => import("@/components/labs/launchpad/LaunchpadApp"),
);
const IntakeApp = lazy(() => import("@/components/labs/intake/IntakeApp"));
const BriefcaseApp = lazy(
  () => import("@/components/labs/briefcase/BriefcaseApp"),
);
const CompassApp = lazy(() => import("@/components/labs/compass/CompassApp"));

// ─── Lab definitions ──────────────────────────────────────────────────────────

const LABS = [
  {
    id: "vault",
    name: "Vault",
    tagline: "File manager",
    description:
      "A fully functional Google Drive-style app. Upload files, organise into folders, search with ⌘K, switch between grid and list views, star and delete — all wired up and working.",
    systems: ["File Upload", "Command Palette"],
    icon: IconCloud,
    accent: "#c2f13c",
    component: VaultApp,
    previewRoute: "/preview/vault",
  },
  {
    id: "onboard",
    name: "Onboard",
    tagline: "SaaS signup flow",
    description:
      "A three-step account creation flow that lands in a real dashboard — then immediately walks new users through it with a guided product tour.",
    systems: ["Form Engine", "Product Tour"],
    icon: IconRocket,
    accent: "#818cf8",
    component: OnboardApp,
    previewRoute: "/preview/onboard",
  },
  {
    id: "launchpad",
    name: "Launchpad",
    tagline: "Developer dashboard",
    description:
      "A deployment dashboard for three projects with live metrics, deployment history, and a command palette for instant navigation — no clicks required.",
    systems: ["Command Palette", "Product Tour"],
    icon: IconRocket,
    accent: "#f97316",
    component: LaunchpadApp,
    previewRoute: "/preview/launchpad",
  },
  {
    id: "intake",
    name: "Intake",
    tagline: "Application form",
    description:
      "A multi-step job application with a branded left panel, role selection cards, conditional fields, and a full submission state — the kind of form that actually converts.",
    systems: ["Form Engine"],
    icon: IconUsers,
    accent: "#e879f9",
    component: IntakeApp,
    previewRoute: "/preview/intake",
  },
  {
    id: "briefcase",
    name: "Briefcase",
    tagline: "Client handoff tool",
    description:
      "A two-phase workflow: fill out the project brief, then upload the deliverables. Generates a receipt with revision count and a downloadable PDF summary.",
    systems: ["Form Engine", "File Upload"],
    icon: IconPackage,
    accent: "#22c55e",
    component: BriefcaseApp,
    previewRoute: "/preview/briefcase",
  },
  {
    id: "compass",
    name: "Compass",
    tagline: "Settings hub",
    description:
      "A settings page with five sections — Profile, Notifications, Appearance, Security, and API keys — navigable via sidebar or ⌘K, with a tour for first-time users.",
    systems: ["Form Engine", "Command Palette", "Product Tour"],
    icon: IconSettings,
    accent: "#06b6d4",
    component: CompassApp,
    previewRoute: "/preview/compass",
  },
];

// ─── System badge ─────────────────────────────────────────────────────────────

const SYSTEM_COLORS: Record<string, { bg: string; color: string }> = {
  "File Upload": { bg: "rgba(249,115,22,.12)", color: "#f97316" },
  "Command Palette": { bg: "rgba(129,140,248,.12)", color: "#818cf8" },
  "Product Tour": { bg: "rgba(194,241,60,.12)", color: "#7aad00" },
  "Form Engine": { bg: "rgba(232,121,249,.12)", color: "#e879f9" },
};

function SystemBadge({ name }: { name: string }) {
  const style = SYSTEM_COLORS[name] ?? {
    bg: "rgba(255,255,255,.08)",
    color: "rgba(255,255,255,.5)",
  };
  return (
    <span
      className="text-[10px] font-semibold px-2 py-0.5 rounded-full"
      style={{ background: style.bg, color: style.color }}
    >
      {name}
    </span>
  );
}

// ─── Preview skeleton ─────────────────────────────────────────────────────────

<PreviewSkeleton />;
function PreviewSkeleton() {
  return (
    <div className="w-full h-full flex items-center justify-center bg-muted/20 animate-pulse rounded-xl">
      <div className="flex flex-col items-center gap-3 text-primary ">
        <IconFlaskFilled
          size={32}
          strokeWidth={1.2}
          className="animate-bounce"
        />
        <span className="text-xs">Loading lab...</span>
      </div>
    </div>
  );
}

// ─── Lab card ─────────────────────────────────────────────────────────────────

function LabCard({
  lab,
  active,
  onClick,
}: {
  lab: (typeof LABS)[number];
  active: boolean;
  onClick: () => void;
}) {
  return (
    <motion.button
      onClick={onClick}
      className={cn(
        "w-full text-left p-4 rounded-lg border transition-all duration-150",
        active ? "bg-card/90" : "bg-card/70",
      )}
      whileHover={{ x: 2 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      <div className="flex items-start gap-3">
        <div
          className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0 mt-0.5"
          style={{ background: `${lab.accent}18` }}
        >
          <lab.icon size={16} strokeWidth={1.8} style={{ color: lab.accent }} />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="text-sm font-semibold">{lab.name}</span>
            <span className="text-[10px] text-muted-foreground">
              {lab.tagline}
            </span>
          </div>
          <div className="flex flex-wrap gap-1 mt-1">
            {lab.systems.map((s) => (
              <SystemBadge key={s} name={s} />
            ))}
          </div>
        </div>
        {active && (
          <div
            className="w-1.5 h-1.5  shrink-0 mt-1.5"
            style={{ background: lab.accent }}
          />
        )}
      </div>
    </motion.button>
  );
}

export function LabsMain() {
  const [activeLab, setActiveLab] = useState(LABS[0]);
  const ActiveComponent = activeLab.component;

  return (
    <Wrapper>
      <div className="flex gap-6 items-start">
        {/* Lab list sidebar */}
        <div className="w-72 shrink-0 flex flex-col gap-2 sticky top-20">
          {LABS.map((lab) => (
            <LabCard
              key={lab.id}
              lab={lab}
              active={activeLab.id === lab.id}
              onClick={() => setActiveLab(lab)}
            />
          ))}

          {/* Pro CTA */}
          {/* <div
            className="mt-2 p-4 rounded-xl"
            style={{
              background: "rgba(194,241,60,0.04)",
              border: "1px solid rgba(194,241,60,0.15)",
            }}
          >
            <p className="text-xs font-semibold mb-1">Get the source code</p>
            <p className="text-[11px] text-muted-foreground leading-relaxed mb-3">
              All six Labs are included with Bevel Pro. Copy the code straight
              into your project.
            </p>
            <Button
              size="sm"
              className="w-full text-xs font-bold gap-1.5"
              style={{ background: "#c2f13c", color: "#0a0a0a" }}
              asChild
            >
              <Link href="/pricing">
                <IconBoltFilled size={11} />
                Unlock Labs — $49
              </Link>
            </Button>
          </div> */}
        </div>

        {/* Preview panel */}
        <div className="flex-1 min-w-0">
          {/* Lab header */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLab.id + "-header"}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex items-start justify-between gap-4 mb-4"
            >
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h2 className="text-3xl font-medium tracking-tight font-sans">
                    {activeLab.name}
                  </h2>
                  <span className="text-sm text-muted-foreground">
                    {activeLab.tagline}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed max-w-xl">
                  {activeLab.description}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <span className="text-[11px] text-muted-foreground">
                    Built with:
                  </span>
                  {activeLab.systems.map((s) => (
                    <SystemBadge key={s} name={s} />
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="gap-1.5 text-xs"
                  asChild
                >
                  <Link href={activeLab.previewRoute} target="_blank">
                    <IconMaximize size={12} />
                    Fullscreen
                  </Link>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Live preview */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeLab.id}
              initial={{ opacity: 0, scale: 0.99 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="rounded-2xl border border-border overflow-hidden bg-background transform scale-100"
              style={{ height: 580 }}
            >
              <Suspense fallback={<PreviewSkeleton />}>
                <ActiveComponent />
              </Suspense>
            </motion.div>
          </AnimatePresence>

          {/* Systems used breakdown */}
          <motion.div
            key={activeLab.id + "-systems"}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-4 flex items-center gap-3"
          >
            <span className="text-xs text-muted-foreground">
              Systems used in this lab:
            </span>
            {activeLab.systems.map((system) => (
              <Link
                key={system}
                href={`/docs/components/${system.toLowerCase().replace(" ", "-")}`}
                className="text-xs text-primary hover:underline flex items-center gap-1"
              >
                {system} <IconExternalLink size={10} />
              </Link>
            ))}
          </motion.div>
        </div>
      </div>
    </Wrapper>
  );
}

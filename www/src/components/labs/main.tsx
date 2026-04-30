"use client";

import { motion } from "motion/react";
import {
  IconExternalLink,
  IconCloud,
  IconUsers,
  IconRocket,
  IconPackage,
  IconSettings,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Wrapper } from "../shared/wrapper";

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

// ─── Lab card ─────────────────────────────────────────────────────────────────

function LabCard({
  lab,
  index,
}: {
  lab: (typeof LABS)[number];
  index: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.06 }}
    >
      <Link
        href={lab.previewRoute}
        target="_blank"
        className="group block h-full p-5 rounded-xl border border-border bg-card/60 hover:bg-card/90 hover:border-border/80 transition-all duration-200"
      >
        {/* Icon + name row */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{ background: `${lab.accent}18` }}
            >
              <lab.icon
                size={17}
                strokeWidth={1.7}
                style={{ color: lab.accent }}
              />
            </div>
            <div>
              <p className="text-sm font-semibold leading-none mb-1">
                {lab.name}
              </p>
              <p className="text-[11px] text-muted-foreground">{lab.tagline}</p>
            </div>
          </div>
          <IconExternalLink
            size={14}
            className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors mt-0.5 shrink-0"
          />
        </div>

        {/* Description */}
        <p className="text-[13px] text-muted-foreground leading-relaxed mb-4">
          {lab.description}
        </p>

        {/* Systems */}
        <div className="flex flex-wrap gap-1.5">
          {lab.systems.map((s) => (
            <SystemBadge key={s} name={s} />
          ))}
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export function LabsMain() {
  return (
    <Wrapper>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {LABS.map((lab, i) => (
          <LabCard key={lab.id} lab={lab} index={i} />
        ))}
      </div>
    </Wrapper>
  );
}

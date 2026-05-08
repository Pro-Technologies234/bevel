"use client";

/**
 * app/showcase/page.tsx
 *
 * Bevel UI — Showcase page
 * Not a boring blocks grid. A "proof of concept" gallery that shows
 * Bevel powering real applications developers actually build.
 *
 * Concept: Editorial, dark-first, Linear-inspired precision.
 * Each card is a full-bleed app preview frame with live system badges,
 * an animated hover state that reveals a scrolling screenshot-style mockup,
 * and a direct link to the live preview.
 *
 * The page itself makes a statement: this is engineering, not decoration.
 */

import { useState } from "react";
import {
  motion,
  useMotionValue,
  useTransform,
  AnimatePresence,
} from "motion/react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  IconArrowRight,
  IconExternalLink,
  IconCloud,
  IconBolt,
  IconLifebuoy,
  IconBriefcase,
  IconFileText,
  IconRocket,
  IconLayoutKanban,
  IconFolder,
  IconMessage,
  IconCode,
  IconSparkles,
  IconChevronRight,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type SystemTag =
  | "Product Tour"
  | "Command Palette"
  | "File Upload"
  | "Form Engine";
type ControlTag =
  | "CardSelect"
  | "ChipSelect"
  | "RatingField"
  | "SelectField"
  | "TagInput";

type ShowcaseItem = {
  id: string;
  name: string;
  tagline: string;
  description: string;
  href: string;
  previewHref: string;
  systems: SystemTag[];
  controls: ControlTag[];
  accentColor: string;
  icon: typeof IconCloud;
  gradient: string;
  mockupRows: string[];
};

// ─── Data ─────────────────────────────────────────────────────────────────────
const SHOWCASE_ITEMS: ShowcaseItem[] = [
  {
    id: "drive",
    name: "Bevel Drive",
    tagline: "Cloud file storage",
    description:
      "A full Google Drive clone — drag-drop uploads, per-file progress, list/grid views, command palette search, and a guided tour for new users. Every major system working together.",
    href: "/blocks/drive",
    previewHref: "/blocks/drive",
    systems: ["File Upload", "Command Palette", "Product Tour"],
    controls: [],
    accentColor: "#c2f13c",
    icon: IconCloud,
    gradient: "from-primary/20 via-primary/5 to-transparent",
    mockupRows: [
      "My Drive  ·  3.8 GB used",
      "📁  Brand Assets        Today       —",
      "📄  Q2 Report.pdf       Today       4.2 MB",
      "🎬  Product Demo.mp4    Yesterday   128 MB",
      "🖼️  hero-dark.png       Yesterday   2.1 MB",
      "📁  Design Specs        Mon         —",
      "📄  user-research.pdf   Mon         1.8 MB",
    ],
  },
  {
    id: "forge",
    name: "Forge",
    tagline: "Project management",
    description:
      "A Linear-style issue tracker. Command palette for search and actions, Form Engine with CardSelect + ChipSelect to create issues, kanban and list views, and a sprint cycle progress bar.",
    href: "/blocks/forge",
    previewHref: "/blocks/forge",
    systems: ["Command Palette", "Form Engine"],
    controls: ["CardSelect", "ChipSelect"],
    accentColor: "#818cf8",
    icon: IconBolt,
    gradient: "from-indigo-500/20 via-indigo-500/5 to-transparent",
    mockupRows: [
      "All Issues  ·  8 open",
      "🔴  FRG-14   Implement dark mode tokens    In Progress",
      "🟡  FRG-13   Fix auth refresh on Safari    To Do",
      "🟢  FRG-12   Add CSV export to reports     To Do",
      "⚪  FRG-11   Set up Sentry tracking        Backlog",
      "🟢  FRG-9    Migrate to Postgres 16        Done",
      "🔴  FRG-7    Rate limit public endpoints   In Progress",
    ],
  },
  {
    id: "helply",
    name: "Helply",
    tagline: "Customer support",
    description:
      "A complete support portal. Three-step ticket submission with Form Engine (SelectField, ChipSelect, RatingField), file attachments, command palette ticket search, and a guided tour.",
    href: "/blocks/helply",
    previewHref: "/blocks/helply",
    systems: ["Form Engine", "File Upload", "Command Palette", "Product Tour"],
    controls: ["SelectField", "ChipSelect", "RatingField"],
    accentColor: "#34d399",
    icon: IconLifebuoy,
    gradient: "from-emerald-500/20 via-emerald-500/5 to-transparent",
    mockupRows: [
      "Inbox  ·  4 open  ·  CSAT 94%",
      "🔵  TKT-1042  CSV export 500 error      High    Open",
      "🟡  TKT-1041  Billing charged twice     Urgent  Pending",
      "✅  TKT-1040  How to invite 5+ members  Low     Resolved",
      "🔵  TKT-1039  Dark mode mobile bug      Medium  Open",
      "⚫  TKT-1038  Bulk delete request       Low     Closed",
    ],
  },
  {
    id: "talentflow",
    name: "TalentFlow",
    tagline: "Job board + hiring",
    description:
      "A job board with a three-step application flow — personal info, cover letter, CV upload. Form Engine + File Upload + all controls. Command palette for instant job search.",
    href: "/blocks/talentflow",
    previewHref: "/blocks/talentflow",
    systems: ["Form Engine", "File Upload", "Command Palette"],
    controls: ["CardSelect", "ChipSelect", "SelectField", "TagInput"],
    accentColor: "#fb923c",
    icon: IconBriefcase,
    gradient: "from-orange-500/20 via-orange-500/5 to-transparent",
    mockupRows: [
      "5 jobs  ·  All  ·  Remote",
      "⭐  Senior Frontend Engineer    Linear       $160k–$200k",
      "    Product Designer            Vercel       $140k–$180k",
      "    Full-Stack Engineer          Supabase    $120k–$160k",
      "    DevRel Engineer              Resend       $110k–$150k",
      "⭐  Staff Backend Engineer      PlanetScale  $180k–$240k",
    ],
  },
  {
    id: "inkwell",
    name: "Inkwell",
    tagline: "Content management",
    description:
      "A CMS with a full article editor, three-step publish flow (metadata, cover image upload, SEO + distribution), and command palette for instant article search and navigation.",
    href: "/blocks/inkwell",
    previewHref: "/blocks/inkwell",
    systems: ["File Upload", "Command Palette", "Form Engine"],
    controls: ["TagInput", "SelectField"],
    accentColor: "#e879f9",
    icon: IconFileText,
    gradient: "from-fuchsia-500/20 via-fuchsia-500/5 to-transparent",
    mockupRows: [
      "All articles  ·  5 total",
      "✅  Building a Design System          Published   2,400 words",
      "📝  The Case for Copy-to-Own          Draft       1,200 words",
      "🔍  React 19 in Production            In Review   3,600 words",
      "🕐  AI-Assisted Code Review           Scheduled   1,800 words",
      "✅  Zod v4: Everything That Changed   Published   2,100 words",
    ],
  },
  {
    id: "launchpad",
    name: "Launchpad",
    tagline: "SaaS activation flow",
    description:
      "The full activation journey — multi-step onboarding with all 5 controls, a celebration screen, then a live dashboard with auto-started product tour and command palette. The complete Bevel experience in one block.",
    href: "/blocks/launchpad",
    previewHref: "/blocks/launchpad",
    systems: ["Form Engine", "Product Tour", "Command Palette"],
    controls: [
      "CardSelect",
      "ChipSelect",
      "SelectField",
      "TagInput",
      "RatingField",
    ],
    accentColor: "#c2f13c",
    icon: IconRocket,
    gradient: "from-primary/20 via-primary/5 to-transparent",
    mockupRows: [
      "Step 1 of 3  —  Name your workspace",
      "Workspace name:  Acme Inc.",
      "Role:  ● Engineer   ○ Designer   ○ PM   ○ Founder",
      "─────────────────────────────────────────",
      "Step 2 of 3  —  What are your goals?",
      "✓ Ship faster   ✓ Better UX   ○ Analytics",
      "Continue →",
    ],
  },
];

const SYSTEM_COLORS: Record<SystemTag, string> = {
  "Product Tour": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  "Command Palette": "bg-purple-500/10 text-purple-400 border-purple-500/20",
  "File Upload": "bg-orange-500/10 text-orange-400 border-orange-500/20",
  "Form Engine": "bg-primary/10 text-primary border-primary/20",
};

const CONTROL_COLORS = "bg-muted/60 text-muted-foreground border-border/60";

// ─── Showcase Card ─────────────────────────────────────────────────────────────
function ShowcaseCard({ item, index }: { item: ShowcaseItem; index: number }) {
  const [hovered, setHovered] = useState(false);
  const Icon = item.icon;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: (index % 3) * 0.1, duration: 0.5 }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className="group relative"
    >
      <Link href={item.previewHref} className="block">
        <div className="relative rounded-2xl border border-border/60 bg-card overflow-hidden transition-all duration-300 hover:border-border hover:shadow-2xl hover:shadow-black/40">
          {/* Gradient accent */}
          <div
            className={`absolute inset-0 bg-gradient-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`}
          />

          {/* App mockup preview */}
          <div className="relative h-52 bg-background/50 border-b border-border/60 overflow-hidden font-mono">
            {/* Fake window chrome */}
            <div className="flex items-center gap-1.5 px-3 py-2.5 border-b border-border/40 bg-muted/30">
              <div className="size-2.5 rounded-full bg-red-500/60" />
              <div className="size-2.5 rounded-full bg-yellow-500/60" />
              <div className="size-2.5 rounded-full bg-green-500/60" />
              <div className="flex items-center gap-1.5 ml-3 px-2.5 py-0.5 rounded bg-muted/60 text-[9px] text-muted-foreground flex-1 max-w-48">
                <div className="size-1.5 rounded-full bg-muted-foreground/40" />
                bevelui.pxxl.click/blocks/{item.id}
              </div>
            </div>

            {/* Mockup rows */}
            <div className="p-3 space-y-1.5">
              {item.mockupRows.map((row, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -4 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.3 + i * 0.06 }}
                  className={`text-[10px] truncate ${i === 0 ? "text-foreground/90 font-medium pb-1 border-b border-border/30 mb-0.5" : "text-muted-foreground/80"}`}
                >
                  {row}
                </motion.div>
              ))}
            </div>

            {/* Hover overlay */}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center"
                >
                  <div className="flex items-center gap-2 bg-foreground text-background px-4 py-2 rounded-full text-xs font-medium">
                    <IconExternalLink size={13} />
                    Open live preview
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Card content */}
          <div className="p-5 space-y-3">
            <div className="flex items-start justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div
                  className="size-8 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    backgroundColor: `${item.accentColor}18`,
                    border: `1px solid ${item.accentColor}30`,
                  }}
                >
                  <Icon size={15} style={{ color: item.accentColor }} />
                </div>
                <div>
                  <h3 className="text-sm font-semibold leading-tight">
                    {item.name}
                  </h3>
                  <p className="text-[11px] text-muted-foreground">
                    {item.tagline}
                  </p>
                </div>
              </div>
              <div className="size-7 rounded-lg border border-border flex items-center justify-center shrink-0 opacity-0 group-hover:opacity-100 transition-all group-hover:border-foreground/20">
                <IconArrowRight size={12} />
              </div>
            </div>

            <p className="text-xs text-muted-foreground leading-relaxed">
              {item.description}
            </p>

            {/* System badges */}
            <div className="flex flex-wrap gap-1.5 pt-1">
              {item.systems.map((s) => (
                <span
                  key={s}
                  className={`text-[10px] px-2 py-0.5 rounded-full border font-medium ${SYSTEM_COLORS[s]}`}
                >
                  {s}
                </span>
              ))}
              {item.controls.map((c) => (
                <span
                  key={c}
                  className={`text-[10px] px-2 py-0.5 rounded-full border ${CONTROL_COLORS}`}
                >
                  {c}
                </span>
              ))}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}

// ─── Stats row ────────────────────────────────────────────────────────────────
function StatsRow() {
  const stats = [
    { value: "6", label: "real applications" },
    { value: "4", label: "Bevel systems used" },
    { value: "5", label: "controls in use" },
    { value: "100%", label: "functional — no fakes" },
  ];

  return (
    <div className="flex flex-wrap justify-center gap-x-12 gap-y-4 py-10">
      {stats.map(({ value, label }, i) => (
        <motion.div
          key={label}
          initial={{ opacity: 0, y: 8 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="text-center"
        >
          <p className="text-3xl font-bold tracking-tight text-foreground font-nohemi">
            {value}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
        </motion.div>
      ))}
    </div>
  );
}

// ─── System legend ────────────────────────────────────────────────────────────
function SystemLegend() {
  return (
    <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
      <span className="font-medium">Systems:</span>
      {(Object.entries(SYSTEM_COLORS) as [SystemTag, string][]).map(
        ([name, cls]) => (
          <span
            key={name}
            className={`px-2 py-0.5 rounded-full border font-medium ${cls}`}
          >
            {name}
          </span>
        ),
      )}
      <span className="ml-2 font-medium">Controls:</span>
      <span className={`px-2 py-0.5 rounded-full border ${CONTROL_COLORS}`}>
        CardSelect etc.
      </span>
    </div>
  );
}

// ─── CTA Banner ───────────────────────────────────────────────────────────────
function CTABanner() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="relative rounded-2xl border border-primary/20 bg-primary/5 p-8 text-center overflow-hidden"
    >
      {/* Background accent */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -top-20 left-1/2 -translate-x-1/2 size-64 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

      <div className="relative space-y-4">
        <div className="inline-flex items-center gap-2 bg-primary/10 text-primary text-xs px-3 py-1.5 rounded-full font-medium border border-primary/20">
          <IconSparkles size={12} />
          All blocks are fully functional
        </div>
        <h2 className="text-2xl font-bold tracking-tight font-nohemi">
          Every line of code is yours.
        </h2>
        <p className="text-sm text-muted-foreground max-w-md mx-auto leading-relaxed">
          These aren't demos with fake data and disabled buttons. Every block
          above is a production-ready application slice — copy it, own it, ship
          it.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Button asChild className="gap-2 cursor-pointer">
            <Link href="/docs/components">
              <IconCode size={14} />
              Browse the docs
            </Link>
          </Button>
          <Button variant="outline" asChild className="gap-2 cursor-pointer">
            <Link href="/docs/quick-start">
              Get started free
              <IconChevronRight size={14} />
            </Link>
          </Button>
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function ShowcasePage() {
  const [activeFilter, setActiveFilter] = useState<SystemTag | "all">("all");

  const filtered =
    activeFilter === "all"
      ? SHOWCASE_ITEMS
      : SHOWCASE_ITEMS.filter((item) => item.systems.includes(activeFilter));

  return (
    <div className="flex-1 min-w-0 px-6 py-10 max-w-5xl">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="space-y-4 mb-10"
      >
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className="text-xs gap-1.5">
            <span className="size-1.5 rounded-full bg-primary inline-block" />
            Showcase
          </Badge>
        </div>

        <h1 className="text-3xl font-bold tracking-tight font-nohemi">
          Built with Bevel
        </h1>

        <p className="text-base text-muted-foreground max-w-xl leading-relaxed">
          Six real applications. Not mockups. Each one is a fully functional app
          slice you can drop into your project — built using Bevel's systems and
          controls exactly as a developer would use them.
        </p>

        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <IconCode size={12} />
          <span>Click any block to open the live preview.</span>
          <span className="mx-1">·</span>
          <Link
            href="/docs/components"
            className="underline underline-offset-4 hover:text-foreground transition-colors"
          >
            Browse the full API →
          </Link>
        </div>
      </motion.div>

      <Separator className="mb-8" />

      {/* Stats */}
      <StatsRow />

      <Separator className="mb-8" />

      {/* Filter */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        <span className="text-xs text-muted-foreground font-medium">
          Filter by system:
        </span>
        {(
          [
            "all",
            "Product Tour",
            "Command Palette",
            "File Upload",
            "Form Engine",
          ] as const
        ).map((f) => (
          <button
            key={f}
            onClick={() => setActiveFilter(f)}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all font-medium ${
              activeFilter === f
                ? f === "all"
                  ? "bg-foreground text-background border-transparent"
                  : SYSTEM_COLORS[f as SystemTag]
                : "border-border/60 text-muted-foreground hover:border-border hover:text-foreground"
            }`}
          >
            {f === "all" ? "All" : f}
          </button>
        ))}
        <span className="ml-auto text-xs text-muted-foreground">
          {filtered.length} block{filtered.length !== 1 ? "s" : ""}
        </span>
      </div>

      {/* Legend */}
      <div className="mb-6">
        <SystemLegend />
      </div>

      {/* Grid */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeFilter}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-14"
        >
          {filtered.map((item, i) => (
            <ShowcaseCard key={item.id} item={item} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>

      {/* CTA */}
      <CTABanner />
    </div>
  );
}

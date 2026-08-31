import Link from "next/link";
import {
  IconCheck,
  IconMinus,
  IconChevronRight,
  IconBoxMultiple,
  IconPackage,
  IconTool,
} from "@tabler/icons-react";
import { Wrapper } from "@/components/shared/wrapper";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { compareMetadata } from "@/lib/metadata";

export const metadata = compareMetadata;

type Cell = boolean | "partial";

const ROWS: { label: string; primitives: Cell; kits: Cell; diy: Cell; bevel: Cell }[] = [
  { label: "Business logic included (not just styling)", primitives: false, kits: "partial", diy: true, bevel: true },
  { label: "Code lives in your repo, not node_modules", primitives: true, kits: false, diy: true, bevel: true },
  { label: "No forced design-system lock-in", primitives: true, kits: false, diy: true, bevel: true },
  { label: "Accessible & keyboard-tested by default", primitives: "partial", kits: true, diy: false, bevel: true },
  { label: "No breaking upgrades to track", primitives: "partial", kits: false, diy: true, bevel: true },
  { label: "Ships in minutes, not days", primitives: false, kits: true, diy: false, bevel: true },
  { label: "Edge cases already handled", primitives: false, kits: "partial", diy: false, bevel: true },
];

function Mark({ value }: { value: Cell }) {
  if (value === true)
    return <IconCheck size={16} strokeWidth={2.5} className="text-primary" />;
  if (value === "partial")
    return <IconMinus size={16} strokeWidth={2.5} className="text-muted-foreground/50" />;
  return <span className="text-muted-foreground/30 text-xs">—</span>;
}

const ALTERNATIVES = [
  {
    icon: IconBoxMultiple,
    accent: "#818cf8",
    title: "Primitives-only libraries",
    body: "Unstyled or lightly-styled building blocks — a button, a dialog, a popover. Excellent foundation, but you're still the one writing the file upload state machine, the command palette fuzzy search, and the kanban drag logic on top of them. Bevel is built on the same primitive layer (shadcn/Radix) — it just doesn't stop there.",
  },
  {
    icon: IconPackage,
    accent: "#f97316",
    title: "Full component kits",
    body: "Pre-styled, batteries-included libraries you install as an npm package. Fast to start with, but you inherit their design system, their bundle, and their release cadence — and ejecting later usually means a rewrite. Nothing in Bevel is a runtime dependency, so there's nothing to eject from.",
  },
  {
    icon: IconTool,
    accent: "#e879f9",
    title: "Building it yourself",
    body: "The most control, and the most honest option if you have the time. It's also where the real cost hides — the drag-and-drop edge cases, the abort-controller cleanup, the keyboard nav — the parts that don't show up in a two-day estimate. Bevel is that work done once, handed to you as a starting point you can still change.",
  },
];

export default function ComparePage() {
  return (
    <div>
      <PageHero
        eyebrow="Compare"
        title="Systems, not primitives."
        description="There's no single 'right' way to build UI. Here's how Bevel's copy-to-own systems stack up against the other paths, so you can pick the one that fits."
      />

      <Wrapper className="pb-24 flex flex-col gap-16">
        {/* Table */}
        <div className="max-w-5xl mx-auto w-full">
          <div className="rounded-2xl border border-border/60 overflow-x-auto">
            <div className="min-w-[640px]">
              <div className="grid grid-cols-5 bg-muted/30 border-b border-border/60 text-[11px] font-mono uppercase tracking-wide">
                <div className="p-4 text-muted-foreground/60">Capability</div>
                <div className="p-4 text-center text-muted-foreground/60">Primitives</div>
                <div className="p-4 text-center text-muted-foreground/60">Component kits</div>
                <div className="p-4 text-center text-muted-foreground/60">Build it yourself</div>
                <div className="p-4 text-center text-primary">Bevel UI</div>
              </div>
              {ROWS.map((row, i) => (
                <div
                  key={row.label}
                  className={cn(
                    "grid grid-cols-5 items-center text-xs md:text-sm",
                    i !== ROWS.length - 1 && "border-b border-border/60",
                  )}
                >
                  <div className="p-4 text-foreground/90">{row.label}</div>
                  <div className="p-4 flex justify-center"><Mark value={row.primitives} /></div>
                  <div className="p-4 flex justify-center"><Mark value={row.kits} /></div>
                  <div className="p-4 flex justify-center"><Mark value={row.diy} /></div>
                  <div className="p-4 flex justify-center bg-primary/5"><Mark value={row.bevel} /></div>
                </div>
              ))}
            </div>
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-3 font-mono">
            Partial = depends heavily on which library, or how much time you invest.
          </p>
        </div>

        {/* Narrative breakdown */}
        <div className="max-w-5xl mx-auto w-full grid md:grid-cols-3 gap-4">
          {ALTERNATIVES.map((alt) => (
            <div
              key={alt.title}
              className="rounded-2xl p-6 flex flex-col gap-4 border"
              style={{
                background: `linear-gradient(180deg, ${alt.accent}14, transparent)`,
                borderColor: `${alt.accent}33`,
              }}
            >
              <div
                className="flex items-center justify-center h-10 w-10 rounded-xl"
                style={{ background: `${alt.accent}22`, color: alt.accent }}
              >
                <alt.icon size={19} strokeWidth={1.7} />
              </div>
              <h2 className="text-base font-sans font-semibold tracking-tight">
                {alt.title}
              </h2>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {alt.body}
              </p>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="max-w-3xl mx-auto w-full flex items-center gap-3 flex-wrap pt-8 border-t border-border/60">
          <Link href="/docs/components">
            <Button variant="inverted" size="lg">
              See every system <IconChevronRight />
            </Button>
          </Link>
          <Link href="/pricing">
            <Button variant="outline" size="lg">
              View pricing
            </Button>
          </Link>
        </div>
      </Wrapper>
    </div>
  );
}

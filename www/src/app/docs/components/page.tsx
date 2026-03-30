import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { DocsCanvas } from "@/registry/docs/docs-canvas";
import { DocsContent } from "@/registry/docs/docs-content";
import { DocsNavigation } from "@/registry/docs/docs-navigation";
import { DocsSection } from "@/registry/docs/docs-section";
import { DocsTypography } from "@/registry/docs/docs-typography";
import { IconArrowRight, IconClock, IconFlame } from "@tabler/icons-react";

const systems = [
  {
    name: "Product Tour",
    description:
      "Pointer positioning, tooltip logic, step state, skip/resume — fully engineered.",
    status: "Building",
    tag: "Most requested",
    icon: IconFlame,
  },
  {
    name: "Multi-step Form",
    description:
      "State machine, per-step validation, back/forward navigation, progress persistence.",
    status: "Building",
    tag: null,
    icon: null,
  },
  {
    name: "Onboarding Checklist",
    description:
      "Completion tracking, step logic, expandable items, persistent state.",
    status: "Building",
    tag: null,
    icon: null,
  },
  {
    name: "Command Palette",
    description:
      "Fuzzy search, keyboard navigation, grouped actions, async results.",
    status: "Planned",
    tag: null,
    icon: null,
  },
  {
    name: "Notification Center",
    description: "Real-time updates, read/unread state, grouping, persistence.",
    status: "Planned",
    tag: null,
    icon: null,
  },
  {
    name: "File Upload",
    description:
      "Drag-and-drop, multi-file, progress tracking, preview, error recovery.",
    status: "Planned",
    tag: null,
    icon: null,
  },
];

export default function ComponentsPage() {
  return (
    <DocsCanvas
      tocs={[
        { label: "What is a system?", href: "system" },
        { label: "All systems", href: "allSystem" },
        { label: "Get early access", href: "earlyAcess" },
      ]}
      className="flex flex-1 min-w-0"
    >
      {/* Main content */}
      <DocsContent>
        {/* Header */}
        <DocsSection id="system">
          <div className="flex flex-col gap-3 mb-10">
            <Badge
              variant="secondary"
              className="w-fit bg-primary/10 text-primary text-sm px-2.5 py-3 gap-1.5"
            >
              <IconClock size={11} strokeWidth={2} />
              Coming soon
            </Badge>

            <DocsTypography
              as="h1"
              className="text-3xl font-semibold tracking-tight font-sans"
            >
              Components Systems
            </DocsTypography>

            <DocsTypography fSize={"base"}>
              Bevel ships fully-engineered UI systems — not just components.
              Each system solves the hard architecture so you don't have to.
              Copy it into your codebase, own it forever.
            </DocsTypography>

            <div className="mt-1 h-px bg-border/60" />
          </div>

          {/* What is a system */}
          <div className="mb-10 flex flex-col gap-3">
            <DocsTypography as="h2" fSize={"lg"}>
              What is a system?
            </DocsTypography>
            <DocsTypography fSize={"sm"}>
              A component gives you a button. A system gives you the entire
              multi-step form — state machine, validation, back/forward
              navigation, error recovery, progress persistence. Every edge case
              already handled. Every architectural decision already made.
            </DocsTypography>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-1">
              {[
                {
                  label: "No installs",
                  desc: "Copy the code directly into your project.",
                },
                {
                  label: "No lock-in",
                  desc: "You own the code. Modify anything.",
                },
                {
                  label: "shadcn compatible",
                  desc: "Builds on top of what you already have.",
                },
              ].map((item) => (
                <div
                  key={item.label}
                  className="flex flex-col gap-1 p-4 rounded-xl border border-border/60 bg-muted/20"
                >
                  <span className="text-sm font-medium">{item.label}</span>
                  <span className="text-xs text-muted-foreground leading-relaxed">
                    {item.desc}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </DocsSection>
        <DocsSection id="allSystem">
          {/* Systems list */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center justify-between mb-1">
              <DocsTypography className="text-lg font-medium tracking-tight">
                All systems
              </DocsTypography>
              <span className="text-xs text-muted-foreground">
                {systems.filter((s) => s.status === "Building").length} building
                · {systems.filter((s) => s.status === "Planned").length} planned
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-2">
              {systems.map((system) => {
                const SystemIcon = system.icon;
                return (
                  <div
                    key={system.name}
                    className="group flex items-start justify-between gap-4 p-4 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/30 hover:border-border transition-all duration-150 cursor-default"
                  >
                    <div className="flex flex-col gap-1.5 flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">
                          {system.name}
                        </span>
                        {system.tag && (
                          <Badge className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-rose-500/15 text-rose-500">
                            {SystemIcon && (
                              <SystemIcon size={10} strokeWidth={2.5} />
                            )}
                            {system.tag}
                          </Badge>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {system.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 pt-0.5">
                      <span
                        className={cn(
                          "text-[10px] font-medium px-2.5 py-1 rounded-full",
                          system.status === "Building"
                            ? "bg-primary/15 text-primary"
                            : "bg-muted text-muted-foreground border border-border/60",
                        )}
                      >
                        {system.status}
                      </span>
                      <IconArrowRight
                        size={13}
                        strokeWidth={1.8}
                        className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </DocsSection>
        <DocsSection id="earlyAcess">
          {/* Email capture */}
          <div className="mt-12 flex flex-col gap-3 p-6 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex flex-col gap-1">
              <span className="text-sm font-medium">Get early access</span>
              <span className="text-xs text-muted-foreground">
                Be the first to know when systems ship.
              </span>
            </div>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-9 flex-1 max-w-sm px-3 text-sm rounded-lg border border-border bg-background focus:outline-none focus:ring-1 focus:ring-ring"
              />
              <Button
                variant="inverted"
                className="h-9 px-4 text-sm cursor-pointer"
              >
                Notify me
              </Button>
            </div>
          </div>
        </DocsSection>

        {/* Prev / Next */}
        <DocsNavigation/>
      </DocsContent>

      {/* Right TOC */}
    </DocsCanvas>
  );
}

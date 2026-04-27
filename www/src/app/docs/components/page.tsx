import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DocsCanvas } from "@/components/bevelui/docs/docs-canvas";
import { DocsContent } from "@/components/bevelui/docs/docs-content";
import { DocsPageHeader } from "@/components/bevelui/docs/docs-page-header";
import { DocsNavigation } from "@/components/bevelui/docs/docs-navigation";
import { DocsCallout } from "@/components/bevelui/docs/docs-callout";
import { cn } from "@/lib/utils";
import {
  IconArrowRight,
  IconFlame,
  IconRocket,
  IconTerminal2,
} from "@tabler/icons-react";
import { docsComponentsMetadata } from "@/lib/metadata";
export const metadata = docsComponentsMetadata;
const systems = [
  {
    name: "Product Tour",
    href: "/docs/components/product-tour",
    description:
      "Guide users through your app with an animated overlay, smart-positioned tooltip cards, media support, and keyboard navigation.",
    status: "Building",
    tag: "Most requested",
    icon: IconFlame,
    install: "npx shadcn@latest add https://bevelui.com/r/tour.json",
  },
  {
    name: "Command Palette",
    href: "/docs/components/command-palette",
    description:
      "⌘K command menu with fuzzy search, two-tier tab filtering, grouped results, avatar support, and zero external dependencies.",
    status: "Building",
    tag: null,
    icon: null,
    install: "npx shadcn@latest add https://bevelui.com/r/command-palette.json",
  },
  {
    name: "File Upload",
    href: "/docs/components/file-upload",
    description:
      "Drag-and-drop file upload with per-file progress, cancel, retry, grid/list views, and a modal mode. Bring your own upload function.",
    status: "Building",
    tag: null,
    icon: null,
    install: "npx shadcn@latest add https://bevelui.com/r/file-upload.json",
  },
  {
    name: "Form Engine",
    href: "/docs/components/form-engine",
    description:
      "Multi-step or single-step form orchestration. Plugin system, react-hook-form + zod integration, conditional fields, custom layouts.",
    status: "Building",
    tag: null,
    icon: null,
    install: "npx shadcn@latest add https://bevelui.com/r/form-engine.json",
  },
];

const tocs = [
  { id: "what-is-a-system", label: "What is a system?", depth: 1 as const },
  { id: "all-systems", label: "All systems", depth: 1 as const },
  { id: "early-access", label: "Get notified", depth: 1 as const },
];

export default function ComponentsPage() {
  return (
    <DocsCanvas tocs={tocs}>
      <DocsContent>
        {/* Header */}
        <DocsPageHeader
          title="Systems"
          description="Bevel doesn't ship components — it ships systems. Each one is a complete, production-ready solution to a hard UI engineering problem. Copy it into your project, own it forever."
          badge="In development"
        />

        {/* What is a system */}
        <section
          id="what-is-a-system"
          className="flex flex-col gap-4 scroll-mt-20"
        >
          <h2 className="text-xl font-semibold tracking-tight">
            What is a system?
          </h2>
          <p className="text-sm text-muted-foreground leading-relaxed">
            A component library gives you primitives — inputs, buttons, cards.
            You still have to architect everything yourself. A Bevel system
            gives you the solved problem. The state machine is already written.
            The edge cases are already handled. The architectural decisions are
            already made. You just drop it in.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                label: "No installs",
                desc: "Copy the source into your project. No npm package to upgrade.",
              },
              {
                label: "No lock-in",
                desc: "You own the code. Change anything. Style it your way.",
              },
              {
                label: "shadcn compatible",
                desc: "Built on the same primitives. Drops into your existing setup.",
              },
            ].map((item) => (
              <div
                key={item.label}
                className="flex flex-col gap-1.5 p-4 rounded-xl border border-border/60 bg-muted/20"
              >
                <span className="text-sm font-medium">{item.label}</span>
                <span className="text-xs text-muted-foreground leading-relaxed">
                  {item.desc}
                </span>
              </div>
            ))}
          </div>

          <DocsCallout variant="tip" title="Install with shadcn">
            Every Bevel system installs via a single shadcn CLI command. No
            custom tooling required.
          </DocsCallout>
        </section>

        {/* Systems list */}
        <section id="all-systems" className="flex flex-col gap-4 scroll-mt-20">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold tracking-tight">
              All systems
            </h2>
            <span className="text-xs text-muted-foreground">
              {systems.filter((s) => s.status === "Building").length} building
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            {systems.map((system) => {
              const Icon = system.icon;
              return (
                <a
                  key={system.name}
                  href={system.href}
                  className="group flex flex-col gap-3 p-5 rounded-xl border border-border/60 bg-muted/10 hover:bg-muted/30 hover:border-border transition-all duration-150"
                >
                  {/* Header row */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex flex-col gap-1">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold">
                          {system.name}
                        </span>
                        {system.tag && (
                          <span className="inline-flex items-center gap-1 text-[10px] font-medium px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                            {Icon && <Icon size={10} strokeWidth={2.5} />}
                            {system.tag}
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">
                        {system.description}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span className="text-[10px] font-medium px-2.5 py-1 rounded-full bg-primary/15 text-primary whitespace-nowrap">
                        {system.status}
                      </span>
                      <IconArrowRight
                        size={13}
                        strokeWidth={1.8}
                        className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors"
                      />
                    </div>
                  </div>

                  {/* Install command */}
                  <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-background border border-border/60 font-mono text-[11px] text-muted-foreground">
                    <IconTerminal2
                      size={12}
                      strokeWidth={1.8}
                      className="shrink-0"
                    />
                    <span className="truncate">{system.install}</span>
                  </div>
                </a>
              );
            })}
          </div>
        </section>

        {/* Early access */}
        <section id="early-access" className="scroll-mt-20">
          <div className="flex flex-col gap-3 p-6 rounded-xl border border-primary/20 bg-primary/5">
            <div className="flex items-center gap-2">
              <IconRocket
                size={16}
                strokeWidth={1.8}
                className="text-primary"
              />
              <span className="text-sm font-semibold">
                Get notified when systems ship
              </span>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              All four systems are in active development. Drop your email and
              you'll be the first to know.
            </p>
            <div className="flex items-center gap-2">
              <Input
                type="email"
                placeholder="your@email.com"
                className="h-9 flex-1 max-w-sm text-sm"
              />
              <Button
                variant="inverted"
                className="h-9 px-4 text-sm cursor-pointer shrink-0"
              >
                Notify me
              </Button>
            </div>
          </div>
        </section>

        <DocsNavigation
          prev={{ label: "Quick start", href: "/docs/quick-start" }}
          next={{
            label: "Product Tour",
            href: "/docs/components/product-tour",
          }}
        />
      </DocsContent>
    </DocsCanvas>
  );
}

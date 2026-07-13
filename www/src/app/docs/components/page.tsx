import { Badge } from "@/components/ui/badge";

import { DocsCanvas } from "@/components/bevelui/docs/docs-canvas";
import { DocsContent } from "@/components/bevelui/docs/docs-content";
import { DocsPageHeader } from "@/components/bevelui/docs/docs-page-header";
import { DocsNavigation } from "@/components/bevelui/docs/docs-navigation";
import { DocsCallout } from "@/components/bevelui/docs/docs-callout";
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
    badge: "Components System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/tour.json",
  },
  {
    name: "Command Palette",
    href: "/docs/components/command-palette",
    description:
      "⌘K command menu with fuzzy search, two-tier tab filtering, grouped results, avatar support, and zero external dependencies.",
    badge: "Components System",
    install:
      "npx shadcn@latest add https://bevelui.vercel.app/r/command-palette.json",
  },
  {
    name: "File Upload",
    href: "/docs/components/file-upload",
    description:
      "Drag-and-drop file upload with per-file progress, cancel, retry, grid/list views, and a modal mode. Bring your own upload function.",
    badge: "Components System",
    install:
      "npx shadcn@latest add https://bevelui.vercel.app/r/file-upload.json",
  },
  {
    name: "Form Engine",
    href: "/docs/components/form-engine",
    description:
      "Multi-step or single-step form orchestration. Plugin system, react-hook-form + zod integration, conditional fields, custom layouts.",
    badge: "System",
    install:
      "npx shadcn@latest add https://bevelui.vercel.app/r/form-engine.json",
  },
  {
    name: "Onboarding Checklist",
    href: "/docs/components/checklist",
    description:
      "A floating checklist widget with step dependencies, localStorage persistence, and animated expand/collapse.",
    badge: "Components System",
    install:
      "npx shadcn@latest add https://bevelui.vercel.app/r/checklist.json",
  },
  {
    name: "Image Cropper",
    href: "/docs/components/cropper",
    description:
      "Dual coordinate spaces, eight-handle drag with aspect ratio enforcement, rule-of-thirds overlay, and offscreen canvas export at full image resolution.",
    badge: "Pro System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/cropper.json",
  },
  {
    name: "Collaborative Cursors",
    href: "/docs/components/cursors",
    description:
      "Real-time presence overlay with conflict-free position sync, idle detection, and a label overlap resolver that prevents names from stacking.",
    badge: "Pro System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/cursors.json",
  },
  {
    name: "Media Gallery",
    href: "/docs/components/gallery",
    description:
      "A selectable media grid for images, video, audio, and documents. Multi-select, type filtering, keyboard-navigable lightbox, and drag-to-reorder.",
    badge: "Components System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/gallery.json",
  },
  {
    name: "Kanban",
    href: "/docs/components/kanban",
    description:
      "Multi-container drag-and-drop board with virtual state machine. Drag cards between columns, reorder columns, live placeholders during drag.",
    badge: "Components System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/kanban.json",
  },
  {
    name: "Palette Editor",
    href: "/docs/components/palette",
    description:
      "Visual color palette editor with a 2D HSV picker, sortable swatches, and one-click export to hex, CSS vars, Tailwind config, or HSL.",
    badge: "Components System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/palette.json",
  },
  {
    name: "Properties Panel",
    href: "/docs/components/properties-panel",
    description:
      "Figma-style properties panel with collapsible sections, typed control rows, and a data-driven or headless API.",
    badge: "Components System",
    install:
      "npx shadcn@latest add https://bevelui.vercel.app/r/properties-panel.json",
  },
  {
    name: "Resizable Panel",
    href: "/docs/components/resizable",
    description:
      "Split-pane layouts with smooth drag-to-resize, min/max constraints, and collapsible panels. Zero re-renders during drag.",
    badge: "Components System",
    install:
      "npx shadcn@latest add https://bevelui.vercel.app/r/resizable.json",
  },
  {
    name: "Sortable",
    href: "/docs/components/sortable",
    description:
      "Headless drag-to-reorder system. Wrap any list, mark rows, optionally restrict drag to a handle. useSortableList manages the array.",
    badge: "Components System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/sortable.json",
  },
  {
    name: "Spotlight Search",
    href: "/docs/components/spotlight",
    description:
      "Async content search with category tabs, recent history, and rich result cards. Triggered by / — distinct from Command Palette.",
    badge: "Components System",
    install:
      "npx shadcn@latest add https://bevelui.vercel.app/r/spotlight.json",
  },
  {
    name: "Tree View",
    href: "/docs/components/tree",
    description:
      "Recursive hierarchical data with expand/collapse, multi‑select, full keyboard navigation, and optional connecting lines.",
    badge: "Components System",
    install: "npx shadcn@latest add https://bevelui.vercel.app/r/tree.json",
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
              {systems.length} available
            </span>
          </div>

          <div className="grid lg:grid-cols-2 gap-3">
            {systems.map((system) => (
              <a
                key={system.name}
                href={system.href}
                className="group flex flex-col gap-3 p-5 rounded-xl border border-border/60 bg-muted/30 hover:border-border transition-all duration-150"
              >
                {/* Header row */}
                <div className="flex items-start justify-between gap-4">
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-semibold">
                        {system.name}
                      </span>
                      {system.badge && (
                        <Badge
                          variant={
                            system.badge === "Pro System"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[10px] font-medium uppercase tracking-wide px-2 py-0 h-auto"
                        >
                          {system.badge}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {system.description}
                    </p>
                  </div>

                  <IconArrowRight
                    size={13}
                    strokeWidth={1.8}
                    className="text-muted-foreground/40 group-hover:text-muted-foreground transition-colors shrink-0 mt-1"
                  />
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
            ))}
          </div>
        </section>

        <DocsNavigation
          prev={{ label: "Quick start", href: "/docs/installation" }}
          next={{
            label: "Product Tour",
            href: "/docs/components/product-tour",
          }}
        />
      </DocsContent>
    </DocsCanvas>
  );
}

import { DocsCanvas } from "@/components/bevelui/docs/docs-canvas";
import { DocsContent } from "@/components/bevelui/docs/docs-content";
import { DocsPageHeader } from "@/components/bevelui/docs/docs-page-header";
import { DocsNavigation } from "@/components/bevelui/docs/docs-navigation";
import { DocsCallout } from "@/components/bevelui/docs/docs-callout";
import { DocsSystemsGrid } from "@/components/bevelui/docs/docs-systems-grid";
import { docsComponentsMetadata } from "@/content/docs/manifest";

export const metadata = docsComponentsMetadata;


const tocs = [
  { id: "what-is-a-system", label: "What is a system?", depth: 1 as const },
  { id: "all-systems", label: "All systems", depth: 1 as const },
];

export default function ComponentsPage() {
  return (
    <DocsCanvas tocs={tocs}>
      <DocsContent>
        {/* Header */}
        <DocsPageHeader
          title="Systems"
          description="Bevel doesn't ship raw primitives — it ships systems. Each one is a complete, production-ready solution to a complex UI engineering problem. Copy it into your project, own it forever."
          badge="15 Systems Available"
        />

        {/* What is a system */}
        <section
          id="what-is-a-system"
          className="flex flex-col gap-4 scroll-mt-20 my-4"
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

        {/* Systems list grid */}
        <section id="all-systems" className="flex flex-col gap-4 scroll-mt-20 my-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold tracking-tight">
              Browse Systems
            </h2>
          </div>

          <DocsSystemsGrid />
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

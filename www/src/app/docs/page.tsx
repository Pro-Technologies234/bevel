import * as React from "react";
import { DocsCanvas } from "@/components/bevelui/docs/docs-canvas";
import { DocsContent } from "@/components/bevelui/docs/docs-content";
import { DocsTypography } from "@/components/bevelui/docs/docs-typography";
import { DOCS_SYSTEMS, getTierBadge } from "@/content/docs/manifest";
import Link from "next/link";
import { IconArrowRight, IconSparkles, IconRocket } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export default function DocsLandingPage() {
  const newSystems = DOCS_SYSTEMS.filter(
    (s) => s.tier === "new" || s.tier === "updated",
  );

  return (
    <DocsCanvas>
      <DocsContent>
        {/* Hero Section */}
        <div className="flex flex-col items-center text-center gap-6 py-12 md:py-16 border-b border-border/40">
          <Badge
            variant="secondary"
            className="w-fit bg-primary/10 text-primary hover:bg-primary/20 border-none px-3 py-1 text-xs"
          >
            <IconSparkles size={14} className="mr-1.5 inline-block" /> Bevel UI
            Documentation
          </Badge>
          <div className="w-full flex flex-col  gap-4">
            <h1 className="text-4xl md:text-5xl tracking-tight text-foreground">
              Build stunning, interactive product interfaces.
            </h1>
            <p className="text-lg text-muted-foreground max-w-3xl leading-relaxed mx-auto">
              Bevel UI is a collection of high-craft, copy-and-paste React
              components that feel native and perform beautifully. Built on top
              of framer-motion, Tailwind CSS, and shadcn/ui.
            </p>
          </div>
          <div className="flex items-center gap-4 mt-2">
            <Button asChild size="lg" className=" px-6 gap-2">
              <Link href="/docs/introduction">
                Get Started
                <IconArrowRight size={16} />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className=" px-6">
              <Link href="/docs/components">Browse Components</Link>
            </Button>
          </div>
        </div>

        {/* What's New / Changelog */}
        <div className="py-12 border-b border-border/40">
          <div className="flex items-center gap-2 mb-8">
            <div className="p-2 bg-primary/10 rounded-lg">
              <IconRocket size={20} className="text-primary" />
            </div>
            <DocsTypography as="h2" className="border-none pl-0 mb-0">
              What's New
            </DocsTypography>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {newSystems.map((system) => {
              const badgeInfo = getTierBadge(system.tier);
              return (
                <Link
                  key={system.route}
                  href={`/docs/components/${system.route}`}
                  className="group flex flex-col gap-3 p-5 rounded-xl border border-border/60 bg-muted/20 hover:bg-muted/40 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      {system.icon && (
                        <system.icon
                          size={18}
                          className="text-foreground/70 group-hover:text-primary transition-colors"
                        />
                      )}
                      <span className="font-semibold text-foreground">
                        {system.title}
                      </span>
                    </div>
                    {badgeInfo && (
                      <Badge className="bg-primary/20 text-primary border-none shadow-none uppercase tracking-wider text-[10px]">
                        {badgeInfo.label}
                      </Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
                    {system.description}
                  </p>
                </Link>
              );
            })}
          </div>
        </div>

        {/* Categories / Explore */}
        <div className="py-12">
          <DocsTypography as="h2" className="border-none pl-0 mb-8">
            Explore by Category
          </DocsTypography>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {[
              { id: "navigation-search", label: "Navigation" },
              { id: "forms-input", label: "Forms & Input" },
              { id: "drag-drop", label: "Drag & Drop" },
              { id: "layout-panels", label: "Layout" },
              { id: "media-color", label: "Media & Color" },
              { id: "collaboration", label: "Collaboration" },
            ].map((cat) => (
              <Link
                key={cat.id}
                href="/docs/components"
                className="flex items-center justify-between p-4 rounded-lg border border-border/40 hover:border-border hover:bg-muted/30 transition-all group"
              >
                <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                  {cat.label}
                </span>
                <IconArrowRight
                  size={14}
                  className="text-muted-foreground/40 group-hover:text-primary group-hover:translate-x-1 transition-all"
                />
              </Link>
            ))}
          </div>
        </div>
      </DocsContent>
    </DocsCanvas>
  );
}

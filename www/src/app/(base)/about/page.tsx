import Link from "next/link";
import {
  IconBoltFilled,
  IconChevronRight,
  IconBox,
  IconGitFork,
  IconStack2,
} from "@tabler/icons-react";
import { Wrapper } from "@/components/shared/wrapper";
import { PageHero } from "@/components/shared/page-hero";
import { Button } from "@/components/ui/button";
import { aboutMetadata } from "@/lib/metadata";
import { DOCS_SYSTEMS, DOCS_CATEGORIES } from "@/content/docs/manifest";

export const metadata = aboutMetadata;

const STACK = [
  "React",
  "TypeScript",
  "Tailwind CSS",
  "Motion",
  "@dnd-kit",
  "@floating-ui/react",
  "react-hook-form",
  "Zod",
];

export default function AboutPage() {
  return (
    <div>
      <PageHero
        eyebrow="About Bevel UI"
        title="UI systems, built by someone tired of rebuilding them."
        description="Bevel UI started as the same five components I kept rewriting on every project — a command palette, a file uploader, a multi-step form — rebuilt properly once, and shipped so nobody else has to redo that work either."
      />

      <Wrapper className="max-w-4xl mx-auto pb-24 gap-6 flex flex-col">
        {/* Philosophy + distribution — two colored cards, side by side */}
        <div className="grid md:grid-cols-2 gap-4">
          <div className="rounded-2xl p-7 flex flex-col gap-4 bg-linear-to-br from-indigo-500/10 to-transparent border border-indigo-500/20">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-indigo-500/15 text-indigo-400">
              <IconBox size={19} strokeWidth={1.7} />
            </div>
            <h2 className="text-lg font-sans font-semibold tracking-tight">
              Not a component library
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Most UI libraries stop at the primitive — a styled button, a
              dropdown, a dialog. The hard part is the fifteenth edge case in a
              file upload state machine, or the keyboard nav in a command
              palette. Bevel packages the whole system — state, accessibility,
              edge cases — not just the surface.
            </p>
          </div>

          <div className="rounded-2xl p-7 flex flex-col gap-4 bg-linear-to-br from-primary/10 to-transparent border border-primary/20">
            <div className="flex items-center justify-center h-10 w-10 rounded-xl bg-primary/15 text-primary">
              <IconGitFork size={19} strokeWidth={1.7} />
            </div>
            <h2 className="text-lg font-sans font-semibold tracking-tight">
              Copy-to-own, on purpose
            </h2>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Every system installs through the shadcn CLI. Bevel never sits
              in your{" "}
              <code className="font-mono text-xs bg-muted/40 px-1.5 py-0.5 rounded">
                node_modules
              </code>
              , never forces an upgrade. The code you get is yours — read it,
              delete what you don't need, change the rest.
            </p>
          </div>
        </div>

        {/* Tech stack strip */}
        <div className="rounded-2xl border border-border/60 bg-muted/10 p-6 flex flex-col gap-3">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
            Built with
          </span>
          <div className="flex flex-wrap gap-2">
            {STACK.map((tech) => (
              <span
                key={tech}
                className="text-xs font-mono px-2.5 py-1 rounded-md border border-border/60 bg-background text-muted-foreground"
              >
                {tech}
              </span>
            ))}
          </div>
        </div>

        {/* Where things stand — big stat */}
        <div className="rounded-2xl border border-border/60 p-7 flex flex-col sm:flex-row sm:items-center gap-6">
          <div className="flex items-center justify-center h-14 w-14 rounded-2xl bg-primary/10 text-primary shrink-0">
            <IconStack2 size={26} strokeWidth={1.6} />
          </div>
          <div>
            <p className="text-sm text-muted-foreground leading-relaxed">
              Bevel UI is in beta and shipping steadily —{" "}
              <span className="text-foreground font-semibold text-base">
                {DOCS_SYSTEMS.length} systems
              </span>{" "}
              live today across{" "}
              <span className="text-foreground font-medium">
                {DOCS_CATEGORIES.length} categories
              </span>
              , from navigation and forms to drag-and-drop and media tooling.
              Beta means the API surface can still shift as new systems land —
              not that what's shipped today is unfinished. Every documented
              system has a live demo and a full props reference.
            </p>
          </div>
        </div>

        {/* Who's building it */}
        <div className="rounded-2xl border border-border/60 bg-muted/10 p-7">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 block mb-3">
            Who's building it
          </span>
          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
            Bevel UI is built by{" "}
            <a
              href="https://x.com/EgaamPoyeKitoye"
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground underline underline-offset-4 hover:text-primary"
            >
              Poye Kitoye
            </a>
            . It's an independent project, not a venture-backed team with a
            roadmap deck — which means every system in the docs is one that's
            actually been built and used, not promised.
          </p>
        </div>

        {/* CTA */}
        <div className="flex items-center gap-3 flex-wrap pt-6 border-t border-border/60">
          <Link href="/docs/components">
            <Button variant="inverted" size="lg">
              Browse systems <IconChevronRight />
            </Button>
          </Link>
          <Link href="/docs/introduction">
            <Button size="lg">
              <IconBoltFilled /> Read the docs <IconChevronRight />
            </Button>
          </Link>
        </div>
      </Wrapper>
    </div>
  );
}

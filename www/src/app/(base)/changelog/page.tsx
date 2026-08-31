import Link from "next/link";
import { IconArrowUpRight, IconSparkles, IconRefresh } from "@tabler/icons-react";
import { Wrapper } from "@/components/shared/wrapper";
import { PageHero } from "@/components/shared/page-hero";
import { Badge } from "@/components/ui/badge";
import { changelogMetadata } from "@/lib/metadata";
import { DOCS_SYSTEMS, getSystemHref } from "@/content/docs/manifest";

export const metadata = changelogMetadata;

const TODAY = new Date().toLocaleDateString("en-US", {
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function ChangelogPage() {
  const newSystems = DOCS_SYSTEMS.filter((s) => s.tier === "new");
  const updatedSystems = DOCS_SYSTEMS.filter((s) => s.tier === "updated");
  const betaSystems = DOCS_SYSTEMS.filter((s) => s.tier === "beta");

  return (
    <div>
      <PageHero
        eyebrow="Changelog"
        title="What's new, updated, and shipping."
        description="Bevel doesn't have a marketing team writing release notes for changes that didn't happen. This page tracks what's actually true right now — pulled straight from the same manifest that powers the docs."
      />

      <Wrapper className="max-w-3xl mx-auto pb-24 flex flex-col gap-10">
        {/* Current snapshot */}
        <div className="rounded-2xl border border-border/60 overflow-hidden">
          <div className="flex items-center justify-between gap-3 px-6 py-4 bg-muted/30 border-b border-border/60">
            <span className="text-sm font-semibold">Latest</span>
            <span className="text-xs text-muted-foreground font-mono">{TODAY}</span>
          </div>

          <div className="p-6 flex flex-col gap-8">
            {newSystems.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-primary/15 text-primary">
                    <IconSparkles size={12} />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                    New systems
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {newSystems.map((s) => (
                    <li key={s.registryName}>
                      <Link
                        href={getSystemHref(s.route)}
                        className="group flex items-center justify-between gap-3 text-sm rounded-lg px-3 py-2 -mx-3 hover:bg-muted/30 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{s.title}</span>
                          <span className="text-muted-foreground text-xs hidden sm:inline">
                            — {s.description}
                          </span>
                        </span>
                        <IconArrowUpRight
                          size={13}
                          className="text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {updatedSystems.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-6 w-6 rounded-md bg-indigo-500/15 text-indigo-400">
                    <IconRefresh size={12} />
                  </div>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                    Updated
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {updatedSystems.map((s) => (
                    <li key={s.registryName}>
                      <Link
                        href={getSystemHref(s.route)}
                        className="group flex items-center justify-between gap-3 text-sm rounded-lg px-3 py-2 -mx-3 hover:bg-muted/30 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{s.title}</span>
                          <span className="text-muted-foreground text-xs hidden sm:inline">
                            — {s.description}
                          </span>
                        </span>
                        <IconArrowUpRight
                          size={13}
                          className="text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {betaSystems.length > 0 && (
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <Badge variant="destructive" className="text-[9px] px-1.5 py-0 h-4">
                    Beta
                  </Badge>
                  <span className="text-xs font-mono uppercase tracking-widest text-muted-foreground/60">
                    In beta
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {betaSystems.map((s) => (
                    <li key={s.registryName}>
                      <Link
                        href={getSystemHref(s.route)}
                        className="group flex items-center justify-between gap-3 text-sm rounded-lg px-3 py-2 -mx-3 hover:bg-muted/30 transition-colors"
                      >
                        <span className="flex items-center gap-2">
                          <span className="font-medium">{s.title}</span>
                          <span className="text-muted-foreground text-xs hidden sm:inline">
                            — {s.description}
                          </span>
                        </span>
                        <IconArrowUpRight
                          size={13}
                          className="text-muted-foreground/40 group-hover:text-foreground transition-colors shrink-0"
                        />
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <p className="text-xs text-muted-foreground/50 text-center leading-relaxed">
          Changelog tracking starts here. Every future system, tier change, and
          breaking change gets logged as it ships — no backfilled history.
        </p>
      </Wrapper>
    </div>
  );
}

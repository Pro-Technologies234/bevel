"use client";

import { useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { motion, AnimatePresence } from "motion/react";
import Link from "next/link";
import { Wrapper } from "@/components/shared/wrapper";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

import { IconArrowUpRight } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { SYSTEMS } from "@/components/showcase";
import {
  DOCS_SYSTEMS,
  DOCS_CATEGORIES,
  getSystemHref,
  getTierBadge,
  type DocsCategoryId,
} from "@/content/docs/manifest";

gsap.registerPlugin(ScrollTrigger);

export default function Systems() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const [activeId, setActiveId] = useState(SYSTEMS[0].id);
  const active = SYSTEMS.find((s) => s.id === activeId)!;
  const [activeCategory, setActiveCategory] = useState<DocsCategoryId | "all">("all");
  const filteredSystems =
    activeCategory === "all"
      ? DOCS_SYSTEMS
      : DOCS_SYSTEMS.filter((s) => s.category === activeCategory);

  useGSAP(
    () => {
      gsap.fromTo(
        headingRef.current,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: headingRef.current,
            start: "top 82%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className="py-24">
      <Wrapper>
        {/* Heading */}
        <div
          ref={headingRef}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-14"
        >
          <div>
            <h2 className="text-3xl md:text-5xl font-sans font-semibold max-w-lg leading-tight tracking-tight">
              Things you won&apos;t
              <br />
              build from scratch.
            </h2>
          </div>
          <p className="text-muted-foreground text-sm max-w-xs leading-relaxed md:text-right shrink-0">
            Each system installs via the shadcn CLI. The source lands in your
            project. You own it.
          </p>
        </div>

        {/* Demo window */}
        <div className="min-h-[560px] w-full flex flex-col bg-muted/20 rounded-2xl overflow-hidden border border-border/60 not-md:hidden">
          {/* Window bar */}
          <div className="px-5 py-3 w-full flex items-center gap-2 bg-muted/30 border-b border-border/60 flex-wrap">
            {/* Traffic lights */}
            {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full shrink-0"
                style={{ background: c }}
              />
            ))}

            {/* System tabs */}
            <div className="flex-1 flex items-center gap-1 px-3 overflow-x-auto no-scrollbar">
              {SYSTEMS.map((s, i) => (
                <div key={s.id} className="flex items-center shrink-0">
                  <button
                    onClick={() => setActiveId(s.id)}
                    className={cn(
                      "px-3 py-1.5 rounded-md text-xs font-medium transition-colors whitespace-nowrap",
                      s.id === activeId
                        ? "bg-background text-foreground shadow-sm"
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                    )}
                  >
                    {s.title}
                  </button>
                  {i < SYSTEMS.length - 1 && (
                    <Separator
                      orientation="vertical"
                      className="h-4 mx-1 opacity-40"
                    />
                  )}
                </div>
              ))}
            </div>

            {/* Docs link */}
            <Link
              href={active.href}
              className="text-[11px] text-muted-foreground hover:text-foreground transition-colors flex items-center gap-1 shrink-0 ml-auto"
            >
              Docs <IconArrowUpRight size={11} />
            </Link>
          </div>

          <div className="flex flex-1 min-h-0">
            {/* Left — context panel */}
            <div className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/60 p-6 gap-5 bg-muted/10">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.15 }}
                  className="flex flex-col gap-4"
                >
                  <div>
                    <span
                      className="text-[10px] font-mono tracking-widest uppercase block mb-2"
                      style={{ color: active.accent, opacity: 0.8 }}
                    >
                      What it removes
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {active.painRemoved}
                    </p>
                  </div>

                  <div>
                    <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground/50 block mb-2">
                      What it is
                    </span>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      {active.what}
                    </p>
                  </div>

                  <code className="text-[10px] font-mono text-primary/70 bg-muted/30 px-2.5 py-2 rounded-lg block break-all leading-relaxed">
                    {active.cmd}
                  </code>

                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full text-xs gap-1.5 mt-auto"
                    asChild
                  >
                    <Link href={active.href}>
                      Read the docs <IconArrowUpRight size={11} />
                    </Link>
                  </Button>
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Right — demo */}
            <div className="flex-1 p-6 md:p-8 flex items-center justify-center overflow-hidden">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeId}
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.2 }}
                  className="w-full flex justify-center"
                >
                  {active.demo}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
        {/* Full catalog — every system in the manifest, not just the ones with a live demo above */}
        <div className="mt-10">
          <div className="flex items-center justify-between flex-wrap gap-3 mb-5">
            <p className="text-[11px] font-mono uppercase tracking-widest text-muted-foreground/50">
              The full catalog — {filteredSystems.length} of {DOCS_SYSTEMS.length} systems
            </p>
            <div className="flex items-center gap-1.5 flex-wrap">
              <button
                onClick={() => setActiveCategory("all")}
                className={cn(
                  "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border",
                  activeCategory === "all"
                    ? "bg-primary/10 border-primary/30 text-primary"
                    : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
                )}
              >
                All
              </button>
              {DOCS_CATEGORIES.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={cn(
                    "px-2.5 py-1 rounded-full text-[11px] font-medium transition-colors border whitespace-nowrap",
                    activeCategory === cat.id
                      ? "bg-primary/10 border-primary/30 text-primary"
                      : "border-border/60 text-muted-foreground hover:text-foreground hover:border-border",
                  )}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {filteredSystems.map((system) => {
              const badge = getTierBadge(system.tier);
              const Icon = system.icon;
              return (
                <Link
                  key={system.registryName}
                  href={getSystemHref(system.route)}
                  className="group flex items-start gap-3 rounded-xl border border-border/60 bg-muted/10 p-4 hover:border-primary/40 hover:bg-primary/5 transition-colors"
                >
                  {Icon && (
                    <div className="flex items-center justify-center h-8 w-8 rounded-lg bg-muted/60 group-hover:bg-primary/15 transition-colors shrink-0">
                      <Icon
                        size={16}
                        strokeWidth={1.6}
                        className="text-muted-foreground group-hover:text-primary transition-colors"
                      />
                    </div>
                  )}
                  <div className="min-w-0 flex flex-col gap-1">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-xs font-medium truncate">
                        {system.title}
                      </span>
                      {badge && (
                        <Badge
                          variant={
                            badge.variant === "pro"
                              ? "default"
                              : "secondary"
                          }
                          className="text-[9px] px-1 py-0 h-4"
                        >
                          {badge.label}
                        </Badge>
                      )}
                    </div>
                    <span className="text-[10px] text-muted-foreground/60 truncate">
                      {system.category.replace("-", " & ")}
                    </span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

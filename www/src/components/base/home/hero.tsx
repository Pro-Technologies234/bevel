"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Eyebrow } from "@/components/shared/eyebrow";
import { Button } from "@/components/ui/button";
import {
  IconBoltFilled,
  IconChevronRight,
  IconLayoutKanban,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  CommandPaletteIllustration,
  KanbanIllustration,
  PresenceIllustration,
  FloatingBubble,
} from "./illustrations";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);
  const collageRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      tl.from(badgeRef.current, { y: 30, opacity: 0 })
        .from(headingRef.current, { y: 40, opacity: 0 }, "-=0.4")
        .from(paragraphRef.current, { y: 40, opacity: 0 }, "-=0.4")
        .from(buttonsRef.current, { y: 30, opacity: 0 }, "-=0.3")
        .from(
          collageRef.current,
          { y: 40, opacity: 0, scale: 0.96, duration: 1 },
          "-=0.3",
        );
    },
    { scope: containerRef, revertOnUpdate: true },
  );

  return (
    <main
      ref={containerRef}
      className="relative flex flex-col items-center justify-center gap-4 overflow-hidden pt-32 pb-20 md:pt-40"
    >
      {/* Gradient glow field — replaces the old static photo background */}
      <div aria-hidden className="absolute inset-0 -z-10 select-none">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,rgba(194,241,60,0.12),transparent_55%)]" />
        <div className="absolute top-40 -left-24 h-72 w-72 rounded-full bg-indigo-500/15 blur-[100px]" />
        <div className="absolute top-56 -right-16 h-64 w-64 rounded-full bg-fuchsia-500/15 blur-[100px]" />
        <div
          className="absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage:
              "linear-gradient(currentColor 1px, transparent 1px), linear-gradient(90deg, currentColor 1px, transparent 1px)",
            backgroundSize: "56px 56px",
            maskImage:
              "radial-gradient(ellipse 60% 60% at 50% 20%, black 20%, transparent 100%)",
          }}
        />
      </div>

      <Eyebrow ref={badgeRef}>19 systems shipped — MIT licensed</Eyebrow>

      <h1
        ref={headingRef}
        className="text-4xl md:text-7xl font-sans font-medium max-w-xs md:max-w-2xl text-center tracking-tight text-balance"
      >
        The UI Systems Your App Actually Needs
      </h1>

      <p
        ref={paragraphRef}
        className="max-w-sm md:max-w-lg not-md:text-xs text-center text-muted-foreground"
      >
        Command palettes, kanban boards, form engines, file uploaders — the
        parts every serious app needs and nobody wants to build twice. Bevel
        ships them fully engineered. One CLI command drops the source into your
        repo. From there, it&apos;s just your code.
      </p>

      <div ref={buttonsRef} className="flex items-center gap-3 pt-2">
        <Link href="/docs/components">
          <Button variant="inverted" size="lg">
            <span>Browse Systems</span> <IconChevronRight />
          </Button>
        </Link>
        <Link href="/docs/introduction">
          <Button size="lg">
            <IconBoltFilled /> Read the docs <IconChevronRight />
          </Button>
        </Link>
      </div>

      {/* Floating collage — the same illustration language used in the Bento
          section below, introduced early so the hero doesn't read as a
          generic photo-background SaaS template. */}
      <div
        ref={collageRef}
        className="relative mt-14 w-full max-w-3xl px-6"
        style={{ willChange: "transform" }}
      >
        <div className="relative h-56 md:h-64">
          <CommandPaletteIllustration className="absolute left-1/2 top-0 w-64 md:w-72 -translate-x-[85%] rotate-[-4deg] shadow-2xl" />

          <div className="absolute left-1/2 top-6 -translate-x-[10%] rotate-[3deg] rounded-xl border border-white/10 bg-linear-to-br from-orange-600 to-orange-900 p-4 shadow-2xl">
            <div className="flex items-center gap-1.5 mb-3">
              <IconLayoutKanban size={13} className="text-white/70" />
              <span className="text-[10px] font-mono uppercase tracking-widest text-white/50">
                Kanban
              </span>
            </div>
            <KanbanIllustration />
          </div>

          <div className="absolute left-1/2 top-24 translate-x-[45%] rotate-[6deg] rounded-xl border border-white/10 bg-linear-to-br from-fuchsia-600 to-violet-900 p-4 shadow-2xl">
            <PresenceIllustration />
          </div>

          <FloatingBubble className="left-1/2 top-2 -translate-x-[140%] -rotate-12">
            <IconBoltFilled size={15} />
          </FloatingBubble>
        </div>
      </div>
    </main>
  );
}

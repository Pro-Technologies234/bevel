"use client";

/**
 * SECTION: Close
 *
 * WHAT THIS REPLACES AND WHY:
 *
 * The old Cta.tsx was visually identical to the hero — same badge, same background image,
 * same buttons, same brand icons. A developer scrolling to the bottom sees the same thing
 * they saw at the top and thinks they've gone in a circle.
 *
 * A closing section needs to feel like an arrival, not a repeat.
 * By the time someone reaches the bottom, they've read everything.
 * They don't need to be told what Bevel is again.
 * They need one clear reason to start right now.
 *
 * APPROACH:
 * - No hero image background
 * - No badge
 * - No repeated tagline
 * - Just: what do you do next, and what does that cost you?
 * Answer: nothing. You don't even need to sign up.
 *
 * The heading: "Start with the install command."
 * Not "Join thousands of developers." Not "The future of UI is here."
 * Just the most direct possible thing: here is what you do first.
 */

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import {
  IconBoltFilled,
  IconChevronRight,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { useState } from "react";
import { cn } from "@/lib/utils";

const INSTALL_CMD =
  "npx shadcn@latest add https://bevelui.pxxl.click/r/tour.json";

export default function Close() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);
  const [copied, setCopied] = useState(false);

  useGSAP(
    () => {
      gsap.fromTo(
        contentRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 1.1,
          ease: "power4.out",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 72%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  function copy() {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <section
      ref={sectionRef}
      className="relative py-32 overflow-hidden border-t border-border/60 z-1"
    >
      <div className="w-full absolute inset-0 -z-1 select-none">
        <img
          // ref={bgImageRef}
          src="/images/home/hero.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-12"
          style={{ willChange: "transform" }}
          loading="eager"
        />
      </div>

      <div
        ref={contentRef}
        className="relative z-10  mx-auto px-6 flex flex-col items-center text-center gap-8"
      >
        {/*
          THE HEADING CHANGE:
          Old CTA headline: "Ship the hard parts faster."
          → Inspirational but vague. What do I do with that?

          New: Tells them the literal first action to take.
          If you've read this far, you're ready to install.
        */}
        <div className="flex flex-col gap-3">
          <h2 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight leading-tight">
            Start with the <br /> install command.
          </h2>
          <p className="text-muted-foreground text-sm md:text-base leading-relaxed max-w-md mx-auto">
            No account. No signup. No lock-in. The code lands in your project
            the moment you run it.
          </p>
        </div>

        {/* Install command — the actual first action */}
        <div className="w-full max-w-md">
          <div
            className="flex items-center justify-between gap-3 bg-muted/30 rounded-lg p-2 px-4 border border-border/60 cursor-pointer group"
            onClick={copy}
          >
            <div className="flex items-center gap-2 min-w-0">
              <IconBoltFilled size={12} className="text-primary shrink-0" />
              <span className="font-mono text-xs text-primary truncate">
                {INSTALL_CMD}
              </span>
            </div>
            <button
              className={cn(
                "shrink-0 flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md transition-colors",
                copied
                  ? "text-primary bg-primary/10"
                  : "text-muted-foreground group-hover:text-foreground",
              )}
            >
              {copied ? (
                <IconCheck size={12} strokeWidth={2.5} />
              ) : (
                <IconCopy size={12} />
              )}
              {copied ? "Copied" : "Copy"}
            </button>
          </div>
          <p className="text-[11px] text-muted-foreground/50 mt-2">
            Installs the Product Tour. Swap{" "}
            <span className="font-mono">tour</span> for{" "}
            <span className="font-mono">command-palette</span>,{" "}
            <span className="font-mono">file-upload</span>, or{" "}
            <span className="font-mono">form-engine</span> for the others.
          </p>
        </div>

        {/* CTAs — same as hero but now they feel earned */}
        <div className="flex items-center gap-3 flex-wrap justify-center">
          <div className="relative">
            <GlowEffect
              colors={["#0894FF", "#C959DD", "#FF2E54", "#FF9004"]}
              mode="static"
              blur="medium"
              className="z-1 bottom-0 inset-x-0 top-8 h-2"
            />
            <Link href="/docs/components">
              <Button
                variant="inverted"
                className="text-xs font-semibold tracking-tight cursor-pointer rounded-full md:p-4.5 md:px-6"
              >
                <span className="z-1">Browse all systems</span>
                <IconChevronRight />
              </Button>
            </Link>
          </div>
          <Link href="/docs/introduction">
            <Button className="text-xs font-semibold tracking-tight cursor-pointer rounded-full md:p-4.5 md:px-6 relative bevel">
              <IconBoltFilled />
              Read the docs
              <IconChevronRight />
            </Button>
          </Link>
        </div>

        {/* Honest footnote — no overpromise */}
        <p className="text-[11px] text-muted-foreground/40 font-mono">
          Free · MIT licensed · shadcn compatible · No account required
        </p>
      </div>
    </section>
  );
}

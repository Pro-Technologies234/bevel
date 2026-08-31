"use client";

/**
 * SECTION: Close
 *
 * A closing section needs to feel like an arrival, not a repeat of the hero.
 * It's built as an inverted, rounded "slab" — bg-foreground/text-background,
 * which is black-on-white in light mode and white-on-black in dark mode —
 * the same device big consumer-fintech sites use for their closing band
 * (a full-bleed contrast block, not another soft gradient section).
 */

import { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Button } from "@/components/ui/button";
import { Wrapper } from "@/components/shared/wrapper";
import {
  IconBoltFilled,
  IconChevronRight,
  IconCopy,
  IconCheck,
} from "@tabler/icons-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

const INSTALL_CMD =
  "npx shadcn@latest add https://bevelui.vercel.app/r/tour.json";

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
            start: "top 78%",
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
    <section ref={sectionRef} className="py-16 md:py-24">
      <Wrapper>
        <div
          ref={contentRef}
          className="relative overflow-hidden rounded-3xl bg-foreground text-background py-20 md:py-28 px-6"
        >
          {/* Giant background wordmark, pinned to the inverted slab's own tokens */}
          <div
            aria-hidden
            className="absolute inset-x-0 bottom-0 select-none overflow-hidden leading-none pointer-events-none"
          >
            <span className="block text-center font-sans font-bold text-[16vw] tracking-tighter text-background/[0.06] whitespace-nowrap translate-y-[15%]">
              own it forever
            </span>
          </div>

          <div className="relative z-10 mx-auto flex flex-col items-center text-center gap-8">
            <div className="flex flex-col gap-3">
              <h2 className="text-3xl md:text-5xl font-sans font-semibold tracking-tight leading-tight">
                Start with the <br /> install command.
              </h2>
              <p className="text-background/60 text-sm md:text-base leading-relaxed max-w-md mx-auto">
                No account. No signup. No lock-in. The code lands in your
                project the moment you run it.
              </p>
            </div>

            {/* Install command */}
            <div className="w-full max-w-md">
              <div
                className="flex items-center justify-between gap-3 bg-background/10 rounded-lg p-2 px-4 border border-background/15 cursor-pointer group"
                onClick={copy}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <IconBoltFilled size={12} className="text-primary shrink-0" />
                  <span className="font-mono text-xs truncate">{INSTALL_CMD}</span>
                </div>
                <button
                  className={cn(
                    "shrink-0 flex items-center gap-1 text-[11px] font-mono px-2 py-1 rounded-md transition-colors",
                    copied
                      ? "text-primary bg-primary/15"
                      : "text-background/50 group-hover:text-background",
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
              <p className="text-[11px] text-background/40 mt-2">
                Installs the Product Tour. Swap{" "}
                <span className="font-mono">tour</span> for{" "}
                <span className="font-mono">command-palette</span>,{" "}
                <span className="font-mono">file-upload</span>, or{" "}
                <span className="font-mono">form-engine</span> for the others.
              </p>
            </div>

            {/* CTAs */}
            <div className="flex items-center gap-3 flex-wrap justify-center">
              <Link href="/docs/components">
                <Button
                  size="lg"
                  className="bg-primary text-primary-foreground hover:bg-primary/90"
                >
                  Browse all systems <IconChevronRight />
                </Button>
              </Link>
              <Link href="/docs/introduction">
                <Button
                  size="lg"
                  variant="outline"
                  className="border-background/20 bg-transparent text-background hover:bg-background/10 hover:text-background"
                >
                  <IconBoltFilled />
                  Read the docs
                  <IconChevronRight />
                </Button>
              </Link>
            </div>

            <p className="text-[11px] text-background/35 font-mono">
              Free · MIT licensed · shadcn compatible · No account required
            </p>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

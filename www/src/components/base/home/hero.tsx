"use client";

import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { GlowEffect } from "@/components/ui/glow-effect";
import {
  IconBoltFilled,
  IconBrandFramerMotion,
  IconBrandReact,
  IconBrandTailwind,
  IconBrandTypescript,
  IconChevronRight,
} from "@tabler/icons-react";
import Link from "next/link";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const bgImageRef = useRef<HTMLImageElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const paragraphRef = useRef<HTMLParagraphElement>(null);
  const buttonsRef = useRef<HTMLDivElement>(null);

  const brands = [
    { label: "React", icon: IconBrandReact },
    { label: "TypeScript", icon: IconBrandTypescript },
    { label: "Tailwind CSS", icon: IconBrandTailwind },
    { label: "Motion", icon: IconBrandFramerMotion },
  ];

  useGSAP(
    () => {
      // Background image scale – add force3D for GPU acceleration
      gsap.fromTo(
        bgImageRef.current,
        { scale: 1.5 },
        { scale: 1, duration: 2, ease: "power2.out", force3D: true },
      );

      // Staggered entrance
      const tl = gsap.timeline({
        defaults: { duration: 0.8, ease: "power3.out" },
      });

      tl.from(badgeRef.current, { y: 30, opacity: 0 })
        .from(headingRef.current, { y: 40, opacity: 0 }, "-=0.4")
        .from(paragraphRef.current, { y: 40, opacity: 0 }, "-=0.4")
        .from(buttonsRef.current, { y: 30, opacity: 0 }, "-=0.3")
        .from(
          ".brand-icon",
          {
            y: 20,
            opacity: 0,
            stagger: 0.1,
            duration: 0.6,
            ease: "back.out(1.2)",
          },
          "-=0.2",
        );
    },
    { scope: containerRef, revertOnUpdate: true },
  );
  return (
    <main
      ref={containerRef}
      className="h-172 flex items-center flex-col justify-center space-y-4 relative z-1"
    >
      <div className="w-full absolute inset-0 -z-1 select-none">
        <img
          ref={bgImageRef}
          src="/images/home/hero.jpg"
          alt="Hero Background"
          className="absolute inset-0 w-full h-full object-cover grayscale opacity-12"
          style={{ willChange: "transform" }}
          loading="eager"
        />
        {/* <div className=" absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent" /> */}
      </div>

      <Badge
        ref={badgeRef}
        variant="secondary"
        className="bg-muted/60 p-3 gap-2 text-[10px] uppercase select-none text-foreground/80"
      >
        <span className="h-1.5 w-1.5 rounded-full dark:bg-green-400 bg-green-600 relative">
          <span className="rounded-full dark:bg-green-400 bg-green-600 absolute inset-0 animate-ping"></span>
        </span>
        Engineering-first UI Systems
      </Badge>

      <h1
        ref={headingRef}
        className="text-3xl md:text-6xl font-sans font-medium max-w-xs md:max-w-xl text-center tracking-tight"
      >
        The UI Systems Your App Actually Needs
      </h1>

      <p
        ref={paragraphRef}
        className="max-w-sm md:max-w-lg not-md:text-xs text-center"
      >
        Bevel gives you fully-engineered, copy-to-own UI systems — not just
        components. Every system is built to drop straight into your codebase
        with no installs, no lock-in, and full shadcn compatibility.
      </p>

      <div ref={buttonsRef} className="flex items-center gap-4">
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
              className="md:p-4.5 text-xs font-semibold tracking-tight cursor-pointer rounded-full md:px-6"
            >
              <span className="z-1">Browse Systems</span> <IconChevronRight />
            </Button>
          </Link>
        </div>
        <Link href="/docs/introduction">
          <Button className="md:p-4.5 text-xs font-semibold tracking-tight cursor-pointer rounded-full md:px-6 relative bevel">
            <IconBoltFilled /> Read the docs <IconChevronRight />
          </Button>
        </Link>
      </div>

      <div className="flex items-center gap-2 mt-8">
        {brands.map((brand) => (
          <Tooltip key={brand.label}>
            <TooltipTrigger className="brand-icon">
              <brand.icon size={40} strokeWidth={1.1} />
            </TooltipTrigger>
            <TooltipContent>{brand.label}</TooltipContent>
          </Tooltip>
        ))}
      </div>
    </main>
  );
}

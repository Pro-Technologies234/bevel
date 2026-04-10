"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wrapper } from "@/components/shared/wrapper";
import { Badge } from "../ui/badge";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const STEPS = [
  {
    num: "01",
    title: "Browse the registry",
    desc: "Each system has a dedicated docs page with live demos, full API reference, and TypeScript type definitions. Understand what you're installing before you install it.",
    code: "bevelui.com/docs/components",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <rect
          x="2"
          y="3"
          width="16"
          height="12"
          rx="2"
          stroke="currentColor"
          strokeWidth="1.4"
        />
        <path
          d="M6 17h8M10 15v2"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
        />
      </svg>
    ),
  },
  {
    num: "02",
    title: "Run the shadcn CLI",
    desc: "The CLI reads a static JSON registry, resolves shadcn primitive dependencies, and writes source files directly into your project. No custom tooling, no Bevel package.",
    code: "npx shadcn@latest add https://bevelui.com/r/tour.json",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M4 6l4 4-4 4M10 14h6"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    num: "03",
    title: "Own the source",
    desc: "Files land in components/bevelui/. Read the implementation, extend it, delete what you don't need. The system has no runtime dependency on Bevel — it is part of your codebase.",
    code: "components/bevelui/tour/",
    icon: (
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
        <path
          d="M10 2L3 6v5c0 4 3 7.5 7 8.5 4-1 7-4.5 7-8.5V6l-7-4z"
          stroke="currentColor"
          strokeWidth="1.4"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const lineRef = useRef<SVGLineElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      // Animate the connecting line
      if (lineRef.current) {
        const length = lineRef.current.getTotalLength?.() ?? 500;
        gsap.set(lineRef.current, {
          strokeDasharray: length,
          strokeDashoffset: length,
        });
        gsap.to(lineRef.current, {
          strokeDashoffset: 0,
          duration: 1.6,
          ease: "power2.inOut",
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 55%",
            toggleActions: "play none none none",
          },
        });
      }

      // Animate cards
      gsap.fromTo(
        cardsRef.current,
        { y: 56, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.85,
          ease: "power4.out",
          stagger: 0.16,
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 78%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      className="relative py-32 overflow-hidden bg-indigo-50 text-black"
    >
      <Wrapper>
        <div className="flex flex-col items-center gap-4 text-center mb-16">
          <Badge
            variant={"secondary"}
            className="bg-indigo-100 p-3 gap-2 text-[10px] uppercase select-none text-black"
          >
            Distribution model
          </Badge>
          <h2 className="text-4xl md:text-5xl font-sans font-semibold max-w-lg ">
            The shadcn model. Applied to systems.
          </h2>
          <p className="text-sm md:text-base  max-w-md leading-relaxed font-light">
            No package to version. No dependency tree to maintain. Source files
            are written directly into your project and become part of your
            codebase.
          </p>
        </div>

        <div className="relative max-w-2xl mx-auto">
          <div className="space-y-6">
            {STEPS.map((step, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) cardsRef.current[i] = el;
                }}
                className="flex gap-5 p-6 rounded-xl transition-all duration-300 bg-indigo-100/30"
                style={{ willChange: "transform, opacity" }}
              >
                <div className="w-12 h-12 rounded-full flex items-center justify-center shrink-0 z-10 bg-indigo-100 border border-indigo-200">
                  {step.icon}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="text-[11px] font-mono">{step.num}</span>
                    <h3 className="text-base font-semibold tracking-tight">
                      {step.title}
                    </h3>
                  </div>
                  <p className="text-sm leading-relaxed font-light mb-3">
                    {step.desc}
                  </p>
                  <code className="block px-3 py-1.5 rounded-md text-xs font-mono truncate text-rose-600">
                    {step.code}
                  </code>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

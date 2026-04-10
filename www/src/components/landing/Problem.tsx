"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Wrapper } from "@/components/shared/wrapper";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

const CODE_LINES = [
  {
    tokens: [
      { t: "comment", v: "// Typical project. Three separate opinions." },
    ],
  },
  {
    tokens: [
      { t: "kw", v: "import" },
      { t: "plain", v: " SomeFormLib " },
      { t: "kw", v: "from" },
      { t: "str", v: ' "some-form-lib"' },
    ],
  },
  {
    tokens: [
      { t: "kw", v: "import" },
      { t: "plain", v: " SomeUploadLib " },
      { t: "kw", v: "from" },
      { t: "str", v: ' "some-upload-lib"' },
    ],
  },
  {
    tokens: [
      { t: "kw", v: "import" },
      { t: "plain", v: " SomeTourLib " },
      { t: "kw", v: "from" },
      { t: "str", v: ' "some-tour-lib"' },
    ],
  },
  {
    tokens: [{ t: "comment", v: "// 3 dependency trees. 3 release cycles." }],
  },
  { tokens: [] },
  { tokens: [{ t: "comment", v: "// Bevel. One architecture." }] },
  {
    tokens: [
      { t: "kw", v: "import" },
      { t: "plain", v: " { FormEngine } " },
      { t: "kw", v: "from" },
      { t: "str", v: ' "@/components/bevelui/form-engine"' },
    ],
  },
  {
    tokens: [
      { t: "kw", v: "import" },
      { t: "plain", v: " { FileUploadRoot } " },
      { t: "kw", v: "from" },
      { t: "str", v: ' "@/components/bevelui/file-upload"' },
    ],
  },
  {
    tokens: [
      { t: "kw", v: "import" },
      { t: "plain", v: " { TourRoot } " },
      { t: "kw", v: "from" },
      { t: "str", v: ' "@/components/bevelui/tour"' },
    ],
  },
  {
    tokens: [
      { t: "comment", v: "// Source in your repo. No runtime dependency." },
    ],
  },
];

const COLORS: Record<string, string> = {
  kw: "text-red-300",
  str: "text-blue-300",
  plain: "text-blue-300",
  comment: "text-muted-foreground",
};

const POINTS = [
  {
    num: "01",
    title: "Component libraries don't ship product.",
    body: "Buttons and inputs are solved. Multi-step forms, guided tours, file pipelines — these are the flows that define whether your product works. They don't exist in any component library.",
  },
  {
    num: "02",
    title: "Third-party UI is a liability at runtime.",
    body: "Every external UI dependency is a breaking upgrade you didn't schedule, a design system embedded in yours, and a codebase you can't audit. You ship what you don't control.",
  },
  {
    num: "03",
    title: "Forked snippets don't scale.",
    body: "Ad hoc copies have no type safety, no consistent API, no shared logic. Each project inherits the same incomplete solutions. Bevel packages the architecture once.",
  },
];

export default function Problem() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement[]>([]);
  const pointsRef = useRef<HTMLDivElement[]>([]);

  useGSAP(
    () => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 70%",
          toggleActions: "play none none none",
        },
      });

      tl.fromTo(
        headingRef.current,
        { y: 70, opacity: 0 },
        { y: 0, opacity: 1, duration: 1.1, ease: "power4.out" },
      )
        .fromTo(
          linesRef.current,
          { x: -24, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.45,
            ease: "power3.out",
            stagger: 0.055,
          },
          "-=0.8",
        )
        .fromTo(
          pointsRef.current,
          { y: 32, opacity: 0 },
          {
            y: 0,
            opacity: 1,
            duration: 0.8,
            ease: "power4.out",
            stagger: 0.12,
          },
          "-=0.4",
        );
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className="relative py-14 overflow-hidden">
      <Wrapper>
        <div
          ref={headingRef}
          className="py-12 flex flex-col items-center text-center gap-4"
        >
          <h2 className="text-4xl md:text-5xl font-sans font-semibold max-w-xl leading-tighter">
            Production apps need{" "}
            <span className="bg-linear-to-t from-lime-600 via-primary to-lime-200 bg-clip-text text-transparent">
              more than primitives.
            </span>
          </h2>
          <p className="text-muted-foreground max-w-xl leading-relaxed font-light">
            Every serious product requires the same complex flows. Most teams
            implement them independently, inconsistently, and under time
            pressure. That compounds.
          </p>
        </div>

        <div className="grid gap-12 md:gap-16 md:grid-cols-2">
          {/* Left: Points */}
          <div className="space-y-12">
            {POINTS.map((p, i) => (
              <div
                key={i}
                ref={(el) => {
                  if (el) pointsRef.current[i] = el;
                }}
                className="flex gap-5"
                style={{ willChange: "transform, opacity" }}
              >
                <span
                  className="mt-1 text-xs font-mono shrink-0"
                  style={{ color: "rgba(255,255,255,0.18)" }}
                >
                  {p.num}
                </span>
                <div>
                  <h3 className="text-base font-semibold tracking-tight text-foreground mb-2">
                    {p.title}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed font-light">
                    {p.body}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Code window */}
          <div className="rounded-xl overflow-hidden bg-muted/30">
            <div className="flex items-center gap-2 px-5 h-10 bg-muted/40">
              {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                <span
                  key={i}
                  className="w-2.5 h-2.5 rounded-full"
                  style={{ background: c }}
                />
              ))}
              <span className="ml-3 text-xs font-mono text-muted-foreground">
                page.tsx
              </span>
            </div>

            <div
              className="p-6"
              style={{ fontFamily: "monospace", fontSize: 13, lineHeight: 2 }}
            >
              {CODE_LINES.map((line, li) => (
                <div
                  key={li}
                  ref={(el) => {
                    if (el) linesRef.current[li] = el;
                  }}
                  style={{ willChange: "transform, opacity" }}
                  className="flex"
                >
                  <span
                    className="select-none mr-6 text-right shrink-0"
                    style={{ minWidth: 18 }}
                  >
                    {li + 1}
                  </span>
                  <span>
                    {line.tokens.length === 0 ? (
                      <>&nbsp;</>
                    ) : (
                      line.tokens.map((tok, ti) => (
                        <span key={ti} className={COLORS[tok.t]}>
                          {tok.v}
                        </span>
                      ))
                    )}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

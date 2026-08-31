"use client";

/**
 * SECTION: "Honest"
 *
 * Three scenes a developer recognises, not abstract industry arguments.
 * Redesigned as three independent numbered cards (not one connected strip)
 * so each moment gets its own depth, icon, and accent — matching the
 * bento/illustration language used elsewhere on the page instead of a flat
 * bordered row.
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Wrapper } from "@/components/shared/wrapper";
import { cn } from "@/lib/utils";
import { IconCloudUpload, IconForms, IconRoute } from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const MOMENTS: {
  icon: typeof IconCloudUpload;
  accent: string;
  thought: string;
  reality: string;
  bevel: string;
}[] = [
  {
    icon: IconCloudUpload,
    accent: "#f97316",
    thought:
      '"We just need a quick file upload with progress — shouldn\'t take more than a day."',
    reality:
      "Four days later: abort handling, retry logic, per-file errors, drag-and-drop edge cases.",
    bevel:
      "File Upload ships all of that. You drop it in, wire up your upload function, done.",
  },
  {
    icon: IconForms,
    accent: "#e879f9",
    thought:
      '"I\'ll just copy the form wizard from the last project and clean it up."',
    reality:
      "The schema, the back-navigation bug, the half-finished step validation — all of it comes with it.",
    bevel:
      "Form Engine is a clean architecture. Not a copy. No history attached.",
  },
  {
    icon: IconRoute,
    accent: "#818cf8",
    thought:
      "\"The product tour can't be that hard — it's just a tooltip that follows the user around.\"",
    reality:
      "Positioning, masking, keyboard nav, scroll handling, skip state, resume logic.",
    bevel: "Product Tour handles every one of those. You define the steps.",
  },
];

export default function Honest() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardsRef = useRef<HTMLDivElement[]>([]);
  const headingRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        headingRef.current,
        { y: 48, opacity: 0 },
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

      gsap.fromTo(
        cardsRef.current,
        { y: 60, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.8,
          ease: "power3.out",
          stagger: 0.15,
          scrollTrigger: {
            trigger: cardsRef.current[0],
            start: "top 80%",
            toggleActions: "play none none none",
          },
        },
      );
    },
    { scope: sectionRef, revertOnUpdate: true },
  );

  return (
    <section ref={sectionRef} className="relative py-24 overflow-hidden">
      <Wrapper>
        <div ref={headingRef} className="mb-14 max-w-lg mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-sans font-semibold leading-tight tracking-tight">
            It always takes
            <br />
            <span className="gradient-primary">longer than it should.</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed max-w-md mx-auto">
            Not because you're slow. Because the architecture genuinely takes
            time to get right. Bevel packages that time so you don't spend it.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          {MOMENTS.map((moment, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className="group flex flex-col gap-5 rounded-2xl border border-border/60 bg-card/40 p-6 hover:border-border hover:-translate-y-0.5 transition-all duration-200"
              style={{ willChange: "transform, opacity" }}
            >
              <div className="flex items-center justify-between">
                <div
                  className="flex items-center justify-center h-10 w-10 rounded-xl"
                  style={{ background: `${moment.accent}1a`, color: moment.accent }}
                >
                  <moment.icon size={19} strokeWidth={1.7} />
                </div>
                <span className="font-mono text-2xl font-semibold text-muted-foreground/15 tabular-nums">
                  0{i + 1}
                </span>
              </div>

              <div className="flex flex-col gap-3">
                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 block mb-1.5">
                    The estimate
                  </span>
                  <p className="text-sm italic text-muted-foreground leading-relaxed">
                    {moment.thought}
                  </p>
                </div>

                <div className="h-px bg-border/60" />

                <div>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50 block mb-1.5">
                    What actually happens
                  </span>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {moment.reality}
                  </p>
                </div>
              </div>

              <div
                className="mt-auto rounded-xl p-4"
                style={{ background: `${moment.accent}0d` }}
              >
                <span
                  className="text-[10px] font-mono uppercase tracking-widest block mb-1.5"
                  style={{ color: moment.accent }}
                >
                  With Bevel
                </span>
                <p className="text-sm leading-relaxed font-medium">
                  {moment.bevel}
                </p>
              </div>
            </div>
          ))}
        </div>
      </Wrapper>
    </section>
  );
}

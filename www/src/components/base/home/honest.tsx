"use client";

/**
 * SECTION: "Honest"
 *
 * WHAT THIS REPLACES:
 * The old Problem.tsx had three abstract points ("Component libraries don't ship product",
 * "Third-party UI is a liability at runtime", "Forked snippets don't scale") + a code window.
 * That framing is too theoretical. It sounds like a conference talk, not a conversation.
 *
 * WHAT THIS DOES INSTEAD:
 * It acknowledges the specific reality of how developers actually work —
 * not "the industry has a problem" but "here is what your actual week looks like."
 * The three items are scenes, not arguments. The developer recognises their own situation.
 *
 * VISUAL APPROACH:
 * Three horizontal cards that feel like internal monologue.
 * Each card has a "before" thought (italic, muted) and a "what Bevel does" statement.
 * No code window. No numbered points. No section label that says "The Problem."
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Wrapper } from "@/components/shared/wrapper";
import { cn } from "@/lib/utils";

gsap.registerPlugin(ScrollTrigger);

const MOMENTS = [
  {
    // The "sprint" moment — most developers recognise this
    thought:
      '"We just need a quick file upload with progress — shouldn\'t take more than a day."',
    reality:
      "Four days later: abort handling, retry logic, per-file errors, drag-and-drop edge cases.",
    bevel:
      "File Upload ships all of that. You drop it in, wire up your upload function, done.",
  },
  {
    // The "reuse" moment
    thought:
      '"I\'ll just copy the form wizard from the last project and clean it up."',
    reality:
      "The schema, the back-navigation bug, the half-finished step validation — all of it comes with it.",
    bevel:
      "Form Engine is a clean architecture. Not a copy. No history attached.",
  },
  {
    // The "onboarding" moment
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
        {/* Heading — no section label, just the thought */}
        <div ref={headingRef} className="mb-16 max-w-x mx-auto text-center">
          <h2 className="text-3xl md:text-5xl font-sans font-semibold leading-tight tracking-tight">
            It always takes
            <br />
            <span className="gradient-primary">longer than it should.</span>
          </h2>
          <p className="text-muted-foreground mt-4 leading-relaxed max-w-md">
            Not because you're slow. Because the architecture genuinely takes
            time to get right. Bevel packages that time so you don't spend it.
          </p>
        </div>

        {/* Cards */}
        <div className="flex flex-col gap-4">
          {MOMENTS.map((moment, i) => (
            <div
              key={i}
              ref={(el) => {
                if (el) cardsRef.current[i] = el;
              }}
              className={cn(
                "group grid md:grid-cols-3 gap-0 rounded-xl overflow-hidden border border-border/60",
                "hover:border-border transition-colors duration-200",
              )}
              style={{ willChange: "transform, opacity" }}
            >
              {/* The thought */}
              <div className="p-6 bg-muted/30 border-r border-border/60">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground/50 block mb-3">
                  The estimate
                </span>
                <p className="text-sm italic text-muted-foreground leading-relaxed">
                  {moment.thought}
                </p>
              </div>

              {/* The reality */}
              <div className="p-6 bg-muted/40 border-r border-border/60">
                <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground/50 block mb-3">
                  What actually happens
                </span>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {moment.reality}
                </p>
              </div>

              {/* The Bevel answer */}
              <div className="p-6 bg-primary/4 group-hover:bg-primary/6 transition-colors">
                <span
                  className="text-[10px] font-mono tracking-widest uppercase block mb-3"
                  style={{ color: "#c2f13c", opacity: 0.7 }}
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

"use client";

/**
 * SECTION: HowItWorks
 *
 * WHAT CHANGED AND WHY:
 *
 * Old: Three steps with icons, a connecting SVG line, detailed descriptions.
 * That's a tutorial section. It explains how to use Bevel.
 * The problem: developers scanning a landing page don't want a tutorial.
 * They want to understand what ownership means in 10 seconds.
 *
 * New: One big idea — "it lives in your repo" — shown two ways:
 * 1. The install command (what you type once)
 * 2. The file tree (what you own forever)
 *
 * The section answers the most important unspoken question:
 * "Will I be dependent on Bevel?" — Answer: no, and here's the proof.
 */

import { useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { Wrapper } from "@/components/shared/wrapper";
import {
  IconBoltFilled,
  IconFolder,
  IconFileTypeTsx,
  IconFileTypeTs,
} from "@tabler/icons-react";

gsap.registerPlugin(ScrollTrigger);

const FILE_TREE = [
  { indent: 0, type: "folder", name: "components/" },
  { indent: 1, type: "folder", name: "bevelui/", highlight: true },
  { indent: 2, type: "folder", name: "tour/" },
  { indent: 3, type: "file", name: "tour-context.tsx", ext: "tsx" },
  { indent: 3, type: "file", name: "tour-anchor.tsx", ext: "tsx" },
  { indent: 3, type: "file", name: "tour-overlay.tsx", ext: "tsx" },
  { indent: 3, type: "file", name: "tour-card.tsx", ext: "tsx" },
  { indent: 3, type: "file", name: "index.ts", ext: "ts" },
  { indent: 2, type: "folder", name: "command-palette/" },
  { indent: 2, type: "folder", name: "file-upload/" },
  { indent: 2, type: "folder", name: "form-engine/" },
];

export default function HowItWorks() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const leftRef = useRef<HTMLDivElement>(null);
  const rightRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      gsap.fromTo(
        [leftRef.current, rightRef.current],
        { y: 48, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.9,
          ease: "power3.out",
          stagger: 0.12,
          scrollTrigger: {
            trigger: sectionRef.current,
            start: "top 75%",
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
        <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
          {/* Left — the one idea */}
          <div ref={leftRef} className="flex flex-col gap-6">
            <div>
              {/*
                OLD heading: "The shadcn model. Applied to systems."
                → Too self-referential. Requires knowing what the shadcn model is.

                NEW heading: Just say the outcome.
              */}
              <h2 className="text-3xl md:text-4xl font-sans font-semibold tracking-tight leading-tight mb-4">
                One command.
                <br />
                Then it&apos;s yours.
              </h2>
              <p className="text-muted-foreground leading-relaxed text-sm md:text-base">
                The shadcn CLI writes the source files directly into your
                project. No npm package. No Bevel dependency at runtime. The
                code is in your repo — read it, change it, delete what you
                don&apos;t need.
              </p>
            </div>

            {/* The install command — presented as a fact, not a step */}
            <div className="flex flex-col gap-2">
              <span className="text-[10px] font-mono tracking-widest uppercase text-muted-foreground/50">
                How it installs
              </span>
              <div className="flex w-fit items-center gap-2 bg-muted/30 rounded-xl px-4 py-3 border border-border/60 font-mono text-xs overflow-x-auto">
                <IconBoltFilled size={12} className="text-primary shrink-0" />
                <span className="text-primary whitespace-nowrap">
                  npx shadcn@latest add https://bevelui.vercel.app/r/tour.json
                </span>
              </div>
              <span className="text-[11px] text-muted-foreground/50">
                Resolves shadcn dependencies, writes source files, done.
              </span>
            </div>

            {/* Three properties — shown as facts not bullets */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              {[
                { label: "No npm package", sub: "It installs as source" },
                { label: "No runtime dep", sub: "Nothing imports bevelui" },
                { label: "No updates forced", sub: "You own the version" },
              ].map((item) => (
                <div
                  key={item.label}
                  className="p-3 rounded-xl bg-muted/20 border border-border/60"
                >
                  <p className="text-xs font-semibold mb-1">{item.label}</p>
                  <p className="text-[10px] text-muted-foreground leading-relaxed">
                    {item.sub}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Right — the file tree (proof of ownership) */}
          <div ref={rightRef}>
            <div className="rounded-2xl overflow-hidden border border-border/60 bg-muted/10">
              {/* Window bar */}
              <div className="flex items-center gap-2 px-5 py-3 bg-muted/30 border-b border-border/60">
                {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
                  <span
                    key={i}
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: c }}
                  />
                ))}
                <span className="text-xs font-mono text-muted-foreground ml-2">
                  your-project/
                </span>
              </div>

              {/* File tree */}
              <div className="p-5 font-mono text-xs leading-relaxed">
                {FILE_TREE.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-1.5 py-0.5"
                    style={{ paddingLeft: item.indent * 16 }}
                  >
                    {item.type === "folder" ? (
                      <IconFolder
                        size={13}
                        strokeWidth={1.6}
                        className={
                          item.highlight
                            ? "text-primary fill-primary"
                            : "text-amber-400/70"
                        }
                      />
                    ) : item.ext === "tsx" ? (
                      <IconFileTypeTsx
                        size={13}
                        strokeWidth={1.6}
                        className="text-blue-400/70"
                      />
                    ) : (
                      <IconFileTypeTs
                        size={13}
                        strokeWidth={1.6}
                        className="text-blue-500/70"
                      />
                    )}
                    <span
                      className={
                        item.highlight
                          ? "text-primary font-semibold"
                          : item.type === "folder"
                            ? "text-foreground/70"
                            : "text-muted-foreground"
                      }
                    >
                      {item.name}
                    </span>
                    {item.highlight && (
                      <span
                        className="text-[9px] px-1.5 py-0.5 rounded font-sans font-semibold ml-1"
                        style={{
                          background: "rgba(194,241,60,.12)",
                          color: "#c2f13c",
                        }}
                      >
                        yours
                      </span>
                    )}
                  </div>
                ))}
              </div>

              {/* Footer note */}
              <div className="px-5 py-3 border-t border-border/60 bg-muted/20">
                <p className="text-[11px] text-muted-foreground/50 font-mono">
                  These are files in your project — not a package you installed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

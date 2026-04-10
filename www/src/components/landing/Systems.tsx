"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Link from "next/link";
import { Wrapper } from "@/components/shared/wrapper";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { ProductTourDemo } from "@/app/docs/components/product-tour/page";
import { CommandPaletteDemo } from "@/app/docs/components/command-palette/page";
import { FileUploadDemo } from "@/app/docs/components/file-upload/page";
import { FormEngineDemo } from "@/app/docs/components/form-engine/page";

gsap.registerPlugin(ScrollTrigger);

const SYSTEMS = [
  {
    id: "product-tour",
    tag: "Available now",
    title: "Product Tour",
    body: "Walk users through any part of your product. Overlay masking, smart-positioned floating cards, media per step, keyboard navigation — all pre-wired.",
    href: "/docs/components/product-tour",
    accent: "#c2f13c",
    cmd: "npx shadcn@latest add https://bevelui.com/r/tour.json",
    demo: <ProductTourDemo />,
  },
  {
    id: "commande-palette",
    tag: "Available now",
    title: "Command Palette",
    body: "⌘K shortcut, fuzzy search, source and filter tabs, grouped results with avatars. Zero external search library. Drop it in and it works.",
    href: "/docs/components/command-palette",
    accent: "#818cf8",
    cmd: "npx shadcn@latest add https://bevelui.com/r/command-palette.json",
    demo: <CommandPaletteDemo />,
  },
  {
    id: "file-upload",
    tag: "Available now",
    title: "File Upload",
    body: "Drag and drop with per-file progress, cancel, retry, grid and list views, modal mode. You bring the upload function — the system handles everything else.",
    href: "/docs/components/file-upload",
    accent: "#f97316",
    cmd: "npx shadcn@latest add https://bevelui.com/r/file-upload.json",
    demo: <FileUploadDemo />,
  },
  {
    id: "form-engine",
    tag: "Available now",
    title: "Form Engine",
    body: "Multi-step or single-step form orchestration. Plugin architecture for validation, analytics, and server checks. The engine owns the steps — your fields, your logic.",
    href: "/docs/components/form-engine",
    accent: "#e879f9",
    cmd: "npx shadcn@latest add https://bevelui.com/r/form-engine.json",
    demo: <FormEngineDemo />,
  },
];

export default function Systems() {
  const trackRef = useRef<HTMLDivElement>(null);
  const wrapRef = useRef<HTMLDivElement>(null);
  const [system, setSystem] = useState<string>(SYSTEMS[0].id);
  const activeSystem = SYSTEMS.find((s) => s.id === system);

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current;
      const wrap = wrapRef.current;
      if (!track || !wrap) return;

      const totalScroll = track.scrollWidth - window.innerWidth;

      gsap.to(track, {
        x: -totalScroll,
        ease: "none",
        scrollTrigger: {
          trigger: wrap,
          start: "top top",
          end: () => `+=${totalScroll + window.innerHeight}`,
          scrub: 1.2,
          pin: true,
          anticipatePin: 1,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <section className="py-16">
      <Wrapper>
        <div className="flex flex-col text-center items-center justify-between">
          <h2 className="text-5xl font-sans font-semibold max-w-xl leading-tight">
            All systems.
            <br />
            <span className="gradient-primary">Production-ready.</span>
          </h2>
          <p className="text-lg max-w-2xl">
            Every system ships with docs, TypeScript types, and full source
            ownership.
          </p>
        </div>
        {/* Demo Window */}
        <div className="h-200 w-full flex flex-col bg-linear-to-b from-muted/30 via-muted/30 to-muted/5 my-14 rounded-2xl overflow-hidden">
          <div className="px-6 py-4 w-full flex items-center gap-1.5 bg-muted/40">
            {["#ff5f57", "#febc2e", "#28c840"].map((c, i) => (
              <span
                key={i}
                className="w-3 h-3 rounded-full"
                style={{ background: c }}
              />
            ))}
            <div className="flex-1 flex px-8 space-x-2 overflow-x-auto no-scrollbar">
              {SYSTEMS.map((s) => (
                <>
                  <Button
                    key={s.id}
                    onClick={() => setSystem(s.id)}
                    variant={s.id === system ? "default" : "ghost"}
                  >
                    {s.title}
                  </Button>
                  <Separator orientation="vertical" />
                </>
              ))}
            </div>
          </div>
          <div className="p-8 h-full flex-1 flex flex-col items-center justify-center">
            {activeSystem?.demo}
          </div>
        </div>
      </Wrapper>
    </section>
  );
}

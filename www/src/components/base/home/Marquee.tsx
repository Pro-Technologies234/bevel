"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

import { IconBoltFilled } from "@tabler/icons-react";

const ITEMS = [
  "Copy to own",
  "No npm package",
  "shadcn compatible",
  "React 18+",
  "TypeScript",
  "Tailwind v4",
  "No runtime dependency",
  "MIT licensed",
  "Next.js ready",
  "motion/react",
  "Full source access",
];

function MarqueeRow({ reverse = false }: { reverse?: boolean }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const tweenRef = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    const track = trackRef.current;
    if (!track) return;

    const distance = track.scrollWidth / 2; // half because duplicated
    const duration = 28;

    const animate = () => {
      tweenRef.current = gsap.fromTo(
        track,
        { x: reverse ? -distance : 0 },
        {
          x: reverse ? 0 : -distance,
          duration,
          ease: "none",
          repeat: -1,
          overwrite: true,
        },
      );
    };

    animate();

    // Handle window resize to maintain seamless loop
    const handleResize = () => {
      tweenRef.current?.kill();
      animate();
    };

    window.addEventListener("resize", handleResize);
    return () => {
      tweenRef.current?.kill();
      window.removeEventListener("resize", handleResize);
    };
  }, [reverse]);

  return (
    <div className="overflow-hidden flex">
      <div
        ref={trackRef}
        className="flex gap-0 whitespace-nowrap bg-foreground"
        style={{ willChange: "transform" }}
      >
        {ITEMS.concat(ITEMS).map((item, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-8 py-1 text-background text-xs font-semibold"
          >
            <IconBoltFilled size={14} />
            {item.toUpperCase()}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Marquee() {
  return (
    <div
      className="overflow-hidden"
      style={{
        borderTop: "1px solid rgba(255,255,255,0.05)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        background: "rgba(255,255,255,0.015)",
      }}
    >
      <MarqueeRow />
    </div>
  );
}

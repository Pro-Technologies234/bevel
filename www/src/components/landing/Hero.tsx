"use client";

import { useEffect, useRef } from "react";
import { motion, useScroll, useTransform, useInView } from "motion/react";
import { gsap } from "gsap";

// Text scramble class
class TextScramble {
  el: HTMLElement;
  chars = "!<>-_\\/[]{}—=+*^?#@$%&";
  queue: { from: string; to: string; start: number; end: number; char?: string }[] = [];
  frame = 0;
  frameRequest = 0;
  resolve!: () => void;

  constructor(el: HTMLElement) {
    this.el = el;
    this.update = this.update.bind(this);
  }

  setText(newText: string) {
    const old = this.el.innerText;
    const length = Math.max(old.length, newText.length);
    const promise = new Promise<void>((resolve) => (this.resolve = resolve));
    this.queue = [];
    for (let i = 0; i < length; i++) {
      const from = old[i] || "";
      const to = newText[i] || "";
      const start = Math.floor(Math.random() * 30);
      const end = start + Math.floor(Math.random() * 30);
      this.queue.push({ from, to, start, end });
    }
    cancelAnimationFrame(this.frameRequest);
    this.frame = 0;
    this.update();
    return promise;
  }

  update() {
    let output = "";
    let complete = 0;
    for (let i = 0, n = this.queue.length; i < n; i++) {
      const { from, to, start, end } = this.queue[i];
      let { char } = this.queue[i];
      if (this.frame >= end) {
        complete++;
        output += `<span style="color:rgba(255,255,255,0.9)">${to}</span>`;
      } else if (this.frame >= start) {
        if (!char || Math.random() < 0.28) {
          char = this.chars[Math.floor(Math.random() * this.chars.length)];
          this.queue[i].char = char;
        }
        output += `<span style="color:#c2f13c">${char}</span>`;
      } else {
        output += `<span style="color:rgba(255,255,255,0.2)">${from}</span>`;
      }
    }
    this.el.innerHTML = output;
    if (complete === this.queue.length) {
      this.resolve();
    } else {
      this.frameRequest = requestAnimationFrame(this.update);
      this.frame++;
    }
  }
}

// Particle canvas
function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);
    let mouse = { x: W / 2, y: H / 2 };

    const particles: {
      x: number; y: number; ox: number; oy: number;
      vx: number; vy: number; size: number; opacity: number; speed: number;
    }[] = [];

    const count = 120;
    for (let i = 0; i < count; i++) {
      const x = Math.random() * W;
      const y = Math.random() * H;
      particles.push({ x, y, ox: x, oy: y, vx: 0, vy: 0, size: Math.random() * 1.5 + 0.3, opacity: Math.random() * 0.4 + 0.1, speed: Math.random() * 0.3 + 0.05 });
    }

    const onMouseMove = (e: MouseEvent) => { mouse.x = e.clientX; mouse.y = e.clientY; };
    window.addEventListener("mousemove", onMouseMove);

    let raf: number;
    const animate = () => {
      ctx.clearRect(0, 0, W, H);
      for (const p of particles) {
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        const force = Math.max(0, 120 - dist) / 120;

        p.vx += (p.ox - p.x) * 0.04 - (dx / dist || 0) * force * 2.5;
        p.vy += (p.oy - p.y) * 0.04 - (dy / dist || 0) * force * 2.5;
        p.vx *= 0.88;
        p.vy *= 0.88;
        p.x += p.vx;
        p.y += p.vy;

        // Drift
        p.oy -= p.speed * 0.15;
        if (p.oy < -10) p.oy = H + 10;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(194,241,60,${p.opacity})`;
        ctx.fill();
      }
      raf = requestAnimationFrame(animate);
    };
    animate();

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 pointer-events-none"
      style={{ opacity: 0.7 }}
    />
  );
}

const PHRASES = [
  "The UI Systems",
  "The Hard Parts",
  "The Actual Work",
  "The Missing Layer",
];

export default function Hero() {
  const scrambleRef = useRef<HTMLSpanElement>(null);
  const phraseIndex = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  useEffect(() => {
    const el = scrambleRef.current;
    if (!el) return;
    const fx = new TextScramble(el);

    const cycle = () => {
      fx.setText(PHRASES[phraseIndex.current]).then(() => {
        setTimeout(cycle, 2400);
      });
      phraseIndex.current = (phraseIndex.current + 1) % PHRASES.length;
    };

    setTimeout(cycle, 800);
  }, []);

  // GSAP entrance for big title lines
  const line1Ref = useRef<HTMLDivElement>(null);
  const line2Ref = useRef<HTMLDivElement>(null);
  const badgeRef = useRef<HTMLDivElement>(null);
  const subRef = useRef<HTMLParagraphElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const tl = gsap.timeline({ delay: 0.2 });
    tl.fromTo(badgeRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" })
      .fromTo(line1Ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=0.3")
      .fromTo(line2Ref.current, { y: 80, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "power4.out" }, "-=0.75")
      .fromTo(subRef.current, { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 0.8, ease: "power3.out" }, "-=0.5")
      .fromTo(ctaRef.current, { y: 20, opacity: 0 }, { y: 0, opacity: 1, duration: 0.7, ease: "power3.out" }, "-=0.4");
  }, []);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex flex-col items-center justify-center text-center overflow-hidden"
      style={{ background: "oklch(0.141 0.005 285.823)" }}
    >
      {/* Grid background */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,0.03) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.03) 1px,transparent 1px)",
          backgroundSize: "64px 64px",
          maskImage: "radial-gradient(ellipse 70% 70% at 50% 50%,black 20%,transparent 100%)",
        }}
      />

      {/* Radial glow */}
      <div
        className="absolute pointer-events-none"
        style={{
          width: 700,
          height: 700,
          background: "radial-gradient(circle,rgba(194,241,60,0.07) 0%,transparent 70%)",
          top: "50%",
          left: "50%",
          transform: "translate(-50%,-50%)",
        }}
      />

      <ParticleCanvas />

      <motion.div
        className="relative z-10 flex flex-col items-center"
        style={{ y, opacity }}
      >
        {/* Badge */}
        <div
          ref={badgeRef}
          className="inline-flex items-center gap-2 mb-10 opacity-0"
          style={{
            background: "rgba(194,241,60,0.07)",
            border: "1px solid rgba(194,241,60,0.2)",
            borderRadius: 100,
            padding: "6px 14px 6px 10px",
          }}
        >
          <span
            className="w-1.5 h-1.5 rounded-full"
            style={{ background: "#c2f13c", animation: "pulse 2s ease infinite" }}
          />
          <span
            className="text-[11px] font-semibold tracking-[0.08em] uppercase"
            style={{ color: "#c2f13c", fontFamily: "var(--font-mono, monospace)" }}
          >
            Open Beta — 4 systems live
          </span>
        </div>

        {/* Headline */}
        <div className="overflow-hidden mb-2">
          <div
            ref={line1Ref}
            className="opacity-0"
            style={{
              fontSize: "clamp(60px,9vw,130px)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              color: "#ffffff",
              fontFamily: "Nohemi, system-ui, sans-serif",
            }}
          >
            <span ref={scrambleRef}>The UI Systems</span>
          </div>
        </div>
        <div className="overflow-hidden mb-8">
          <div
            ref={line2Ref}
            className="opacity-0"
            style={{
              fontSize: "clamp(60px,9vw,130px)",
              fontWeight: 900,
              lineHeight: 0.92,
              letterSpacing: "-0.04em",
              fontFamily: "Nohemi, system-ui, sans-serif",
            }}
          >
            <span style={{ color: "rgba(255,255,255,0.18)" }}>Your App&nbsp;</span>
            <span style={{ color: "#c2f13c" }}>Actually Needs.</span>
          </div>
        </div>

        {/* Sub */}
        <p
          ref={subRef}
          className="opacity-0 mb-12"
          style={{
            fontSize: "clamp(16px,1.8vw,20px)",
            color: "rgba(255,255,255,0.4)",
            maxWidth: 500,
            lineHeight: 1.65,
            fontWeight: 300,
          }}
        >
          Copy-to-own UI systems. No runtime dependency. No black boxes.
          You own every line, forever.
        </p>

        {/* CTAs */}
        <div ref={ctaRef} className="flex items-center gap-3 opacity-0">
          <button
            data-cursor
            className="flex items-center gap-2 font-bold rounded-lg transition-all duration-150"
            style={{
              background: "#c2f13c",
              color: "#0a0a0a",
              fontSize: 15,
              padding: "14px 28px",
              letterSpacing: "-0.02em",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#d4ff50";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-2px) scale(1.02)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.background = "#c2f13c";
              (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0) scale(1)";
            }}
          >
            Browse systems
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
              <path d="M2 7h10M7 2l5 5-5 5" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>

          <button
            data-cursor
            className="flex items-center gap-2 rounded-lg transition-all duration-150"
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 15,
              padding: "14px 28px",
              border: "1px solid rgba(255,255,255,0.12)",
              background: "transparent",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.25)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.9)";
              (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.04)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.12)";
              (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.6)";
              (e.currentTarget as HTMLButtonElement).style.background = "transparent";
            }}
          >
            Read the docs
          </button>
        </div>

        {/* Install snippet */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.8, duration: 0.6, ease: "easeOut" }}
          className="mt-10 flex items-center gap-2 px-5 py-2.5 rounded-lg"
          style={{
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontFamily: "monospace",
          }}
        >
          <span style={{ color: "rgba(255,255,255,0.25)", fontSize: 13 }}>$</span>
          <span style={{ color: "rgba(255,255,255,0.65)", fontSize: 13 }}>
            npx shadcn@latest add https://bevelui.com/r/
          </span>
          <span style={{ color: "#c2f13c", fontSize: 13 }}>tour.json</span>
        </motion.div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.2, duration: 0.8 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
        style={{ color: "rgba(255,255,255,0.2)", fontSize: 11, letterSpacing: "0.1em", fontFamily: "monospace" }}
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
          className="w-px h-8"
          style={{ background: "linear-gradient(to bottom, rgba(194,241,60,0.4), transparent)" }}
        />
        SCROLL
      </motion.div>

      <style>{`@keyframes pulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:0.4;transform:scale(0.7)}}`}</style>
    </section>
  );
}

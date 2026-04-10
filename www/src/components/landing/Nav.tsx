"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import Link from "next/link";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-0 left-0 right-0 z-50 flex items-center justify-between px-12 h-16"
      style={{
        borderBottom: scrolled ? "1px solid rgba(255,255,255,0.06)" : "1px solid transparent",
        background: scrolled ? "rgba(10,10,10,0.85)" : "transparent",
        backdropFilter: scrolled ? "blur(20px)" : "none",
        transition: "background 0.4s, border-color 0.4s, backdrop-filter 0.4s",
      }}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-3 no-underline group" data-cursor>
        <div
          className="w-7 h-7 rounded-full flex items-center justify-center"
          style={{ background: "#c2f13c" }}
        >
          <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
            <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <span className="text-white font-bold text-[15px] tracking-tight">Bevel</span>
      </Link>

      {/* Center links */}
      <div className="flex items-center gap-1">
        {["Docs", "Systems", "Components", "Changelog"].map((link) => (
          <Link
            key={link}
            href="#"
            data-cursor
            className="text-[13px] px-3.5 py-2 rounded-md no-underline transition-all duration-200"
            style={{ color: "rgba(255,255,255,0.45)" }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.9)";
              (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.05)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.45)";
              (e.currentTarget as HTMLAnchorElement).style.background = "transparent";
            }}
          >
            {link}
          </Link>
        ))}
      </div>

      {/* Right */}
      <div className="flex items-center gap-2.5">
        <button
          data-cursor
          className="text-[13px] px-4 py-2 rounded-md transition-all duration-200"
          style={{
            color: "rgba(255,255,255,0.5)",
            border: "1px solid rgba(255,255,255,0.1)",
            background: "transparent",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.2)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.8)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.borderColor = "rgba(255,255,255,0.1)";
            (e.currentTarget as HTMLButtonElement).style.color = "rgba(255,255,255,0.5)";
          }}
        >
          GitHub
        </button>
        <button
          data-cursor
          className="text-[13px] font-bold px-4 py-2 rounded-md tracking-tight transition-all duration-150"
          style={{
            background: "#c2f13c",
            color: "#0a0a0a",
          }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#d4ff50";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLButtonElement).style.background = "#c2f13c";
            (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
          }}
        >
          Get started →
        </button>
      </div>
    </motion.nav>
  );
}

"use client";

import { motion } from "motion/react";
import Link from "next/link";

const LINKS = {
  Systems: ["Product Tour", "Command Palette", "File Upload", "Form Engine"],
  Controls: ["CardSelect", "ChipSelect", "RatingField", "SelectField", "TagInput"],
  Resources: ["Documentation", "Changelog", "GitHub", "Releases"],
  Company: ["About", "Twitter / X", "Open source"],
};

export default function Footer() {
  return (
    <footer
      className="px-12 pt-20 pb-10"
      style={{
        background: "#080808",
        borderTop: "1px solid rgba(255,255,255,0.05)",
      }}
    >
      <div className="max-w-7xl mx-auto">
        <div className="grid gap-16 mb-16" style={{ gridTemplateColumns: "1.4fr repeat(4,1fr)" }}>
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-7 h-7 rounded-full flex items-center justify-center" style={{ background: "#c2f13c" }}>
                <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                  <path d="M2 10L10 2M10 2H4M10 2V8" stroke="#0a0a0a" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <span style={{ color: "#ffffff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.02em" }}>Bevel</span>
            </div>
            <p style={{ color: "rgba(255,255,255,0.3)", fontSize: 13, lineHeight: 1.7, maxWidth: 220, fontWeight: 300 }}>
              The UI systems your app actually needs. Precision components for serious builders.
            </p>
            <div className="mt-6 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.06)", display: "inline-flex" }}>
              <span style={{ color: "rgba(255,255,255,0.2)", fontSize: 12, fontFamily: "monospace" }}>$</span>
              <span style={{ color: "#c2f13c", fontSize: 12, fontFamily: "monospace" }}>bevelui.com/r/</span>
            </div>
          </div>

          {/* Link groups */}
          {Object.entries(LINKS).map(([group, links]) => (
            <div key={group}>
              <div style={{ color: "rgba(255,255,255,0.5)", fontSize: 12, fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: 16 }}>
                {group}
              </div>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link}>
                    <Link
                      href="#"
                      data-cursor
                      className="no-underline transition-colors duration-150"
                      style={{ color: "rgba(255,255,255,0.3)", fontSize: 13 }}
                      onMouseEnter={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.75)")}
                      onMouseLeave={(e) => ((e.currentTarget as HTMLAnchorElement).style.color = "rgba(255,255,255,0.3)")}
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          className="flex items-center justify-between pt-8"
          style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
        >
          <span style={{ color: "rgba(255,255,255,0.18)", fontSize: 12, fontFamily: "monospace" }}>
            © {new Date().getFullYear()} Bevel. Open source MIT.
          </span>
          <span style={{ color: "rgba(255,255,255,0.12)", fontSize: 12 }}>
            Built with Next.js · Hosted on Vercel
          </span>
        </div>
      </div>
    </footer>
  );
}

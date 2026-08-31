"use client";

import * as React from "react";
import { PaletteRoot } from "@/components/bevelui/palette";
import type { PaletteColor } from "@/components/bevelui/palette";
import { cn } from "@/lib/utils";
import { IconCopy, IconCheck, IconPalette } from "@tabler/icons-react";

// ─── Seed colors ───────────────────────────────────────────────────────────────

const INITIAL_COLORS: PaletteColor[] = [
  { id: "1", hex: "#c2f13c", name: "Lime" },
  { id: "2", hex: "#6366f1", name: "Indigo" },
  { id: "3", hex: "#f43f5e", name: "Rose" },
  { id: "4", hex: "#0ea5e9", name: "Sky" },
  { id: "5", hex: "#f97316", name: "Orange" },
  { id: "6", hex: "#10b981", name: "Emerald" },
];

// ─── Gradient preview ──────────────────────────────────────────────────────────

function GradientPreview({ colors }: { colors: PaletteColor[] }) {
  const hexes = colors.map((c) => c.hex);
  const gradient =
    hexes.length >= 2
      ? `linear-gradient(135deg, ${hexes.join(", ")})`
      : (hexes[0] ?? "#18181b");

  const cssString =
    hexes.length >= 2
      ? `background: linear-gradient(\n  135deg,\n  ${hexes.join(",\n  ")}\n);`
      : `background: ${hexes[0] ?? "#18181b"};`;

  const [copied, setCopied] = React.useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(cssString).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  }

  return (
    <div className="flex flex-col gap-3">
      {/* Live gradient swatch */}
      <div
        className="w-full h-32 rounded-xl transition-all duration-300"
        style={{ background: gradient }}
      />

      {/* Color chip row */}
      <div className="flex gap-1.5 flex-wrap">
        {colors.map((c) => (
          <div
            key={c.id}
            className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-muted/40 border border-border/40"
          >
            <div
              className="w-3 h-3 rounded-sm shrink-0 border border-white/10"
              style={{ backgroundColor: c.hex }}
            />
            <span className="text-[10px] font-mono text-muted-foreground">
              {c.hex}
            </span>
          </div>
        ))}
      </div>

      {/* CSS output */}
      <div className="relative rounded-lg bg-muted/30 border border-border/50 overflow-hidden">
        <div className="flex items-center justify-between px-3 py-1.5 border-b border-border/40">
          <span className="text-[10px] text-muted-foreground/60 font-mono uppercase tracking-widest">
            CSS
          </span>
          <button
            onClick={handleCopy}
            className="flex items-center gap-1 text-[10px] text-muted-foreground/60 hover:text-foreground transition-colors"
          >
            {copied ? (
              <IconCheck size={11} className="text-emerald-400" />
            ) : (
              <IconCopy size={11} />
            )}
            {copied ? "Copied!" : "Copy"}
          </button>
        </div>
        <pre className="px-3 py-2.5 text-[11px] font-mono text-muted-foreground/80 overflow-x-auto">
          {cssString}
        </pre>
      </div>
    </div>
  );
}

// ─── Demo ──────────────────────────────────────────────────────────────────────

export function PaletteEditorDemo() {
  const [colors, setColors] = React.useState<PaletteColor[]>(INITIAL_COLORS);

  return (
    <div className="w-full flex flex-col lg:flex-row gap-6 max-w-4xl">
      {/* Left: Palette editor */}
      <div className="flex flex-col gap-3 lg:w-72 shrink-0 flex-1">
        <div className="flex items-center gap-2">
          <IconPalette size={14} className="text-muted-foreground" />
          <span className="text-[12px] font-semibold text-foreground uppercase tracking-widest">
            Palette
          </span>
        </div>
        <PaletteRoot
          defaultColors={INITIAL_COLORS}
          config={{ maxColors: 12 }}
          onChange={setColors}
        />
      </div>

      {/* Right: Live preview */}
      <div className="flex flex-col gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2">
          <span className="text-[12px] font-semibold text-foreground uppercase tracking-widest">
            Live Preview
          </span>
        </div>
        <GradientPreview colors={colors} />
      </div>
    </div>
  );
}

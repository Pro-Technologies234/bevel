"use client";

import { PaletteRoot } from "@/components/bevelui/palette";
import type { PaletteColor } from "@/components/bevelui/palette";

const INITIAL_COLORS: PaletteColor[] = [
  { id: "1", hex: "#c2f13c", name: "Lime"     },
  { id: "2", hex: "#6366f1", name: "Indigo"   },
  { id: "3", hex: "#f43f5e", name: "Rose"     },
  { id: "4", hex: "#0ea5e9", name: "Sky"      },
  { id: "5", hex: "#f97316", name: "Orange"   },
  { id: "6", hex: "#10b981", name: "Emerald"  },
  { id: "7", hex: "#a855f7", name: "Purple"   },
  { id: "8", hex: "#0f172a", name: "Midnight" },
];

export function PaletteEditorDemo() {
  return (
    <PaletteRoot
      defaultColors={INITIAL_COLORS}
      config={{ maxColors: 20 }}
    />
  );
}
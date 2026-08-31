"use client";

import * as React from "react";
import {
  GalleryRoot,
} from "@/components/bevelui/gallery";
import type { GalleryItem } from "@/components/bevelui/gallery";
import { cn } from "@/lib/utils";
import { IconLayoutGrid, IconList, IconColumns } from "@tabler/icons-react";

// ─── Seed data ─────────────────────────────────────────────────────────────────

const ITEMS: GalleryItem[] = [
  { id: "i1", type: "image", url: "https://picsum.photos/seed/bevel1/800/600",  name: "hero-bg.jpg",       width: 800, height: 600, size: 284000 },
  { id: "i2", type: "image", url: "https://picsum.photos/seed/bevel2/800/600",  name: "product-shot.jpg",  width: 800, height: 600, size: 196000 },
  { id: "i3", type: "image", url: "https://picsum.photos/seed/bevel3/800/600",  name: "team-photo.jpg",    width: 800, height: 600, size: 310000 },
  { id: "i4", type: "image", url: "https://picsum.photos/seed/bevel4/800/600",  name: "office-wide.jpg",   width: 800, height: 600, size: 248000 },
  { id: "i5", type: "image", url: "https://picsum.photos/seed/bevel5/800/600",  name: "event-cover.jpg",   width: 800, height: 600, size: 372000 },
  { id: "i6", type: "image", url: "https://picsum.photos/seed/bevel6/800/600",  name: "brand-mark.jpg",    width: 800, height: 600, size: 154000 },
  { id: "i7", type: "image", url: "https://picsum.photos/seed/bevel7/800/600",  name: "campaign-a.jpg",    width: 800, height: 600, size: 291000 },
  { id: "i8", type: "image", url: "https://picsum.photos/seed/bevel8/800/600",  name: "campaign-b.jpg",    width: 800, height: 600, size: 218000 },
  { id: "v1", type: "video", url: "https://picsum.photos/seed/bvid1/800/450",   thumbnail: "https://picsum.photos/seed/bvid1/800/450", name: "product-demo.mp4",    duration: 124, size: 18200000 },
  { id: "v2", type: "video", url: "https://picsum.photos/seed/bvid2/800/450",   thumbnail: "https://picsum.photos/seed/bvid2/800/450", name: "onboarding-tour.mp4", duration: 87,  size: 11400000 },
  { id: "d1", type: "document", url: "#", name: "brand-guidelines.pdf", size: 4200000 },
  { id: "d2", type: "document", url: "#", name: "Q3-report.pdf",         size: 1800000 },
  { id: "a1", type: "audio",    url: "#", name: "intro-jingle.mp3",      duration: 12,  size: 480000 },
];

// ─── View modes ────────────────────────────────────────────────────────────────

type ViewMode = "grid" | "columns" | "list";

const VIEW_MODES: { id: ViewMode; icon: React.ElementType; label: string; colCount: number; aspectRatio: number }[] = [
  { id: "grid",    icon: IconLayoutGrid, label: "Grid",    colCount: 4, aspectRatio: 1 },
  { id: "columns", icon: IconColumns,    label: "3-col",   colCount: 3, aspectRatio: 4/3 },
  { id: "list",    icon: IconList,       label: "List",    colCount: 2, aspectRatio: 16/9 },
];

// ─── Demo ──────────────────────────────────────────────────────────────────────

export function GalleryDemo() {
  const [mode, setMode] = React.useState<ViewMode>("grid");

  const current = VIEW_MODES.find((v) => v.id === mode)!;

  return (
    <div className="w-full max-w-3xl flex flex-col gap-3">
      {/* Toolbar */}
      <div className="flex items-center justify-between px-1">
        <div className="flex flex-col gap-0.5">
          <span className="text-[13px] font-semibold text-foreground">Media Library</span>
          <span className="text-[11px] text-muted-foreground/60">{ITEMS.length} items</span>
        </div>

        {/* View mode switcher */}
        <div className="flex items-center gap-1 p-1 rounded-lg border border-border/60 bg-muted/20">
          {VIEW_MODES.map((v) => (
            <button
              key={v.id}
              onClick={() => setMode(v.id)}
              title={v.label}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-[11px] font-medium transition-colors",
                mode === v.id
                  ? "bg-background text-foreground shadow-sm border border-border/40"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              <v.icon size={13} />
              <span className="hidden sm:inline">{v.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Gallery */}
      <div className="rounded-xl border border-border bg-[#0c0c0c] p-4">
        <GalleryRoot
          key={mode}
          items={ITEMS}
          config={{
            selectionMode: "multi",
            sortable: true,
            showNames: true,
            columns: current.colCount,
            aspectRatio: current.aspectRatio,
          }}
        />
      </div>
    </div>
  );
}

// ─── Minimal variant ───────────────────────────────────────────────────────────

export function GalleryMinimalDemo() {
  return (
    <div className="w-full max-w-3xl rounded-xl border border-border bg-[#0c0c0c] p-4">
      <GalleryRoot
        items={ITEMS.slice(0, 6)}
        config={{ selectionMode: "single" }}
      />
    </div>
  );
}

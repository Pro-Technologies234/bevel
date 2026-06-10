"use client";

import * as React from "react";
import {
  GalleryRoot,
  GalleryGrid,
  GalleryToolbar,
  GalleryLightbox,
} from "@/components/bevelui/gallery";
import type { GalleryItem } from "@/components/bevelui/gallery";

// ─── Seed data ─────────────────────────────────────────────────────────────────
// Images: picsum.photos (stable, free, no auth)

const ITEMS: GalleryItem[] = [
  {
    id: "i1",
    type: "image",
    url: "https://picsum.photos/seed/bevel1/800/600",
    name: "hero-bg.jpg",
    width: 800,
    height: 600,
    size: 284000,
  },
  {
    id: "i2",
    type: "image",
    url: "https://picsum.photos/seed/bevel2/800/600",
    name: "product-shot.jpg",
    width: 800,
    height: 600,
    size: 196000,
  },
  {
    id: "i3",
    type: "image",
    url: "https://picsum.photos/seed/bevel3/800/600",
    name: "team-photo.jpg",
    width: 800,
    height: 600,
    size: 310000,
  },
  {
    id: "i4",
    type: "image",
    url: "https://picsum.photos/seed/bevel4/800/600",
    name: "office-wide.jpg",
    width: 800,
    height: 600,
    size: 248000,
  },
  {
    id: "i5",
    type: "image",
    url: "https://picsum.photos/seed/bevel5/800/600",
    name: "event-cover.jpg",
    width: 800,
    height: 600,
    size: 372000,
  },
  {
    id: "i6",
    type: "image",
    url: "https://picsum.photos/seed/bevel6/800/600",
    name: "brand-mark.jpg",
    width: 800,
    height: 600,
    size: 154000,
  },
  {
    id: "i7",
    type: "image",
    url: "https://picsum.photos/seed/bevel7/800/600",
    name: "campaign-a.jpg",
    width: 800,
    height: 600,
    size: 291000,
  },
  {
    id: "i8",
    type: "image",
    url: "https://picsum.photos/seed/bevel8/800/600",
    name: "campaign-b.jpg",
    width: 800,
    height: 600,
    size: 218000,
  },
  {
    id: "v1",
    type: "video",
    url: "https://picsum.photos/seed/bvid1/800/450",
    thumbnail: "https://picsum.photos/seed/bvid1/800/450",
    name: "product-demo.mp4",
    duration: 124,
    size: 18200000,
  },
  {
    id: "v2",
    type: "video",
    url: "https://picsum.photos/seed/bvid2/800/450",
    thumbnail: "https://picsum.photos/seed/bvid2/800/450",
    name: "onboarding-tour.mp4",
    duration: 87,
    size: 11400000,
  },
  {
    id: "d1",
    type: "document",
    url: "#",
    name: "brand-guidelines.pdf",
    size: 4200000,
  },
  {
    id: "d2",
    type: "document",
    url: "#",
    name: "Q3-report.pdf",
    size: 1800000,
  },
  {
    id: "a1",
    type: "audio",
    url: "#",
    name: "intro-jingle.mp3",
    duration: 12,
    size: 480000,
  },
];

// ─── Demo ──────────────────────────────────────────────────────────────────────

export function GalleryDemo() {
  return (
    <div className="w-full max-w-3xl rounded-xl border border-border bg-[#0c0c0c] p-4">
      <GalleryRoot
        items={ITEMS}
        config={{
          selectionMode: "multi",
          sortable: true,
          showNames: true,
          aspectRatio: 4 / 3,
        }}
      />
    </div>
  );
}

// ─── Minimal variant — for usage example in docs ───────────────────────────────

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

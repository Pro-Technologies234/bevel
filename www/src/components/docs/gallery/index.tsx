"use client";

import pageData from "@/content/docs/gallery.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { GalleryDemo } from "./gallery-demo";

export function GalleryContent() {
  return (
    <DocPageRenderer page={pageData as any} demoRegistry={{ GalleryDemo }} />
  );
}

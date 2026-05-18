"use client";

import pageData from "@/content/docs/spotlight.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { SpotlightDemo } from "./spotlight-demo";

export function SpotlightContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ SpotlightDemo }}
    />
  );
}

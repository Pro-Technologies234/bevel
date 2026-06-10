"use client";

import pageData from "@/content/docs/product-tour.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { TourDemo } from "@/components/demo/tour";

export function ProductTourContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ TourDemo }} />;
}

"use client";

import pageData from "@/content/docs/product-tour.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { ProductTourDemo } from "@/components/docs/product-tour/product-tour-demo";

export function ProductTourContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ ProductTourDemo }}
    />
  );
}

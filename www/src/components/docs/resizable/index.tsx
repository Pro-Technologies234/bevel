"use client";

import pageData from "@/content/docs/resizable.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { ResizableDemo } from "./resizable-demo";

export function ResizableContent() {
  return (
    <DocPageRenderer page={pageData as any} demoRegistry={{ ResizableDemo }} />
  );
}

"use client";

import pageData from "@/content/docs/tree-view.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { TreeDemo } from "@/components/demo/tree";

export function TreeContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ TreeDemo }} />;
}

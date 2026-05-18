"use client";

import pageData from "@/content/docs/tree-view.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { TreeViewDemo } from "./tree-view-demo";

export function TreeViewContent() {
  return (
    <DocPageRenderer page={pageData as any} demoRegistry={{ TreeViewDemo }} />
  );
}

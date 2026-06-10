"use client";

import pageData from "@/content/docs/tree-view.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { TreeDemo } from "../../demo/tree";

export function TreeViewContent() {
  return (
    <DocPageRenderer page={pageData as any} demoRegistry={{ TreeDemo }} />
  );
}

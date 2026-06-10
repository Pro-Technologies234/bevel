"use client";

import pageData from "@/content/docs/sortable.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { SortableDemo } from "../../demo/sortable";

export function SortableContent() {
  return (
    <DocPageRenderer page={pageData as any} demoRegistry={{ SortableDemo }} />
  );
}

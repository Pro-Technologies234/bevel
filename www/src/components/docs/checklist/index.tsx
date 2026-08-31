"use client";

import pageData from "@/content/docs/checklist.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { ChecklistDemo } from "../../demo/checklist-demo";

export function ChecklistContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ ChecklistDemo }}
    />
  );
}

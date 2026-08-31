"use client";

import pageData from "@/content/docs/checklist.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { ChecklistDemo } from "@/components/demo/checklist";

export function ChecklistContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ ChecklistDemo }} />;
}

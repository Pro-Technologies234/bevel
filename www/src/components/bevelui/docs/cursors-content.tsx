"use client";

import pageData from "@/content/docs/cursors.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { CursorsDemo, CursorsTransportDemo } from "@/components/demo/cursors";

export function CursorsContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ CursorsDemo, CursorsTransportDemo }} />;
}

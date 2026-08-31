"use client";

import pageData from "@/content/docs/command-palette.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { CommandPaletteDemo } from "@/components/demo/command-palette";

export function CommandPaletteContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ CommandPaletteDemo }} />;
}

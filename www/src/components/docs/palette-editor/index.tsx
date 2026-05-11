"use client";

import pageData from "@/content/docs/palette-editor.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { PaletteEditorDemo } from "./palette-editor-demo";

export function PaletteEdiorContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ PaletteEditorDemo }}
    />
  );
}

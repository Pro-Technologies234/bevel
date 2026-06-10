"use client";

import pageData from "@/content/docs/properties-panel.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { PropertiesPanelDemo } from "../../demo/properties-panel";

export function PropertiesPanelContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ PropertiesPanelDemo }}
    />
  );
}

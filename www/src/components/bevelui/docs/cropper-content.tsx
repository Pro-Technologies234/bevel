"use client";

import pageData from "@/content/docs/cropper.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { CropperDemo, CropperCustomLayoutDemo } from "@/components/demo/cropper";

export function CropperContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ CropperDemo, CropperCustomLayoutDemo }} />;
}

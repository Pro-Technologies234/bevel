"use client";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import pageData from "@/content/docs/installation.json";

export function Installation() {
  return <DocPageRenderer page={pageData as any} />;
}

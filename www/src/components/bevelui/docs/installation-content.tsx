"use client";

import pageData from "@/content/docs/installation.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";

export function InstallationContent() {
  return <DocPageRenderer page={pageData as any} />;
}

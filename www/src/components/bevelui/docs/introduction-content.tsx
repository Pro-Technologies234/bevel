"use client";

import pageData from "@/content/docs/introduction.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";

export function IntroductionContent() {
  return <DocPageRenderer page={pageData as any} />;
}

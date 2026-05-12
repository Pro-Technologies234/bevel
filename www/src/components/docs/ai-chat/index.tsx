"use client";

import pageData from "@/content/docs/ai-chat.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { AIChatDemo } from "./ai-chat-demo";

export function AIChatContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ AIChatDemo }}
    />
  );
}

"use client";

import pageData from "@/content/docs/timeline.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { SequenceTimelineDemo, VideoTimelineDemo } from "./timeline-demo";

export function TimelineContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ VideoTimelineDemo, SequenceTimelineDemo }}
    />
  );
}

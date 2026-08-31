"use client";

import pageData from "@/content/docs/kanban.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { KanbanDemo } from "@/components/demo/kanban";

export function KanbanContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ KanbanDemo }} />;
}

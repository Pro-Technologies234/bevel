import doc from "@/content/docs/kanban.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { KanbanDemo } from "@/components/demo/kanban";
import type { DocPage } from "@/content/docs/doc-schema";

const demoRegistry = {
  KanbanDemo,
};

export function KanbanContent() {
  return <DocPageRenderer page={doc as any} demoRegistry={demoRegistry} />;
}

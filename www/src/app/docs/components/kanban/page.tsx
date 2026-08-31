import { KanbanContent } from "@/components/bevelui/docs/kanban-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("kanban");

export default function KanbanPage() {
  return <KanbanContent />;
}

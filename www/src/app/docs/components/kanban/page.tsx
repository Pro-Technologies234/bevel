import { KanbanContent } from "@/components/docs/kanban";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("kanban");

export default function KanbanPage() {
  return <KanbanContent />;
}


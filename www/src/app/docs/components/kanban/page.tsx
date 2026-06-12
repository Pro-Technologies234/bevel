import { docsKanbanMetadata } from "@/lib/metadata";
import { KanbanContent } from "@/components/docs/kanban";

export const metadata = docsKanbanMetadata;

export default function KanbanPage() {
  return <KanbanContent />;
}

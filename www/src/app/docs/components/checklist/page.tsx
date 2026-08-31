import { ChecklistContent } from "@/components/bevelui/docs/checklist-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("checklist");

export default function ChecklistPage() {
  return <ChecklistContent />;
}

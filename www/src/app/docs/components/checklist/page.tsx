import { ChecklistContent } from "@/components/docs/checklist";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("checklist");

export default function ChecklistPage() {
  return <ChecklistContent />;
}


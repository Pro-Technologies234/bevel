import { SortableContent } from "@/components/bevelui/docs/sortable-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("sortable");

export default function SortablePage() {
  return <SortableContent />;
}

import { SortableContent } from "@/components/docs/sortable";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("sortable");

export default function SortablePage() {
  return <SortableContent />;
}


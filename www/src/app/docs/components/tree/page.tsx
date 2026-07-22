import { TreeViewContent } from "@/components/docs/tree-view";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("tree");

export default function TreePage() {
  return <TreeViewContent />;
}


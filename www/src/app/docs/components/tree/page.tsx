import { TreeContent } from "@/components/bevelui/docs/tree-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("tree");

export default function TreePage() {
  return <TreeContent />;
}

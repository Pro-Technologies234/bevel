import { CursorsContent } from "@/components/bevelui/docs/cursors-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("cursors");

export default function CursorsPage() {
  return <CursorsContent />;
}

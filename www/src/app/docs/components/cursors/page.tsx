import { CursorsContent } from "@/components/docs/cursors";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("cursors");

export default function CursorsPage() {
  return <CursorsContent />;
}


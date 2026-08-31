import { ResizableContent } from "@/components/bevelui/docs/resizable-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("resizable");

export default function ResizablePage() {
  return <ResizableContent />;
}

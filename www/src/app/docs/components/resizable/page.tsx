import { ResizableContent } from "@/components/docs/resizable";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("resizable");

export default function ResizablePage() {
  return <ResizableContent />;
}


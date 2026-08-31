import { GalleryContent } from "@/components/bevelui/docs/gallery-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("gallery");

export default function GalleryPage() {
  return <GalleryContent />;
}

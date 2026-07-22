import { GalleryContent } from "@/components/docs/gallery";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("gallery");

export default function GalleryPage() {
  return <GalleryContent />;
}


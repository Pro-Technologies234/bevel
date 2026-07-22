import { CropperContent } from "@/components/docs/cropper";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("cropper");

export default function CropperPage() {
  return <CropperContent />;
}


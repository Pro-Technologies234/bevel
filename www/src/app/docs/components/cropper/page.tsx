import { CropperContent } from "@/components/bevelui/docs/cropper-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("cropper");

export default function CropperPage() {
  return <CropperContent />;
}

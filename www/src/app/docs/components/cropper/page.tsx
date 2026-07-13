import { docsCropperMetadata } from "@/lib/metadata";
import { CropperContent } from "@/components/docs/cropper";

export const metadata = docsCropperMetadata;

export default function CropperPage() {
  return <CropperContent />;
}

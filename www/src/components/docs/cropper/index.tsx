import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import cropperDoc from "@/content/docs/cropper.json";
import { CropperDemo, CropperCustomLayoutDemo } from "@/components/demo/cropper";

const demoRegistry = {
  CropperDemo,
  CropperCustomLayoutDemo,
};

export function CropperContent() {
  return <DocPageRenderer page={cropperDoc as any} demoRegistry={demoRegistry} />;
}

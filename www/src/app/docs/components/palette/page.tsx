import { PaletteEdiorContent } from "@/components/docs/palette-editor";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("palette");

export default function PalettePage() {
  return <PaletteEdiorContent />;
}


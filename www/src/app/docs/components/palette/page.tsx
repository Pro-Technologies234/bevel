import { PaletteContent } from "@/components/bevelui/docs/palette-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("palette");

export default function PalettePage() {
  return <PaletteContent />;
}

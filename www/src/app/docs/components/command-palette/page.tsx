import { docsCommandPaletteMetadata } from "@/lib/metadata";
import { CommandPaletteContent } from "@/components/bevelui/docs/command-palette-content";

export const metadata = docsCommandPaletteMetadata;

export default function CommandPalettePage() {
  return <CommandPaletteContent />;
}

import { CommandPaletteContent } from "@/components/bevelui/docs/command-palette-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("command-palette");

export default function CommandPalettePage() {
  return <CommandPaletteContent />;
}

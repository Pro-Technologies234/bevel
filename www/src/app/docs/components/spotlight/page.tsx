import { SpotlightContent } from "@/components/bevelui/docs/spotlight-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("spotlight");

export default function SpotlightPage() {
  return <SpotlightContent />;
}

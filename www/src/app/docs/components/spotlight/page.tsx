import { SpotlightContent } from "@/components/docs/spotlight";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("spotlight");

export default function SpotlightPage() {
  return <SpotlightContent />;
}


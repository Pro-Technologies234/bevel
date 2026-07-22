import { PropertiesPanelContent } from "@/components/docs/properties-panel";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("properties-panel");

export default function PropertiesPanelPage() {
  return <PropertiesPanelContent />;
}


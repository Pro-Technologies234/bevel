import { PropertiesPanelContent } from "@/components/bevelui/docs/properties-panel-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("properties-panel");

export default function PropertiesPanelPage() {
  return <PropertiesPanelContent />;
}

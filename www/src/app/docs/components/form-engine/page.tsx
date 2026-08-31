import { FormEngineContent } from "@/components/bevelui/docs/form-engine-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("form-engine");

export default function FormEnginePage() {
  return <FormEngineContent />;
}

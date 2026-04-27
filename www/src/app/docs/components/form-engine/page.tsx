import { docsFormEngineMetadata } from "@/lib/metadata";
import { FormEngineContent } from "@/components/bevelui/docs/form-engine-content";

export const metadata = docsFormEngineMetadata;

export default function FormEnginePage() {
  return <FormEngineContent />;
}

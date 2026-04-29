import { labsMetadata } from "@/lib/metadata";
import { LabsContent } from "@/components/labs";
export const metadata = labsMetadata;

export default function LabsPage() {
  return <LabsContent />;
}

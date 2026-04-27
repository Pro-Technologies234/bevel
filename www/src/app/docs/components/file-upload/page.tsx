import { docsFileUploadMetadata } from "@/lib/metadata";
import { FileUploadContent } from "@/components/bevelui/docs/file-upload-content";

export const metadata = docsFileUploadMetadata;

export default function FileUploadPage() {
  return <FileUploadContent />;
}

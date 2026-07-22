import { FileUploadContent } from "@/components/bevelui/docs/file-upload-content";
import { getSystemMetadata } from "@/content/docs/manifest";

export const metadata = getSystemMetadata("file-upload");

export default function FileUploadPage() {
  return <FileUploadContent />;
}


"use client";

import pageData from "@/content/docs/file-upload.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { FileUploadDemo } from "@/components/demo/file-upload";

export function FileUploadContent() {
  return <DocPageRenderer page={pageData as any} demoRegistry={{ FileUploadDemo }} />;
}

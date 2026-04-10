"use client";

import pageData from "@/content/docs/file-upload.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import { FileUploadRoot } from "@/components/bevelui/file-upload";

// ─── Simulated upload ─────────────────────────────────────────────────────────

async function simulateUpload(
  file: File,
  onProgress: (pct: number) => void,
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 15 + 5;
      if (progress >= 100) {
        clearInterval(interval);
        onProgress(100);
        // Files starting with "fail" trigger the error state for demo purposes
        if (file.name.toLowerCase().startsWith("fail")) {
          reject(new Error(`Simulated failure — file name starts with "fail"`));
        } else {
          resolve({ url: URL.createObjectURL(file) });
        }
      } else {
        onProgress(Math.min(Math.round(progress), 99));
      }
    }, 100);
  });
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function FileUploadDemo() {
  return (
    <div className="w-full max-w-xl">
      <FileUploadRoot
        onUpload={simulateUpload}
        config={{
          multiple: true,
          maxFiles: 8,
          maxSize: 10 * 1024 * 1024,
          title: "Drop your files here",
          description:
            "Any file type up to 10MB. Max 8 files. Name a file 'fail…' to test error handling.",
        }}
        onComplete={(files) =>
          console.log(
            "All uploaded:",
            files.map((f) => f.url),
          )
        }
        onError={(id, err) => console.error("Upload error:", id, err)}
      />
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function FileUploadPage() {
  return (
    <DocPageRenderer page={pageData as any} demoRegistry={{ FileUploadDemo }} />
  );
}

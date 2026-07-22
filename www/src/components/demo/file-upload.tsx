"use client";

import * as React from "react";
import { FileUploadRoot } from "@/components/bevelui/file-upload";
import { cn } from "@/lib/utils";
import {
  IconUpload,
  IconPhoto,
  IconFileText,
  IconFileZip,
  IconInfoCircle,
} from "@tabler/icons-react";

// ─── Upload simulation ─────────────────────────────────────────────────────────

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
        if (file.name.toLowerCase().startsWith("fail")) {
          reject(new Error(`Simulated failure — rename file to test error handling.`));
        } else {
          resolve({ url: URL.createObjectURL(file) });
        }
      } else {
        onProgress(Math.min(Math.round(progress), 99));
      }
    }, 100);
  });
}

// ─── Accepted type hints ───────────────────────────────────────────────────────

const TYPE_HINTS = [
  { icon: IconPhoto,    label: "Images",    ext: "PNG, JPG, WEBP" },
  { icon: IconFileText, label: "Documents", ext: "PDF, DOCX"      },
  { icon: IconFileZip,  label: "Archives",  ext: "ZIP, TAR"       },
];

// ─── Demo ──────────────────────────────────────────────────────────────────────

export function FileUploadDemo() {
  return (
    <div className="w-full max-w-xl flex flex-col gap-4">
      {/* Context header */}
      <div className="flex items-center justify-between px-1">
        <div className="flex items-center gap-2">
          <IconUpload size={14} className="text-muted-foreground" />
          <span className="text-[13px] font-semibold text-foreground">Upload assets</span>
        </div>
        <span className="text-[11px] text-muted-foreground/60">up to 10MB · 8 files max</span>
      </div>

      {/* Accepted types */}
      <div className="flex gap-2 flex-wrap">
        {TYPE_HINTS.map((t) => (
          <div
            key={t.label}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-muted/30 border border-border/50 text-[11px] text-muted-foreground/70"
          >
            <t.icon size={12} />
            <span className="font-medium">{t.label}</span>
            <span className="text-muted-foreground/40">{t.ext}</span>
          </div>
        ))}
      </div>

      {/* Uploader */}
      <FileUploadRoot
        onUpload={simulateUpload}
        config={{
          multiple: true,
          maxFiles: 8,
          maxSize: 10 * 1024 * 1024,
          title: "Drop files here, or click to browse",
          description: "Any file type · up to 10 MB per file",
        }}
        onComplete={(files) =>
          console.log("All uploaded:", files.map((f) => f.url))
        }
        onError={(id, err) => console.error("Upload error:", id, err)}
      />

      {/* Error test hint */}
      <div className="flex items-start gap-1.5 px-1">
        <IconInfoCircle size={12} className="text-muted-foreground/40 mt-0.5 shrink-0" />
        <span className="text-[11px] text-muted-foreground/40 font-mono leading-relaxed">
          Name a file <code className="text-muted-foreground/60">fail…</code> to simulate an upload error
        </span>
      </div>
    </div>
  );
}

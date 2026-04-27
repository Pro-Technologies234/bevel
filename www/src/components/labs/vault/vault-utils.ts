// ─── Utilities ────────────────────────────────────────────────────────────────

import { IconFile, IconFileText, IconFolder, IconPhoto, IconVideo } from "@tabler/icons-react";
import { FileItem } from "./vault-types";

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function getFileIcon(type: FileItem["type"]) {
  switch (type) {
    case "folder":
      return IconFolder;
    case "image":
      return IconPhoto;
    case "document":
      return IconFileText;
    case "video":
      return IconVideo;
    default:
      return IconFile;
  }
}

export function getFileColor(type: FileItem["type"]): string {
  switch (type) {
    case "folder":
      return "#f59e0b";
    case "image":
      return "#8b5cf6";
    case "document":
      return "#3b82f6";
    case "video":
      return "#ef4444";
    default:
      return "#6b7280";
  }
}

// Simulated upload — in a real app this hits your storage API
export async function simulateUpload(file: File, onProgress: (pct: number) => void) {
  await new Promise<void>((resolve) => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) {
        onProgress(100);
        clearInterval(t);
        resolve();
      } else onProgress(Math.round(p));
    }, 8000);
  });
  return { url: URL.createObjectURL(file) };
}

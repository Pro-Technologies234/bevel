import type React from "react";
import { Accept } from "react-dropzone";

// ─── Entry & Upload State ───────────────────────────────────────────────────────────

type FileEntryMeta =  {
    ext?: string;
    size?: string;
    [key: string]: unknown;
  };


export type FileEntry = {
  id: string;
  /** The Native browser file object */
  file: File;
  /** The current status of the file entry */
  status: "idle" | "uploading" | "done" | "error";
  /** 1 - 100 */
  progress: number;
  /** The error message if status  === "error" */
  error?: string;
  /** The File URL if status === "done" */
  url?: string;
  /** The File Meta data */
  meta?: FileEntryMeta
};

// ─── Upload COnfig ───────────────────────────────────────────────────────────

export type FileUploadConfig = {
  /** Accepted MIME types e.g. ["image/*", "application/pdf"] */
  accept?: Accept;
  /** Max file size in bytes */
  maxSize?: number;
  /** Max number of files */
  maxFiles?: number;
  /** Allow selecting multiple files at once */
  multiple?: boolean;
  /** Dropzone title */
  title?: string;
  /** Dropzone description shows on the dropzone */
  description?: string;
  /** Dropzone icon shows on the dropzone */
  icon?: React.ReactNode;
  /** Upload file automaticaly */
  auto?: boolean;
  /** Upload file automaticaly */
  initialFiles?: FileEntry[];
};

// ─── Context ───────────────────────────────────────────────────────────

export type FileUploadContextValue = {
  // State
  files: FileEntry[];
  isDragging: boolean;
  isUploading: boolean;

  // Config (read by dropzone to show hints)
  config: FileUploadConfig;

  // Actions
  setIsDragging: (v: boolean) => void;
  addFiles: (files: File[]) => void;
  removeFile: (id: string) => void;
  uploadFile: (id: string) => void;
  uploadAll: () => void;
  removeAll: () => void;
  cancelFile: (id: string) => void;
  retryFile: (id: string) => void;
};

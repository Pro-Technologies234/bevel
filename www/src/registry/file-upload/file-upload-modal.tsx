"use client";

import * as React from "react";
import Dropzone from "react-dropzone";
import { AnimatePresence, motion } from "motion/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  IconUpload,
  IconX,
  IconVideo,
  IconFile,
  IconPhoto,
  IconFileTypePdf,
} from "@tabler/icons-react";
import {
  FileUploadProvider,
  type FileUploadProviderProps,
} from "./file-upload-context";
import { useFileUpload } from "./file-upload-context";
import type { FileEntry, FileUploadConfig } from "./file-upload-types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatTimeLeft(progress: number, fileSize: number): string {
  if (progress >= 100) return "Done";
  if (progress === 0) return "Starting...";
  const remaining = Math.round(((100 - progress) / progress) * 3);
  return `${remaining} sec left`;
}

function getFileExt(file: File): string {
  return file.name.split(".").pop()?.toUpperCase() ?? "FILE";
}

function FileIcon({ file, size = 22 }: { file: File; size?: number }) {
  const type = file.type;
  const stroke = 1.8;
  if (type.startsWith("video/"))
    return <IconVideo size={size} strokeWidth={stroke} className="text-primary" />;
  if (type.startsWith("image/"))
    return <IconPhoto size={size} strokeWidth={stroke} className="text-primary" />;
  if (type === "application/pdf")
    return <IconFileTypePdf size={size} strokeWidth={stroke} className="text-primary" />;
  return <IconFile size={size} strokeWidth={stroke} className="text-primary" />;
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({ progress, status }: Pick<FileEntry, "progress" | "status">) {
  return (
    <div className="w-full overflow-hidden rounded-full h-1 bg-primary/15">
      <motion.div
        className={cn(
          "h-full rounded-full",
          status === "done" ? "bg-emerald-500"
          : status === "error" ? "bg-red-500"
          : "bg-primary",
        )}
        initial={{ width: "0%" }}
        animate={{ width: `${progress}%` }}
        transition={{ duration: 0.35, ease: "easeOut" }}
      />
    </div>
  );
}

// ─── File item row ────────────────────────────────────────────────────────────

function FileItemRow({
  entry,
  onRemove,
}: {
  entry: FileEntry;
  onRemove: (id: string) => void;
}) {
  const ext = getFileExt(entry.file);
  const size = formatBytes(entry.file.size);
  const timeLeft = entry.status === "uploading"
    ? formatTimeLeft(entry.progress, entry.file.size)
    : entry.status === "done" ? "Done" : "";

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col gap-2.5 rounded-2xl border border-border/60 bg-background px-4 py-3.5 shadow-sm"
    >
      <div className="flex items-center gap-3">
        {/* File type icon pill */}
        <div className="w-11 h-11 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
          <FileIcon file={entry.file} size={22} />
        </div>

        {/* File info */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold truncate text-foreground leading-tight">
            {entry.file.name.replace(/\.[^/.]+$/, "")}
          </p>
          <p className="text-xs text-muted-foreground mt-0.5">
            {ext} · {size}
            {timeLeft && ` · ${timeLeft}`}
          </p>
        </div>

        {/* Remove button */}
        <button
          onClick={() => onRemove(entry.id)}
          className="w-8 h-8 rounded-full border border-border/60 bg-background flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
        >
          <IconX size={14} strokeWidth={2.5} />
        </button>
      </div>

      {/* Progress bar — only show when not idle */}
      {entry.status !== "idle" && (
        <ProgressBar progress={entry.progress} status={entry.status} />
      )}

      {/* Error message */}
      {entry.status === "error" && entry.error && (
        <p className="text-[11px] text-red-500">{entry.error}</p>
      )}
    </motion.div>
  );
}

// ─── Inner content (shared between dialog and inline) ─────────────────────────

interface FileUploadContentProps {
  config: FileUploadConfig;
  onCancel: () => void;
}

function FileUploadContent({ config, onCancel }: FileUploadContentProps) {
  const { files, addFiles, removeFile, uploadAll, uploadFile, isUploading, isDragging, setIsDragging } =
    useFileUpload();

  const {
    accept,
    multiple = true,
    maxFiles,
    maxSize,
    title = "Drop your file here",
    description = "For best results, uploads should be in a supported format.",
    icon,
  } = config;

  const pendingCount = files.filter((f) => f.status === "idle").length;
  const hasFiles = files.length > 0;

  return (
    <div className="flex flex-col gap-4">
      {/* Dropzone */}
      <Dropzone
        accept={accept}
        multiple={multiple}
        maxFiles={maxFiles}
        maxSize={maxSize}
        onDragEnter={() => setIsDragging(true)}
        onDragLeave={() => setIsDragging(false)}
        onDropAccepted={(f) => { setIsDragging(false); addFiles(f); }}
        onDropRejected={() => setIsDragging(false)}
      >
        {({ getInputProps, getRootProps }) => (
          <div
            {...getRootProps()}
            className={cn(
              "relative flex flex-col items-center justify-center gap-4",
              "rounded-2xl border-2 border-dashed cursor-pointer",
              "px-6 py-8 text-center select-none transition-colors duration-150",
              isDragging
                ? "bg-primary/5 border-primary"
                : "bg-muted/30 border-border hover:border-primary/40 hover:bg-muted/50",
            )}
          >
            <input {...getInputProps()} />

            {/* Title */}
            <p className="text-base font-semibold text-foreground">
              {title}
            </p>

            {/* Circular icon */}
            <div
              className={cn(
                "w-20 h-20 rounded-full flex items-center justify-center transition-all duration-200",
                "bg-primary/10",
                isDragging && "scale-110 bg-primary/20",
              )}
            >
              {icon ?? (
                <IconUpload size={28} strokeWidth={1.8} className="stroke-primary" />
              )}
            </div>

            {/* Description */}
            <p className="text-sm text-muted-foreground max-w-xs leading-relaxed">
              {description}
            </p>
          </div>
        )}
      </Dropzone>

      {/* File list */}
      <AnimatePresence>
        {hasFiles && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col gap-2"
          >
            {files.map((entry) => (
              <FileItemRow
                key={entry.id}
                entry={entry}
                onRemove={removeFile}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Footer buttons */}
      <div className="flex items-center gap-3 pt-1">
        <Button
          variant="outline"
          className="flex-1 h-12 rounded-2xl text-sm font-medium cursor-pointer"
          onClick={onCancel}
        >
          Cancel
        </Button>
        <Button
          className="flex-1 h-12 rounded-2xl text-sm font-semibold cursor-pointer"
          disabled={!hasFiles || isUploading || pendingCount === 0}
          onClick={uploadAll}
        >
          {isUploading ? "Uploading..." : "Upload"}
        </Button>
      </div>
    </div>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface FileUploadModalProps
  extends Omit<FileUploadProviderProps, "children"> {
  /**
   * true  → renders inside a shadcn Dialog (default)
   * false → renders inline in the DOM
   */
  asDialog?: boolean;
  /** Controlled open state (dialog mode only) */
  open?: boolean;
  /** Called when the dialog should close */
  onOpenChange?: (open: boolean) => void;
  /** Dialog title shown in the header */
  dialogTitle?: string;
}

export function FileUploadModal({
  asDialog = true,
  open,
  onOpenChange,
  dialogTitle = "Upload file",
  config = {},
  onUpload,
  onComplete,
  onError,
}: FileUploadModalProps) {
  const handleCancel = () => onOpenChange?.(false);

  const inner = (
    <FileUploadProvider
      config={config}
      onUpload={onUpload}
      onComplete={(files) => {
        onComplete?.(files);
        onOpenChange?.(false);
      }}
      onError={onError}
    >
      <FileUploadContent config={config} onCancel={handleCancel} />
    </FileUploadProvider>
  );

  if (!asDialog) return inner;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl p-6 gap-0">
        <DialogHeader className="mb-4">
          <DialogTitle className="text-base font-semibold">
            {dialogTitle}
          </DialogTitle>
        </DialogHeader>
        {inner}
      </DialogContent>
    </Dialog>
  );
}

"use client";

import { cn } from "@/lib/utils";
import type { FileEntry } from "./file-upload-types";
import { motion, AnimatePresence } from "motion/react";
import {
  IconCheck,
  IconFile,
  IconFileTypePdf,
  IconFileTypeXls,
  IconLoader2,
  IconPhoto,
  IconX,
  IconAlertCircle,
  IconRefresh,
  IconVideo,
} from "@tabler/icons-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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

function FileTypeIcon({ file }: { file: File }) {
  const type = file.type;
  const size = 20;
  const stroke = 1.6;

  if (type.startsWith("image/"))
    return (
      <IconPhoto size={size} strokeWidth={stroke} className="text-blue-500" />
    );
  if (type === "application/pdf")
    return (
      <IconFileTypePdf
        size={size}
        strokeWidth={stroke}
        className="text-red-500"
      />
    );
  if (
    type.includes("spreadsheet") ||
    type.includes("excel") ||
    file.name.endsWith(".xlsx")
  )
    return (
      <IconFileTypeXls
        size={size}
        strokeWidth={stroke}
        className="text-green-600"
      />
    );
  return (
    <IconFile
      size={size}
      strokeWidth={stroke}
      className="text-muted-foreground"
    />
  );
}

// ─── Progress bar ─────────────────────────────────────────────────────────────

function ProgressBar({
  progress,
  status,
}: Pick<FileEntry, "progress" | "status">) {
  return (
    <div className="w-full space-y-1">
      <div className="overflow-hidden rounded-full h-1 bg-muted-foreground/10 w-full">
        <motion.div
          className={cn(
            "h-full rounded-full",
            status === "done"
              ? "bg-green-500 dark:bg-green-400"
              : status === "error"
                ? "bg-red-500"
                : "bg-primary",
          )}
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.35, ease: "easeOut" }}
        />
      </div>
    </div>
  );
}

function FileIcon({ file, size = 22 }: { file: File; size?: number }) {
  const type = file.type;
  const stroke = 1.8;
  if (type.startsWith("video/"))
    return (
      <IconVideo size={size} strokeWidth={stroke} className="text-primary" />
    );
  if (type.startsWith("image/"))
    return (
      <IconPhoto size={size} strokeWidth={stroke} className="text-primary" />
    );
  if (type === "application/pdf")
    return (
      <IconFileTypePdf
        size={size}
        strokeWidth={stroke}
        className="text-primary"
      />
    );
  return <IconFile size={size} strokeWidth={stroke} className="text-primary" />;
}

// ─── Status indicator ─────────────────────────────────────────────────────────

function StatusIndicator({ status }: Pick<FileEntry, "status">) {
  if (status === "done") {
    return (
      <div className="w-5 h-5 rounded-full bg-green-500/15 flex items-center justify-center shrink-0">
        <IconCheck
          size={11}
          strokeWidth={2.5}
          className="dark:text-green-400 text-green-500"
        />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="w-5 h-5 rounded-full bg-red-500/15 flex items-center justify-center shrink-0">
        <IconAlertCircle size={11} strokeWidth={2.5} className="text-red-500" />
      </div>
    );
  }
  if (status === "uploading") {
    return (
      <IconLoader2 size={12} className="animate-spin text-primary shrink-0" />
    );
  }
  return null;
}

// ─── FileUploadItem ───────────────────────────────────────────────────────────

export interface FileUploadItemProps extends FileEntry {
  /** Show as a list row instead of a grid card */
  isList?: boolean;
  onRemove?: (id: string) => void;
  onRetry?: (id: string) => void;
  onCancel?: (id: string) => void;
}

export function FileUploadItem({
  id,
  file,
  status,
  progress,
  error,
  url,
  isList = false,
  onRemove,
  onRetry,
  onCancel,
}: FileUploadItemProps) {
  const ext = getFileExt(file);
  const size = formatBytes(file.size);
  const timeLeft =
    status === "uploading"
      ? formatTimeLeft(progress, file.size)
      : status === "error"  ?  "Error":  status === "done"
        ? "Done"
        : "";
  if (isList) {
    return (
      <motion.div
        layout
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.2 }}
        className="flex flex-col gap-2.5 rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5 shadow-sm"
      >
        <div className="flex items-center gap-3">
        {/* File type icon pill */}
        <div
          className={cn(
            "w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center ",
            status === "error" && "bg-red-500/10",
          )}
        >
          {status === "error" ? (
            onRetry && (
              <button
                onClick={() => onRetry(id)}
                type="button"
                className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1 text-xl cursor-pointer"
              >
                <IconRefresh size={24} strokeWidth={2} />
              </button>
            )
          ) : (
            <FileIcon file={file} size={22} />
          )}
        </div>

          {/* File info */}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground leading-tight">
              {file.name.replace(/\.[^/.]+$/, "")}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-between gap-4">
              {ext} · {size}
                      <span className="flex items-center gap-1 text-xs">
          <Popover  >
            <PopoverTrigger>
              <StatusIndicator status={status} />
            </PopoverTrigger>
            <PopoverContent className="max-w-40" dir="bottom" side="top" >
              {/* Error message */}
              {status === "error" && error && (
                <p className="text-[11px] dark:text-red-500 text-red-600">{error}</p>
              )}
            </PopoverContent>
          </Popover>
          {timeLeft && `${timeLeft}`}
        </span>
            </p>
          </div>

          {/* Remove button */}
          <button
            onClick={() => onRemove?.(id)}
            className="w-8 h-8 rounded-full border border-border/60 bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
          >
            <IconX size={14} strokeWidth={2.5} />
          </button>
        </div>

        {/* Progress bar — only show when not idle */}
        {status !== "idle" && (
          <ProgressBar progress={progress} status={status} />
        )}

        {/* Error message */}
        {status === "error" && error && (
          <p className="text-[11px] text-red-500">{error}</p>
        )}
      </motion.div>
    );
  }
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.2 }}
      className="flex flex-col  rounded-xl border border-border/60 bg-muted/20 px-4 py-3.5 shadow-sm relative aspect-square justify-between"
    >
      <div className=" absolute inset-x-0 top-0 p-2 flex items-center justify-between">
        <span className="flex items-center gap-1 text-xs">
          <Popover  >
            <PopoverTrigger>
              <StatusIndicator status={status} />
            </PopoverTrigger>
            <PopoverContent className="max-w-40" dir="bottom" side="top" >
              {/* Error message */}
              {status === "error" && error && (
                <p className="text-[11px] dark:text-red-500 text-red-600">{error}</p>
              )}
            </PopoverContent>
          </Popover>
          {timeLeft && `${timeLeft}`}
        </span>
        {/* Remove button */}
        <button
          onClick={() => onRemove?.(id)}
          className="w-6 h-6 rounded-md border border-border/60 bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
        >
          <IconX size={12} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex flex-col items-center flex-1  justify-end pt-4 pb-2">
        {/* File type icon pill */}
        <div
          className={cn(
            "w-11 h-11 rounded-lg bg-primary/10 flex items-center justify-center ",
            status === "error" && "bg-red-500/10",
          )}
        >
          {status === "error" ? (
            onRetry && (
              <button
                onClick={() => onRetry(id)}
                type="button"
                className="text-[10px] text-red-500 hover:text-red-400 flex items-center gap-1 text-xl cursor-pointer"
              >
                <IconRefresh size={24} strokeWidth={2} />
              </button>
            )
          ) : (
            <FileIcon file={file} size={22} />
          )}
        </div>
      </div>

      {/* File info */}
      <div className=" space-y-2">
        <div className="">
          <p className="text-xs font-medium line-clamp-1 text-foreground">
            {file.name.replace(/\.[^/.]+$/, "")}
          </p>
          <div className="text-xs text-muted-foreground mt-0.5">
            {ext} · {size}
          </div>
        </div>

        {/* Progress bar — only show when not idle */}
        {status !== "idle" && (
          <ProgressBar progress={progress} status={status} />
        )}
      </div>
    </motion.div>
  );
}

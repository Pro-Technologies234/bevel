import { cn } from "@/lib/utils";
import type { FileEntry } from "./types";
import { motion } from "motion/react";
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
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { formatBytes, formatTimeLeft, getFileExt } from "./file-upload-utils";

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

function FileTypeIcon({ file, size = 22 }: { file: File; size?: number }) {
  const type = file.type;
  const stroke = 1.8;
  if (type.startsWith("video/"))
    return (
      <IconVideo size={size} strokeWidth={stroke} className="stroke-primary" />
    );
  if (type.startsWith("image/"))
    return (
      <IconPhoto size={size} strokeWidth={stroke} className="stroke-primary" />
    );
  if (type === "application/pdf")
    return (
      <IconFileTypePdf
        size={size}
        strokeWidth={stroke}
        className="stroke-primary"
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
        className="stroke-primary"
      />
    );
  return (
    <IconFile size={size} strokeWidth={stroke} className="stroke-primary" />
  );
}

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
  meta,
  url,
  isList = false,
  onRemove,
  onRetry,
  onCancel,
}: FileUploadItemProps) {
  const timeLeft =
    status === "uploading"
      ? formatTimeLeft(progress)
      : status === "error"
        ? "Error"
        : status === "done"
          ? "Done"
          : "";
  const hasError = status === "error" && !!error;
  const name = file.name.replace(/\.[^/.]+$/, "");
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
              <FileTypeIcon file={file} size={22} />
            )}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold truncate text-foreground leading-tight">
              {name}
            </p>
            <p className="text-xs text-muted-foreground mt-0.5 flex items-center justify-between gap-4">
              {meta?.ext} · {meta?.size}
              <span className="flex items-center gap-1 text-xs">
                <StatusIndicator status={status} />
                {timeLeft && `${timeLeft}`}
              </span>
            </p>
          </div>

          <button
            onClick={() => onRemove?.(id)}
            className="w-8 h-8 rounded-full border border-border/60 bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
          >
            <IconX size={14} strokeWidth={2.5} />
          </button>
        </div>

        {status !== "idle" && (
          <ProgressBar progress={progress} status={status} />
        )}
        {hasError && <p className="text-[11px] text-red-500">{error}</p>}
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
          <Popover>
            <PopoverTrigger>
              <StatusIndicator status={status} />
            </PopoverTrigger>
            <PopoverContent className="max-w-40" dir="bottom" side="top">
              {hasError && (
                <p className="text-[11px] dark:text-red-500 text-red-600">
                  {error}
                </p>
              )}
            </PopoverContent>
          </Popover>
          {timeLeft && `${timeLeft}`}
        </span>
        <button
          onClick={() => onRemove?.(id)}
          className="w-6 h-6 rounded-md border border-border/60 bg-muted/20 flex items-center justify-center text-muted-foreground hover:text-foreground hover:border-border transition-colors shrink-0"
        >
          <IconX size={12} strokeWidth={2.5} />
        </button>
      </div>
      <div className="flex flex-col items-center flex-1  justify-end pt-4 pb-2">
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
            <FileTypeIcon file={file} size={22} />
          )}
        </div>
      </div>

      <div className=" space-y-2">
        <div className="">
          <p className="text-xs font-medium line-clamp-1 text-foreground">
            {name}
          </p>
          <div className="text-xs text-muted-foreground mt-0.5">
            {meta?.ext} · {meta?.size}
          </div>
        </div>

        {status !== "idle" && (
          <ProgressBar progress={progress} status={status} />
        )}
      </div>
    </motion.div>
  );
}

import { useState } from "react";
import { useFileUpload } from "./file-upload-context";
import { FileUploadItem } from "./file-upload-item";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  IconClearAll,
  IconLayoutGrid,
  IconList,
  IconUpload,
} from "@tabler/icons-react";
import { AnimatePresence } from "motion/react";

export function FileUploadList() {
  const {
    config,
    files,
    removeFile,
    uploadAll,
    removeAll,
    cancelFile,
    retryFile,
    isUploading,
  } = useFileUpload();
  const { auto } = config;
  const [isList, setIsList] = useState(false);

  if (files.length === 0) return null;

  const pendingCount = files.filter((f) => f.status === "idle").length;
  const doneCount = files.filter((f) => f.status === "done").length;

  return (
    <section className="@container/upload-list not-visited:flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          {files.length} file{files.length !== 1 ? "s" : ""}
          {doneCount > 0 && ` · ${doneCount} uploaded`}
        </span>

        <div className="flex items-center gap-1.5">
          {files.length > 0 && (
            <Button onClick={removeAll} variant={"destructive"} size={"sm"}>
              <IconClearAll />
              Clear all
            </Button>
          )}
          <div className="flex items-center rounded-sm border border-border/60 overflow-hidden">
            <button
              onClick={() => setIsList(false)}
              className={cn(
                "flex items-center justify-center w-7 h-7 transition-colors",
                !isList
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              title="Grid view"
            >
              <IconLayoutGrid size={14} strokeWidth={1.8} />
            </button>
            <button
              onClick={() => setIsList(true)}
              className={cn(
                "flex items-center justify-center w-7 h-7 transition-colors",
                isList
                  ? "bg-muted text-foreground"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
              )}
              title="List view"
            >
              <IconList size={14} strokeWidth={1.8} />
            </button>
          </div>
        </div>
      </div>

      <div
        className={cn(
          isList
            ? "flex flex-col gap-2"
            : "grid grid-cols-2 gap-2 @md/upload-list:grid-cols-3 @lg/upload-list:grid-cols-4 @2xl/upload-list:grid-cols-5 @4xl/upload-list:grid-cols-6",
        )}
      >
        <AnimatePresence>
          {files.map((file) => (
            <FileUploadItem
              key={file.id}
              {...file}
              isList={isList}
              onRemove={removeFile}
              onCancel={cancelFile}
              onRetry={retryFile}
            />
          ))}
        </AnimatePresence>
      </div>

      {pendingCount > 0 && !auto && (
        <div className="flex justify-end">
          <Button
            onClick={uploadAll}
            disabled={isUploading}
            className="gap-2 cursor-pointer"
          >
            <IconUpload size={14} strokeWidth={2} />
            {isUploading
              ? "Uploading..."
              : `Upload ${pendingCount} file${pendingCount !== 1 ? "s" : ""}`}
          </Button>
        </div>
      )}
    </section>
  );
}

import { FileEntry, useFileUpload } from "@/components/bevelui/file-upload";
import { Button } from "@/components/ui/button";
import { Card, CardHeader } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { IconFile, IconRefresh, IconX } from "@tabler/icons-react";
import { motion } from "motion/react";
import { formatBytes, getFileColor, getFileIcon } from "./vault-utils";
import { FileItem } from "./vault-types";
// ─── Upload Queue Overlay ─────────────────────────────────────────────────────
export function VaultUploadQueue() {
  const { files, uploadAll, isUploading, removeFile, retryFile } =
    useFileUpload();
  const active = files.filter((f) => f.status !== "done");
  if (!active.length) return null;

  return (
    <motion.div
      initial={{ y: 80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 80, opacity: 0 }}
      className="fixed bottom-6 right-6 z-50 w-80"
    >
      <Card className="overflow-hidden shadow-2xl border-border/60">
        <CardHeader className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <span className="text-sm font-medium">
            {isUploading
              ? `Uploading ${active.length} file${active.length > 1 ? "s" : ""}…`
              : `${active.length} file${active.length > 1 ? "s" : ""} queued`}
          </span>
          {!isUploading && (
            <Button
              size="sm"
              className="h-7 text-xs rounded-full"
              onClick={uploadAll}
            >
              Upload all
            </Button>
          )}
        </CardHeader>
        <ScrollArea className="max-h-52">
          {/* removed divide-y; borders handled by UploadCard */}
          <div>
            {active.map((f) => (
              <UploadCard
                key={f.id}
                removeFile={removeFile}
                retryFile={retryFile}
                file={f}
              />
            ))}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

function UploadCard({
  file,
  retryFile,
  removeFile,
}: {
  file: FileEntry;
  retryFile: (id: string) => void;
  removeFile: (id: string) => void;
}) {
  const type = file.file.type.startsWith("image/")
    ? "image"
    : file.file.type.includes("video")
      ? "video"
      : file.file.type.includes("pdf") || file.file.type.includes("doc")
        ? "document"
        : "file";
  const Icon = getFileIcon(type);
  const color = getFileColor(type);
  return (
    <div className="flex items-center gap-3 px-4 py-2.5 not-first:border-t last:border-b border-border/60">
      <div
        style={{ background: `${color}18` }}
        className="size-8 rounded-md bg-muted flex items-center justify-center shrink-0"
      >
        <Icon size={18} color={color} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-xs font-medium line-clamp-1">{file.file.name}</p>
        {file.status === "uploading" && (
          <Progress value={file.progress} className="h-1 mt-1.5 w-auto" />
        )}
        {file.status === "error" && (
          <p className="text-[10px] text-destructive mt-0.5 truncate">
            {file.error}
          </p>
        )}
        {file.status === "idle" && (
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {formatBytes(file.file.size)}
          </p>
        )}
      </div>
      {file.status === "uploading" && (
        <span className="text-[10px] text-muted-foreground shrink-0">
          {Math.round(file.progress)}%
        </span>
      )}
      {file.status === "error" && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          onClick={() => retryFile(file.id)}
        >
          <IconRefresh size={12} />
        </Button>
      )}
      {file.status === "idle" && (
        <Button
          variant="ghost"
          size="icon"
          className="size-6 shrink-0"
          onClick={() => removeFile(file.id)}
        >
          <IconX size={12} />
        </Button>
      )}
    </div>
  );
}

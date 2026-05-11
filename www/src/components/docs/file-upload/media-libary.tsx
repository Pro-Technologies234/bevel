"use client";

import pageData from "@/content/docs/file-upload.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  FileUploadDropzone,
  FileUploadRoot,
  useFileUpload,
  type FileEntry,
} from "@/components/bevelui/file-upload";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";

// ── tabler icons (kept your imports) ─────────────────────────────────────────
import {
  IconCloudUpload,
  IconFile,
  IconFileTypePdf,
  IconFileTypeDoc,
  IconFileTypeXls,
  IconFileTypePpt,
  IconFileTypeZip,
  IconFileText,
  IconPhoto,
  IconVideo,
  IconMusic,
  IconFolder,
  IconGridDots,
  IconList,
  IconSearch,
  IconFilter,
  IconTrash,
  IconDownload,
  IconEye,
  IconArrowUp,
  IconClock,
  IconDatabase,
  IconRefresh,
  IconPlayerPlay,
  IconSquare,
  IconAlertCircle,
  IconCircleCheck,
  IconDotsVertical,
} from "@tabler/icons-react";

// ── shadcn/ui components ─────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import {
  Card,
  CardAction,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

/* ────────────────────────────────────────────────────────────────────────────
   Helpers
   ──────────────────────────────────────────────────────────────────────────── */

function simulateUpload(
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

function getFileIcon(fileName: string) {
  const ext = fileName.split(".").pop()?.toLowerCase() || "";
  if (["jpg", "jpeg", "png", "gif", "webp", "svg", "bmp"].includes(ext))
    return <IconPhoto size={16} strokeWidth={1.8} className="text-blue-400" />;
  if (["mp4", "mov", "avi", "webm", "mkv"].includes(ext))
    return (
      <IconVideo size={16} strokeWidth={1.8} className="text-purple-400" />
    );
  if (["mp3", "wav", "ogg", "flac", "aac"].includes(ext))
    return <IconMusic size={16} strokeWidth={1.8} className="text-green-400" />;
  if (ext === "pdf")
    return (
      <IconFileTypePdf size={16} strokeWidth={1.8} className="text-red-400" />
    );
  if (["doc", "docx"].includes(ext))
    return (
      <IconFileTypeDoc size={16} strokeWidth={1.8} className="text-blue-500" />
    );
  if (["xls", "xlsx", "csv"].includes(ext))
    return (
      <IconFileTypeXls
        size={16}
        strokeWidth={1.8}
        className="text-emerald-500"
      />
    );
  if (["ppt", "pptx"].includes(ext))
    return (
      <IconFileTypePpt
        size={16}
        strokeWidth={1.8}
        className="text-orange-500"
      />
    );
  if (["zip", "rar", "7z", "tar", "gz"].includes(ext))
    return (
      <IconFileTypeZip
        size={16}
        strokeWidth={1.8}
        className="text-yellow-500"
      />
    );
  if (["txt", "md", "json", "js", "ts", "html", "css"].includes(ext))
    return (
      <IconFileText size={16} strokeWidth={1.8} className="text-gray-400" />
    );
  return (
    <IconFile size={16} strokeWidth={1.8} className="text-muted-foreground" />
  );
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

/* ────────────────────────────────────────────────────────────────────────────
   Status Badge – shadcn Badge variant mapper
   ──────────────────────────────────────────────────────────────────────────── */

function StatusBadge({
  status,
  progress,
}: {
  status: FileEntry["status"];
  progress?: number;
}) {
  switch (status) {
    case "uploading":
      return (
        <Badge
          variant="outline"
          className="text-yellow-200 border-yellow-200/30 bg-yellow-200/10 gap-0.5"
        >
          <IconArrowUp size={10} className="animate-pulse" />
          {progress}%
        </Badge>
      );
    case "done":
      return (
        <Badge
          variant="outline"
          className="text-green-500 border-green-500/30 bg-green-500/10 gap-0.5"
        >
          <IconCircleCheck size={13} />
          Complete
        </Badge>
      );
    case "error":
      return (
        <Badge variant="destructive" className="gap-0.5">
          <IconAlertCircle size={10} />
          Failed
        </Badge>
      );
    default:
      return (
        <Badge variant="secondary" className="gap-0.5">
          <IconClock size={10} />
          Pending
        </Badge>
      );
  }
}

/* ────────────────────────────────────────────────────────────────────────────
   Existing Files (demo data)
   ──────────────────────────────────────────────────────────────────────────── */

const DEMO_EXISTING_FILES = [
  { name: "presentation.pptx", size: 3.2 * 1024 * 1024, date: "2 hours ago" },
  { name: "hero-image.png", size: 1.8 * 1024 * 1024, date: "Yesterday" },
  { name: "documentation.pdf", size: 542 * 1024, date: "3 days ago" },
  { name: "design-system.fig", size: 8.7 * 1024 * 1024, date: "Last week" },
] as const;

type ExistingFile = (typeof DEMO_EXISTING_FILES)[number];

/* ────────────────────────────────────────────────────────────────────────────
   Grid Card – existing file
   ──────────────────────────────────────────────────────────────────────────── */

/* ────────────────────────────────────────────────────────────────────────────
   Table Row – existing file
   ──────────────────────────────────────────────────────────────────────────── */

function ExistingFileRow({ file }: { file: ExistingFile }) {
  return (
    <TableRow className="group cursor-pointer">
      <TableCell className="flex items-center gap-2">
        {getFileIcon(file.name)}
        <span className="truncate max-w-[200px]">{file.name}</span>
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {formatFileSize(file.size)}
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {file.date}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <IconEye size={14} />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <IconDownload size={14} />
          </Button>
          <Button size="icon" variant="ghost" className="h-7 w-7">
            <IconTrash size={14} />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Table Row – upload queue file
   ──────────────────────────────────────────────────────────────────────────── */

function UploadFileRow({
  fileEntry,
  onRemove,
  onRetry,
}: {
  fileEntry: FileEntry;
  onRemove: () => void;
  onRetry: () => void;
}) {
  return (
    <TableRow className="group">
      <TableCell className="flex items-center gap-2">
        {getFileIcon(fileEntry.file.name)}
        <span className="truncate max-w-[200px]">{fileEntry.file.name}</span>
      </TableCell>
      <TableCell className="text-muted-foreground text-xs">
        {formatFileSize(fileEntry.file.size)}
      </TableCell>
      <TableCell>
        {fileEntry.status === "uploading" ? (
          <div className="flex items-center gap-2">
            <Progress value={fileEntry.progress ?? 0} className="h-1 w-16" />
            <StatusBadge
              status={fileEntry.status}
              progress={fileEntry.progress}
            />
          </div>
        ) : (
          <StatusBadge status={fileEntry.status} />
        )}
      </TableCell>
      <TableCell className="text-right">
        <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100">
          {fileEntry.status === "error" && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onRetry}
            >
              <IconRefresh size={14} />
            </Button>
          )}
          {fileEntry.status !== "uploading" && (
            <Button
              size="icon"
              variant="ghost"
              className="h-7 w-7"
              onClick={onRemove}
            >
              <IconTrash size={14} />
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
}

/* ────────────────────────────────────────────────────────────────────────────
   Main Content
   ──────────────────────────────────────────────────────────────────────────── */

function MediaLibraryContent() {
  const { files, removeFile, cancelFile, retryFile, uploadAll, isUploading } =
    useFileUpload();

  const [searchQuery, setSearchQuery] = useState("");

  const filteredFiles = useMemo(() => {
    if (!searchQuery) return files;
    return files.filter((f) =>
      f.file.name.toLowerCase().includes(searchQuery.toLowerCase()),
    );
  }, [files, searchQuery]);

  const pendingCount = files.filter((f) => f.status === "idle").length;
  const uploadingCount = files.filter((f) => f.status === "uploading").length;
  const doneCount = files.filter((f) => f.status === "done").length;
  const errorCount = files.filter((f) => f.status === "error").length;

  return (
    <div className="w-full max-w-4xl mx-auto">
      <div className="rounded-xl border bg-card text-card-foreground shadow-xl overflow-hidden">
        <div className="border-b bg-muted/5 px-2 md:px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Media Library
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Manage your assets, upload new files, and organize your content
              </p>
            </div>
          </div>
          <InputGroup className="mt-2 h-8">
            <InputGroupAddon>
              <IconSearch />
            </InputGroupAddon>
            <InputGroupInput
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </InputGroup>
        </div>

        <div className="px-2 md:px-5 py-2 bg-muted/5 border-b flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <IconDatabase size={14} />
            <span>Storage: 2.4 GB of 10 GB used</span>
          </div>
          <Progress value={24} className="h-1.5 w-40" />
          <div className="flex items-center gap-1.5 ml-auto">
            <IconFile size={14} />
            <span>{files.length + DEMO_EXISTING_FILES.length} files</span>
          </div>
        </div>

        {/* Dropzone */}
        <FileUploadDropzone>
          {({ getInputProps, getRootProps, isDragActive }) => (
            <div {...getRootProps()} className="p-2 md:p-5">
              <input {...getInputProps()} />
              <div
                className={cn(
                  "border-2 border-dashed border-border rounded-xl p-8 flex flex-col items-center justify-center gap-3 transition-colors cursor-pointer",
                  isDragActive && "border-primary/50 bg-primary/5",
                )}
              >
                <div className="p-3 rounded-full bg-primary/10">
                  <IconCloudUpload size={28} className="text-primary" />
                </div>
                <div className="text-center">
                  <p className="text-sm font-medium">
                    Drop files here or click to browse
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Supports images, videos, documents, and more. Max 50MB per
                    file.
                  </p>
                </div>
              </div>
            </div>
          )}
        </FileUploadDropzone>

        {/* Upload Queue */}
        {files.length > 0 && (
          <div className="px-2 md:px-5 pb-3">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <IconArrowUp size={14} className="text-primary" />
                <h3 className="text-sm font-medium">Upload Queue</h3>
                <div className="flex gap-1">
                  {pendingCount > 0 && (
                    <Badge variant="secondary">{pendingCount} pending</Badge>
                  )}
                  {uploadingCount > 0 && (
                    <Badge
                      variant="default"
                      className="bg-blue-500/10 text-blue-500 hover:bg-blue-500/20"
                    >
                      {uploadingCount} uploading
                    </Badge>
                  )}
                  {doneCount > 0 && (
                    <Badge
                      variant="default"
                      className="bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20"
                    >
                      {doneCount} done
                    </Badge>
                  )}
                  {errorCount > 0 && (
                    <Badge variant="destructive">{errorCount} failed</Badge>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pendingCount > 0 && (
                  <Button
                    onClick={uploadAll}
                    disabled={isUploading}
                    size="sm"
                    variant="inverted"
                  >
                    <IconPlayerPlay size={12} className="mr-1" />
                    Upload All
                  </Button>
                )}
                {uploadingCount > 0 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      files.forEach(
                        (f) => f.status === "uploading" && cancelFile(f.id),
                      )
                    }
                  >
                    <IconSquare size={12} className="mr-1" />
                    Cancel All
                  </Button>
                )}
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Size</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="w-[100px]"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredFiles.map((fileEntry) => (
                  <UploadFileRow
                    key={fileEntry.id}
                    fileEntry={fileEntry}
                    onRemove={() => removeFile(fileEntry.id)}
                    onRetry={() => retryFile(fileEntry.id)}
                  />
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Existing Files */}
        <div className="@container/media-list px-2 md:px-5 pb-5">
          <div className="flex items-center gap-2 mb-3">
            <IconClock size={14} className="text-muted-foreground" />
            <h3 className="text-sm font-medium">Recent Files</h3>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>Size</TableHead>
                <TableHead>Date</TableHead>
                <TableHead className="w-[120px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {DEMO_EXISTING_FILES.map((file, idx) => (
                <ExistingFileRow key={idx} file={file} />
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Footer */}
        <div className="border-t bg-muted/5 px-2 md:px-5 py-3 flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm">
              <IconFolder size={14} className="mr-1" />
              New Folder
            </Button>
            <Button variant="ghost" size="sm">
              <IconCloudUpload size={14} className="mr-1" />
              Bulk Upload
            </Button>
          </div>
          <p className="text-xs text-muted-foreground">
            Files are securely stored in your workspace
          </p>
        </div>
      </div>
    </div>
  );
}

export function MediaLibary() {
  return (
    <FileUploadRoot
      onUpload={simulateUpload}
      config={{
        multiple: true,
        maxFiles: 20,
        maxSize: 50 * 1024 * 1024,
      }}
      onComplete={(files) => console.log("Upload complete:", files)}
      onError={(id, err) => console.error("Upload error:", id, err)}
    >
      <MediaLibraryContent />
    </FileUploadRoot>
  );
}

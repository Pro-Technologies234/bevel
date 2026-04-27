"use client";

import pageData from "@/content/docs/file-upload.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  FileUploadRoot,
  useFileUpload,
  type FileEntry,
} from "@/components/bevelui/file-upload";
import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
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
  IconCheck,
  IconX,
  IconUpload,
  IconFolder,
  IconGridDots,
  IconList,
  IconSearch,
  IconFilter,
  IconTrash,
  IconDownload,
  IconEye,
  IconDotsVertical,
  IconArrowUp,
  IconClock,
  IconDatabase,
  IconRefresh,
  IconPlayerPlay,
  IconSquare,
  IconAlertCircle,
  IconCircleCheck,
  IconCircleCheckFilled,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";

// ─── Simulated upload (same as original) ─────────────────────────────────────

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

// ─── Helper: Get file icon based on type ─────────────────────────────────────

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

// ─── Format file size ────────────────────────────────────────────────────────

function formatFileSize(bytes: number): string {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(1))} ${sizes[i]}`;
}

// ─── Status badge component ──────────────────────────────────────────────────

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
        <span className="text-[10px] text-yellow-200 flex items-center gap-0.5">
          <IconArrowUp size={10} strokeWidth={2} className="animate-pulse" />
          {progress}%
        </span>
      );
    case "done":
      return (
        <span className="text-[10px] text-green-500 flex items-center gap-0.5">
          <IconCircleCheck size={13} />
          Complete
        </span>
      );
    case "error":
      return (
        <span className="text-[10px] text-red-500 flex items-center gap-0.5">
          <IconAlertCircle size={10} strokeWidth={2} />
          Failed
        </span>
      );
    default:
      return (
        <span className="text-[10px] text-muted-foreground flex items-center gap-0.5">
          <IconClock size={10} strokeWidth={1.8} />
          Pending
        </span>
      );
  }
}

// ─── Original Demo (kept for docs) ───────────────────────────────────────────

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

// ─── Showcase Demo: Professional Media Library ───────────────────────────────

function MediaLibraryContent() {
  const {
    files,
    addFiles,
    removeFile,
    cancelFile,
    retryFile,
    uploadAll,
    isUploading,
  } = useFileUpload();

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock existing files (separate from upload queue)
  const existingFiles = [
    { name: "presentation.pptx", size: 3.2 * 1024 * 1024, date: "2 hours ago" },
    { name: "hero-image.png", size: 1.8 * 1024 * 1024, date: "Yesterday" },
    { name: "documentation.pdf", size: 542 * 1024, date: "3 days ago" },
    { name: "design-system.fig", size: 8.7 * 1024 * 1024, date: "Last week" },
  ];

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
      {/* Media Library Interface */}
      <div className="rounded-xl border border-border bg-popover/50 shadow-xl overflow-hidden">
        {/* Header */}
        <div className="border-b border-border bg-muted/5 px-2 md:px-5 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight">
                Media Library
              </h2>
              <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
                Manage your assets, upload new files, and organize your content
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 p-1 bg-muted/40 rounded-lg">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "grid"
                      ? "bg-background shadow-sm"
                      : "hover:bg-muted/60",
                  )}
                >
                  <IconGridDots size={16} strokeWidth={1.8} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-colors",
                    viewMode === "list"
                      ? "bg-background shadow-sm"
                      : "hover:bg-muted/60",
                  )}
                >
                  <IconList size={16} strokeWidth={1.8} />
                </button>
              </div>
              <button className="p-2 hover:bg-muted/60 rounded-lg transition-colors">
                <IconFilter size={16} strokeWidth={1.8} />
              </button>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mt-4 relative">
            <IconSearch
              size={16}
              strokeWidth={1.8}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
            />
            <input
              type="text"
              placeholder="Search files by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-sm bg-muted/20 border border-border rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50"
            />
          </div>
        </div>

        {/* Stats Bar */}
        <div className="px-2 md:px-5 py-2 bg-muted/5 border-b border-border/40 flex items-center gap-6 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <IconDatabase size={14} strokeWidth={1.8} />
            <span>Storage: 2.4 GB of 10 GB used</span>
          </div>
          <div className="flex-1">
            <div className="w-full max-w-xs h-1.5 bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary/60 rounded-full"
                style={{ width: "24%" }}
              />
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <IconFile size={14} strokeWidth={1.8} />
            <span>{files.length + existingFiles.length} files</span>
          </div>
        </div>

        {/* Custom Dropzone */}
        <div className="p-2 md:p-5">
          <div
            className={cn(
              "relative border-2 border-dashed border-border rounded-xl p-8 transition-all cursor-pointer",
              "hover:border-primary/50 hover:bg-primary/5",
              "flex flex-col items-center justify-center gap-3",
            )}
            onClick={() => {
              const input = document.createElement("input");
              input.type = "file";
              input.multiple = true;
              input.onchange = (e) => {
                const fileList = (e.target as HTMLInputElement).files;
                if (fileList) {
                  addFiles(Array.from(fileList));
                }
              };
              input.click();
            }}
            onDragOver={(e) => {
              e.preventDefault();
              e.currentTarget.classList.add("border-primary", "bg-primary/10");
            }}
            onDragLeave={(e) => {
              e.currentTarget.classList.remove(
                "border-primary",
                "bg-primary/10",
              );
            }}
            onDrop={(e) => {
              e.preventDefault();
              e.currentTarget.classList.remove(
                "border-primary",
                "bg-primary/10",
              );
              const fileList = e.dataTransfer.files;
              if (fileList) {
                addFiles(Array.from(fileList));
              }
            }}
          >
            <div className="p-3 rounded-full bg-primary/10">
              <IconCloudUpload
                size={28}
                strokeWidth={1.8}
                className="text-primary"
              />
            </div>
            <div className="text-center">
              <p className="text-sm font-medium">
                Drop files here or click to browse
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                Supports images, videos, documents, and more. Max 50MB per file.
              </p>
            </div>
          </div>
        </div>

        {/* Upload Queue Section (if files exist) */}
        {files.length > 0 && (
          <div className="px-2 md:px-5 pb-2">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <IconArrowUp
                  size={14}
                  strokeWidth={1.8}
                  className="text-primary"
                />
                <h3 className="text-sm font-medium">Upload Queue</h3>
                <div className="flex items-center gap-1">
                  {pendingCount > 0 && (
                    <span className="text-[10px] bg-muted px-1.5 py-0.5 rounded-full">
                      {pendingCount} pending
                    </span>
                  )}
                  {uploadingCount > 0 && (
                    <span className="text-[10px] bg-blue-500/10 text-blue-500 px-1.5 py-0.5 rounded-full">
                      {uploadingCount} uploading
                    </span>
                  )}
                  {doneCount > 0 && (
                    <span className="text-[10px] bg-emerald-500/10 text-emerald-500 px-1.5 py-0.5 rounded-full">
                      {doneCount} done
                    </span>
                  )}
                  {errorCount > 0 && (
                    <span className="text-[10px] bg-red-500/10 text-red-500 px-1.5 py-0.5 rounded-full">
                      {errorCount} failed
                    </span>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-2">
                {pendingCount > 0 && (
                  <Button
                    onClick={uploadAll}
                    disabled={isUploading}
                    variant={"inverted"}
                    className=" rounded-md"
                  >
                    <IconPlayerPlay size={12} strokeWidth={2} />
                    Upload All
                  </Button>
                )}
                {uploadingCount > 0 && (
                  <button
                    onClick={() =>
                      files.forEach(
                        (f) => f.status === "uploading" && cancelFile(f.id),
                      )
                    }
                    className="flex items-center gap-1 px-3 py-1 text-xs font-medium border border-border rounded-lg hover:bg-muted/60 transition-colors"
                  >
                    <IconSquare size={12} strokeWidth={2} />
                    Cancel All
                  </button>
                )}
              </div>
            </div>

            {viewMode === "grid" ? (
              <div className="grid grid-cols-4 gap-3 mb-4">
                {filteredFiles.slice(0, 8).map((fileEntry) => (
                  <div
                    key={fileEntry.id}
                    className="group relative rounded-lg border border-border bg-background/50 p-3 hover:border-primary/30 hover:bg-muted/10 transition-all"
                  >
                    <div className="flex items-start gap-2">
                      <div className="shrink-0 mt-0.5">
                        {getFileIcon(fileEntry.file.name)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-medium truncate">
                          {fileEntry.file.name}
                        </p>
                        <p className="text-[10px] text-muted-foreground mt-0.5">
                          {formatFileSize(fileEntry.file.size)}
                        </p>
                      </div>
                    </div>

                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                      {fileEntry.status === "error" && (
                        <button
                          onClick={() => retryFile(fileEntry.id)}
                          className="p-1 hover:bg-muted/60 rounded"
                        >
                          <IconRefresh size={12} strokeWidth={1.8} />
                        </button>
                      )}
                      {fileEntry.status !== "uploading" && (
                        <button
                          onClick={() => removeFile(fileEntry.id)}
                          className="p-1 hover:bg-muted/60 rounded"
                        >
                          <IconTrash size={12} strokeWidth={1.8} />
                        </button>
                      )}
                    </div>

                    <div className="mt-2">
                      {fileEntry.status === "uploading" && (
                        <>
                          <div className="w-full h-1 bg-muted rounded-full overflow-hidden">
                            <div
                              className="h-full bg-yellow-200 rounded-full transition-all duration-300"
                              style={{ width: `${fileEntry.progress}%` }}
                            />
                          </div>
                          <div className="flex items-center justify-between mt-1">
                            <StatusBadge
                              status={fileEntry.status}
                              progress={fileEntry.progress}
                            />
                            <button
                              onClick={() => cancelFile(fileEntry.id)}
                              className="text-[10px] text-muted-foreground hover:text-foreground"
                            >
                              Cancel
                            </button>
                          </div>
                        </>
                      )}
                      {fileEntry.status !== "uploading" && (
                        <div className="flex items-center justify-between mt-1">
                          <StatusBadge status={fileEntry.status} />
                          {fileEntry.status === "error" && (
                            <span className="text-[10px] text-red-500 truncate max-w-[120px]">
                              {fileEntry.error}
                            </span>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-1 mb-4">
                {filteredFiles.map((fileEntry) => (
                  <div
                    key={fileEntry.id}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors group"
                  >
                    {getFileIcon(fileEntry.file.name)}
                    <span className="text-sm flex-1 truncate">
                      {fileEntry.file.name}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {formatFileSize(fileEntry.file.size)}
                    </span>
                    <StatusBadge
                      status={fileEntry.status}
                      progress={fileEntry.progress}
                    />
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      {fileEntry.status === "error" && (
                        <button
                          onClick={() => retryFile(fileEntry.id)}
                          className="p-1 hover:bg-muted/60 rounded"
                        >
                          <IconRefresh size={14} strokeWidth={1.8} />
                        </button>
                      )}
                      {fileEntry.status !== "uploading" && (
                        <button
                          onClick={() => removeFile(fileEntry.id)}
                          className="p-1 hover:bg-muted/60 rounded"
                        >
                          <IconTrash size={14} strokeWidth={1.8} />
                        </button>
                      )}
                    </div>
                    {fileEntry.status === "uploading" && (
                      <div className="w-20 h-1 bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-yellow-200 rounded-full"
                          style={{ width: `${fileEntry.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Existing Files Section */}
        <div className="px-2 md:px-5 pb-5">
          <div className="flex items-center gap-2 mb-2">
            <IconClock
              size={14}
              strokeWidth={1.8}
              className="text-muted-foreground"
            />
            <h3 className="text-sm font-medium">Recent Files</h3>
          </div>

          {viewMode === "grid" ? (
            <div className="grid grid-cols-4 gap-3">
              {existingFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="group relative rounded-lg border border-border bg-muted/5 p-3 hover:border-primary/30 hover:bg-muted/10 transition-all cursor-pointer"
                >
                  <div className="flex items-start gap-2">
                    <div className="shrink-0 mt-0.5">
                      {getFileIcon(file.name)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium truncate">
                        {file.name}
                      </p>
                      <p className="text-[10px] text-muted-foreground mt-0.5">
                        {formatFileSize(file.size)}
                      </p>
                    </div>
                  </div>
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-muted/60 rounded">
                      <IconDotsVertical size={12} strokeWidth={1.8} />
                    </button>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-2">
                    {file.date}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-1">
              {existingFiles.map((file, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-muted/40 transition-colors cursor-pointer group"
                >
                  {getFileIcon(file.name)}
                  <span className="text-sm flex-1 truncate">{file.name}</span>
                  <span className="text-xs text-muted-foreground">
                    {formatFileSize(file.size)}
                  </span>
                  <span className="text-xs text-muted-foreground">
                    {file.date}
                  </span>
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button className="p-1 hover:bg-muted/60 rounded">
                      <IconEye size={14} strokeWidth={1.8} />
                    </button>
                    <button className="p-1 hover:bg-muted/60 rounded">
                      <IconDownload size={14} strokeWidth={1.8} />
                    </button>
                    <button className="p-1 hover:bg-muted/60 rounded">
                      <IconTrash size={14} strokeWidth={1.8} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="border-t border-border bg-muted/5 px-2 md:px-5 py-3 flex items-center justify-between flex-wrap">
          <div className="flex items-center gap-3">
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted/60 transition-colors">
              <IconFolder size={14} strokeWidth={1.8} />
              New Folder
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg hover:bg-muted/60 transition-colors">
              <IconCloudUpload size={14} strokeWidth={1.8} />
              Bulk Upload
            </button>
          </div>
          <p className="text-xs text-muted-foreground">
            Files are securely stored in your workspace
          </p>
        </div>
      </div>
    </div>
  );
}

export function FileUploadShowcase() {
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

export function FileUploadContent() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{
        FileUploadShowcase,
        FileUploadDemo,
      }}
    />
  );
}

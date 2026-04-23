// app/blocks/media-upload/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import {
  FileUploadProvider,
  useFileUpload,
} from "@/components/bevelui/file-upload";
import type {
  FileUploadConfig,
  FileEntry,
} from "@/components/bevelui/file-upload";
import { cn } from "@/lib/utils";

// shadcn/ui components (adjust import paths to your project)
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";

// Tabler Icons (install @tabler/icons-react if not present)
import {
  IconBrandGoogleDrive,
  IconUpload,
  IconFiles,
  IconClock,
  IconStar,
  IconTrash,
  IconShare,
  IconLayoutGrid,
  IconLayoutList,
  IconEye,
  IconDownload,
  IconFile,
  IconPhoto,
  IconVideo,
  IconSettings,
  IconCircleCheck,
  IconCircleX,
  IconFileTypePdf,
  IconCloudBolt,
  IconPlus,
} from "@tabler/icons-react";

// ============================================================================
// Helper: format bytes
// ============================================================================
function formatBytes(bytes: number): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
}

// ============================================================================
// File preview modal
// ============================================================================
function FilePreviewModal({
  fileEntry,
  open,
  onOpenChange,
}: {
  fileEntry: FileEntry | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!fileEntry) return null;

  const file = fileEntry.file;
  const url = fileEntry.url || URL.createObjectURL(file);
  const isImage = file.type.startsWith("image/");
  const isVideo = file.type.startsWith("video/");
  const isPdf = file.type === "application/pdf";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={url}
              alt={file.name}
              className="max-h-[70vh] object-contain"
            />
          )}
          {isVideo && (
            <video src={url} controls className="max-h-[70vh] w-full" />
          )}
          {isPdf && (
            <iframe src={url} className="h-[70vh] w-full" title={file.name} />
          )}
          {!isImage && !isVideo && !isPdf && (
            <div className="flex flex-col items-center gap-4 text-center">
              <IconFile className="h-20 w-20 text-zinc-400" />
              <p className="text-sm text-zinc-500">No preview available</p>
              <Button asChild variant="outline">
                <a
                  href={url}
                  download={file.name}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <IconDownload className="mr-2 h-4 w-4" />
                  Download
                </a>
              </Button>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// Upload dialog (modal mode)
// ============================================================================
function UploadDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { addFiles, files, isUploading } = useFileUpload();

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files));
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    const droppedFiles = Array.from(e.dataTransfer.files);
    if (droppedFiles.length) {
      addFiles(droppedFiles);
    }
  };

  const pendingFiles = files.filter((f) => f.status !== "done");

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Upload files</DialogTitle>
        </DialogHeader>
        <div
          className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed border-zinc-300 p-8 text-center dark:border-zinc-700"
          onDragOver={(e) => e.preventDefault()}
          onDrop={handleDrop}
        >
          <IconUpload className="mb-4 h-12 w-12 text-zinc-400" />
          <p className="text-sm text-zinc-600 dark:text-zinc-400">
            Drag & drop files here or click to browse
          </p>
          <Input
            type="file"
            multiple
            className="mt-4 w-full cursor-pointer"
            onChange={handleFileSelect}
          />
        </div>
        {pendingFiles.length > 0 && (
          <ScrollArea className="max-h-64">
            <div className="mt-4 space-y-2">
              {pendingFiles.map((f) => (
                <div
                  key={f.id}
                  className="flex items-center gap-3 rounded-md border p-2"
                >
                  {f.status === "uploading" && (
                    <>
                      <div className="flex-1">
                        <p className="text-sm font-medium truncate">
                          {f.file.name}
                        </p>
                        <Progress value={f.progress} className="h-1.5" />
                      </div>
                      <span className="text-xs text-zinc-500">
                        {f.progress}%
                      </span>
                    </>
                  )}
                  {f.status === "idle" && (
                    <>
                      <IconFile className="h-5 w-5 text-zinc-400" />
                      <span className="flex-1 text-sm">{f.file.name}</span>
                      <span className="text-xs text-zinc-500">
                        {formatBytes(f.file.size)}
                      </span>
                    </>
                  )}
                  {f.status === "error" && (
                    <>
                      <IconCircleX className="h-5 w-5 text-red-500" />
                      <span className="flex-1 text-sm text-red-600">
                        Failed: {f.error}
                      </span>
                    </>
                  )}
                </div>
              ))}
            </div>
          </ScrollArea>
        )}
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

// ============================================================================
// File grid/list view
// ============================================================================
function FileBrowser() {
  const { files, removeFile, isUploading } = useFileUpload();
  const [view, setView] = useState<any>("grid");
  const [previewFile, setPreviewFile] = useState<FileEntry | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const uploadedFiles = files.filter((f) => f.status === "done");

  const handlePreview = (file: FileEntry) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  if (uploadedFiles.length === 0 && !isUploading) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <IconFiles className="h-16 w-16 text-zinc-300 dark:text-zinc-700" />
        <h3 className="mt-4 text-lg font-semibold text-zinc-900 dark:text-white">
          No files yet
        </h3>
        <p className="mt-1 text-sm text-zinc-500">
          Click the “New” button or drag & drop to upload
        </p>
      </div>
    );
  }

  if (view === "grid") {
    return (
      <>
        <div className="mb-4 flex justify-end">
          <div className="flex gap-1 rounded-md border p-1">
            <Button
              variant={view === "grid" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("grid")}
            >
              <IconLayoutGrid className="h-4 w-4" />
            </Button>
            <Button
              variant={view === "list" ? "secondary" : "ghost"}
              size="sm"
              onClick={() => setView("list")}
            >
              <IconLayoutList className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {uploadedFiles.map((fileEntry) => {
            const isImage = fileEntry.file.type.startsWith("image/");
            const previewUrl =
              fileEntry.url || URL.createObjectURL(fileEntry.file);
            return (
              <div
                key={fileEntry.id}
                className="group relative rounded-lg border bg-white p-2 transition-shadow hover:shadow-md dark:bg-zinc-900"
              >
                <button
                  className="absolute right-2 top-2 z-10 rounded-full bg-black/50 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                  onClick={() => removeFile(fileEntry.id)}
                >
                  <IconTrash className="h-4 w-4" />
                </button>
                <button
                  className="w-full text-left"
                  onClick={() => handlePreview(fileEntry)}
                >
                  <div className="aspect-square overflow-hidden rounded-md bg-zinc-100 dark:bg-zinc-800">
                    {isImage ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={previewUrl}
                        alt={fileEntry.file.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full items-center justify-center">
                        {fileEntry.file.type === "application/pdf" ? (
                          <IconFileTypePdf className="h-12 w-12 text-red-500" />
                        ) : fileEntry.file.type.startsWith("video/") ? (
                          <IconVideo className="h-12 w-12 text-blue-500" />
                        ) : (
                          <IconFile className="h-12 w-12 text-zinc-400" />
                        )}
                      </div>
                    )}
                  </div>
                  <p className="mt-2 truncate text-sm font-medium">
                    {fileEntry.file.name}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {formatBytes(fileEntry.file.size)}
                  </p>
                </button>
              </div>
            );
          })}
        </div>
        <FilePreviewModal
          fileEntry={previewFile}
          open={previewOpen}
          onOpenChange={setPreviewOpen}
        />
      </>
    );
  }

  // List view
  return (
    <>
      <div className="mb-4 flex justify-end">
        <div className="flex gap-1 rounded-md border p-1">
          <Button
            variant={view === "grid" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("grid")}
          >
            <IconLayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={view === "list" ? "secondary" : "ghost"}
            size="sm"
            onClick={() => setView("list")}
          >
            <IconLayoutList className="h-4 w-4" />
          </Button>
        </div>
      </div>
      <div className="overflow-hidden rounded-md border">
        <table className="min-w-full divide-y divide-zinc-200 dark:divide-zinc-800">
          <thead className="bg-zinc-50 dark:bg-zinc-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                Size
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 bg-white dark:divide-zinc-800 dark:bg-zinc-950">
            {uploadedFiles.map((fileEntry) => (
              <tr
                key={fileEntry.id}
                className="hover:bg-zinc-50 dark:hover:bg-zinc-900"
              >
                <td className="whitespace-nowrap px-6 py-4">
                  <button
                    className="flex items-center gap-2 text-sm font-medium hover:text-emerald-600"
                    onClick={() => handlePreview(fileEntry)}
                  >
                    {fileEntry.file.type.startsWith("image/") ? (
                      <IconPhoto className="h-5 w-5 text-emerald-500" />
                    ) : fileEntry.file.type === "application/pdf" ? (
                      <IconFileTypePdf className="h-5 w-5 text-red-500" />
                    ) : (
                      <IconFile className="h-5 w-5 text-zinc-400" />
                    )}
                    {fileEntry.file.name}
                  </button>
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-sm text-zinc-500">
                  {formatBytes(fileEntry.file.size)}
                </td>
                <td className="whitespace-nowrap px-6 py-4 text-right">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handlePreview(fileEntry)}
                  >
                    <IconEye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFile(fileEntry.id)}
                  >
                    <IconTrash className="h-4 w-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <FilePreviewModal
        fileEntry={previewFile}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </>
  );
}

// ============================================================================
// Storage indicator (sidebar bottom)
// ============================================================================
function StorageWidget() {
  const { files } = useFileUpload();
  const totalUsed = files
    .filter((f) => f.status === "done")
    .reduce((acc, f) => acc + f.file.size, 0);
  const totalQuota = 15 * 1024 * 1024 * 1024; // 15 GB
  const percentUsed = (totalUsed / totalQuota) * 100;

  return (
    <div className="mt-auto pt-6">
      <div className="flex items-center justify-between text-sm">
        <span className="text-zinc-600 dark:text-zinc-400">Storage</span>
        <span className="text-zinc-600 dark:text-zinc-400">
          {formatBytes(totalUsed)} of {formatBytes(totalQuota)}
        </span>
      </div>
      <Progress value={percentUsed} className="mt-2 h-2" />
      <Button variant="link" size="sm" className="mt-2 h-auto p-0 text-xs">
        Get more storage
      </Button>
    </div>
  );
}

// ============================================================================
// Sidebar navigation
// ============================================================================
function Sidebar() {
  return (
    <aside className="w-64 flex-shrink-0 border-r border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-900">
      <nav className="space-y-1">
        <Button variant="ghost" className="w-full justify-start gap-2">
          <IconFiles className="h-5 w-5" />
          My Drive
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <IconShare className="h-5 w-5" />
          Shared with me
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <IconClock className="h-5 w-5" />
          Recent
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <IconStar className="h-5 w-5" />
          Starred
        </Button>
        <Button variant="ghost" className="w-full justify-start gap-2">
          <IconTrash className="h-5 w-5" />
          Trash
        </Button>
      </nav>
      <div className="mt-8">
        <Button variant="outline" className="w-full justify-start gap-2">
          <IconSettings className="h-5 w-5" />
          Settings
        </Button>
      </div>
      <StorageWidget />
    </aside>
  );
}

// ============================================================================
// Main block component
// ============================================================================
export default function MediaUploadBlock() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);

  // Upload config: auto = true so files start uploading immediately after selection
  const uploadConfig: FileUploadConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      "video/*": [".mp4", ".mov", ".webm"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024, // 10 MB
    maxFiles: 100,
    multiple: true,
    auto: true, // auto-upload after adding files
    title: "Upload to Drive",
    description: "Images, videos, or PDFs up to 10MB",
  };

  // Realistic upload simulation (replace with real API call later)
  const handleUpload = async (
    file: File,
    onProgress: (pct: number) => void,
  ) => {
    // Simulate progress every 150ms
    for (let pct = 0; pct <= 100; pct += 10) {
      await new Promise((r) => setTimeout(r, 150));
      onProgress(pct);
    }
    // Simulate random error for files named "fail*" (demo)
    if (file.name.toLowerCase().startsWith("fail")) {
      throw new Error("Upload failed – please retry");
    }
    // Return a fake object URL (in real app you would get a server URL)
    return {
      url: URL.createObjectURL(file),
      meta: { uploadedAt: new Date().toISOString() },
    };
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950">
      {/* Header toolbar */}
      <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
        <div className="flex items-center gap-2">
          <IconBrandGoogleDrive className="h-6 w-6 text-emerald-600" />
          <span className="font-semibold">Bevel Drive</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setUploadDialogOpen(true)}>
            <IconUpload className="mr-2 h-4 w-4" />
            New
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        <Sidebar />

        <main className="flex-1 overflow-auto p-6">
          <FileUploadProvider config={uploadConfig} onUpload={handleUpload}>
            <FileBrowser />
          </FileUploadProvider>
        </main>
      </div>

      {/* Upload modal – outside provider but uses context from the provider inside main */}
      {/* We need to nest the modal inside the provider to access useFileUpload */}
      {/* Actually the provider is only inside main, so modal must be inside provider */}
      {/* Let's restructure: move provider to wrap the entire component, then modal inside */}
    </div>
  );
}

// Re-export with provider wrapping the whole layout
export function WrappedMediaUploadBlock() {
  const [uploadDialogOpen, setUploadDialogOpen] = useState(false);
  const uploadConfig: FileUploadConfig = {
    accept: {
      "image/*": [".jpg", ".jpeg", ".png", ".webp", ".gif"],
      "video/*": [".mp4", ".mov", ".webm"],
      "application/pdf": [".pdf"],
    },
    maxSize: 10 * 1024 * 1024,
    maxFiles: 100,
    multiple: true,
    auto: true,
    title: "Upload to Drive",
    description: "Images, videos, or PDFs up to 10MB",
  };

  const handleUpload = async (
    file: File,
    onProgress: (pct: number) => void,
  ) => {
    for (let pct = 0; pct <= 100; pct += 10) {
      await new Promise((r) => setTimeout(r, 150));
      onProgress(pct);
    }
    if (file.name.toLowerCase().startsWith("fail")) {
      throw new Error("Upload failed – please retry");
    }
    return {
      url: URL.createObjectURL(file),
      meta: { uploadedAt: new Date().toISOString() },
    };
  };

  return (
    <FileUploadProvider config={uploadConfig} onUpload={handleUpload}>
      <div className="flex h-screen flex-col overflow-hidden bg-zinc-50 dark:bg-zinc-950">
        <header className="flex h-14 items-center justify-between border-b border-zinc-200 bg-white px-4 dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-2">
            <IconCloudBolt className="h-6 w-6 text-primary" />
            <span className="font-semibold">Bevel Drive</span>
          </div>
          <div className="flex gap-2">
            <Button onClick={() => setUploadDialogOpen(true)}>
              <IconPlus className="h-4 w-4" />
              New
            </Button>
          </div>
        </header>
        <div className="flex flex-1 overflow-hidden">
          <Sidebar />
          <main className="flex-1 overflow-auto p-6">
            <FileBrowser />
          </main>
        </div>
        <UploadDialog
          open={uploadDialogOpen}
          onOpenChange={setUploadDialogOpen}
        />
      </div>
    </FileUploadProvider>
  );
}

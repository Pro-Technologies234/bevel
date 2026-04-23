"use client";

/**
 * BLOCK: Bevel Drive
 * A fully functional cloud storage app with file preview and mobile responsiveness.
 * Bevel Systems: File Upload + Command Palette + Product Tour
 * shadcn: Card, Badge, Button, Input, Progress, Dialog, Sheet, ScrollArea,
 *          Separator, Tooltip, DropdownMenu, Avatar
 * motion/react: staggered list, upload card entrance, sidebar animations
 */

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";

// ─── Bevel Systems ────────────────────────────────────────────────────────────
import {
  FileUploadRoot,
  FileUploadDropzone,
  useFileUpload,
} from "@/components/bevelui/file-upload";
import type {
  FileEntry,
  FileUploadConfig,
} from "@/components/bevelui/file-upload";
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
} from "@/components/bevelui/command-palette";
import type { CommandPaletteSection } from "@/components/bevelui/command-palette";
import { TourRoot, TourAnchor, TourTrigger } from "@/components/bevelui/tour";
import type { TourStepDef } from "@/components/bevelui/tour";

// ─── shadcn/ui ────────────────────────────────────────────────────────────────
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

// ─── Icons ────────────────────────────────────────────────────────────────────
import {
  IconCloud,
  IconSearch,
  IconPlus,
  IconFolder,
  IconPhoto,
  IconVideo,
  IconFileTypePdf,
  IconFile,
  IconStar,
  IconClock,
  IconTrash,
  IconShare,
  IconDownload,
  IconDots,
  IconLayoutGrid,
  IconLayoutList,
  IconUpload,
  IconUsers,
  IconSettings,
  IconPlayerPlay,
  IconChevronRight,
  IconCheck,
  IconAlertCircle,
  IconX,
  IconRefresh,
  IconDeviceDesktopSearch,
  IconFileUpload,
  IconFolderUp,
  IconFolderPlus,
  IconMenu2,
  IconEye,
} from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────
type DriveFileType = "folder" | "image" | "video" | "pdf" | "doc";
interface DriveFile extends FileEntry {
  id: string;
  name: string;
  file: File;
  meta: {
    shared?: boolean;
    starred?: boolean;
    owner?: string;
    modified: string;
    size?: string;
    type: DriveFileType;
    [x: string]: unknown;
  };
}

// ─── Constants ────────────────────────────────────────────────────────────────
const INITIAL_FILES: DriveFile[] = [
  {
    id: "f1",
    url: "",
    progress: 100,
    file: new File([], "Brand Assets"),
    status: "done",
    name: "Brand Assets",
    meta: { type: "folder", modified: "Today", shared: true },
  },
  {
    id: "f2",
    name: "Q2 Report.pdf",
    url: "",
    progress: 100,
    file: new File([], "Q2 Report.pdf"),
    status: "done",
    meta: { type: "pdf", size: "4.2 MB", modified: "Today", starred: true },
  },
  {
    id: "f3",
    name: "Product Demo.mp4",
    url: "",
    progress: 100,
    file: new File([], "Product Demo.mp4"),
    status: "done",
    meta: { type: "video", size: "128 MB", modified: "Yesterday" },
  },
  {
    id: "f4",
    name: "hero-dark.png",
    url: "",
    progress: 100,
    file: new File([], "hero-dark.png"),
    status: "done",
    meta: {
      type: "image",
      size: "2.1 MB",
      modified: "Yesterday",
      starred: true,
    },
  },
  {
    id: "f5",
    name: "Design Specs",
    url: "",
    progress: 100,
    file: new File([], "Design Specs"),
    status: "done",
    meta: { type: "folder", modified: "Mon", shared: true, owner: "Sarah K." },
  },
  {
    id: "f6",
    name: "user-research.pdf",
    url: "",
    progress: 100,
    file: new File([], "user-research.pdf"),
    status: "done",
    meta: { type: "pdf", size: "1.8 MB", modified: "Mon" },
  },
  {
    id: "f7",
    name: "logo-v3.png",
    url: "",
    progress: 100,
    file: new File([], "logo-v3.png"),
    status: "done",
    meta: { type: "image", size: "340 KB", modified: "Last week" },
  },
  {
    id: "f8",
    name: "pitch-deck.pdf",
    url: "",
    progress: 100,
    file: new File([], "pitch-deck.pdf"),
    status: "done",
    meta: { type: "pdf", size: "8.6 MB", modified: "Last week", starred: true },
  },
];

const NAV_ITEMS = [
  { icon: IconDeviceDesktopSearch, label: "My Drive", id: "drive" },
  { icon: IconUsers, label: "Shared", id: "shared", badge: "3" },
  { icon: IconClock, label: "Recent", id: "recent" },
  { icon: IconStar, label: "Starred", id: "starred" },
  { icon: IconTrash, label: "Trash", id: "trash" },
];

const TOUR_STEPS: TourStepDef[] = [
  {
    id: "sidebar",
    step: 1,
    title: "Everything in one place",
    description:
      "My Drive, Shared files, Starred items — all here. Click any section to filter your files.",
    side: "right",
  },
  {
    id: "search-bar",
    step: 2,
    title: "Search instantly with ⌘K",
    description:
      "Open the command palette to search files, jump to folders, or share anything — all from the keyboard.",
    side: "bottom",
  },
  {
    id: "upload-zone",
    step: 3,
    title: "Drop files anywhere",
    description:
      "Drag files straight into your Drive — or click New to open the full upload dialog.",
    side: "top",
  },
  {
    id: "storage-bar",
    step: 4,
    title: "Track your storage",
    description:
      "See how much space you've used at a glance. Upgrade whenever you need more.",
    side: "top",
  },
];

const PALETTE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "files",
    title: "Recent files",
    items: [
      {
        id: "pf1",
        title: "Q2 Report.pdf",
        subtitle: "4.2 MB · Modified today",
        icon: <IconFileTypePdf />,
        onSelect: () => {},
      },
      {
        id: "pf2",
        title: "hero-dark.png",
        subtitle: "2.1 MB · Modified yesterday",
        icon: <IconPhoto />,
        onSelect: () => {},
      },
      {
        id: "pf3",
        title: "Product Demo.mp4",
        subtitle: "128 MB · Modified yesterday",
        icon: <IconVideo />,
        onSelect: () => {},
      },
    ],
  },
  {
    id: "actions",
    title: "Actions",
    items: [
      {
        id: "a1",
        title: "Upload files",
        subtitle: "Add files to your Drive",
        icon: <IconUpload />,
        meta: "⌘U",
        onSelect: () => {},
      },
      {
        id: "a2",
        title: "New folder",
        subtitle: "Create an empty folder",
        icon: <IconFolder />,
        meta: "⌘⇧N",
        onSelect: () => {},
      },
      {
        id: "a3",
        title: "Share a file",
        subtitle: "Send a link to teammates",
        icon: <IconShare />,
        onSelect: () => {},
      },
    ],
  },
];

const UPLOAD_CONFIG: FileUploadConfig = {
  accept: {
    "image/*": [],
    "video/*": [],
    "application/pdf": [".pdf"],
    "application/msword": [],
  },
  maxSize: 200 * 1024 * 1024,
  maxFiles: 20,
  multiple: true,
  title: "Drop files into Drive",
  description: "Images, videos, PDFs, and documents up to 200MB",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────
async function simulateUpload(
  file: File,
  onProgress: (p: number) => void,
): Promise<{ url: string }> {
  return new Promise((resolve, reject) => {
    let p = 0;
    const iv = setInterval(() => {
      p += Math.random() * 15 + 5;
      if (p >= 100) {
        clearInterval(iv);
        onProgress(100);
        if (file.name.toLowerCase().startsWith("fail"))
          reject(new Error("Server rejected the file"));
        else resolve({ url: URL.createObjectURL(file) });
      } else {
        onProgress(Math.min(p, 99));
      }
    }, 120);
  });
}

function fileIcon(type: DriveFileType) {
  const icons = {
    folder: IconFolder,
    image: IconPhoto,
    video: IconVideo,
    pdf: IconFileTypePdf,
    doc: IconFile,
  };
  return icons[type] ?? IconFile;
}

function fileColor(type: DriveFileType) {
  return (
    {
      folder: "text-yellow-500",
      image: "text-blue-400",
      video: "text-purple-400",
      pdf: "text-red-400",
      doc: "text-muted-foreground",
    }[type] ?? "text-muted-foreground"
  );
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return bytes + " B";
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

// ─── File Preview Dialog ─────────────────────────────────────────────────────
function FilePreviewDialog({
  file,
  open,
  onOpenChange,
}: {
  file: DriveFile | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!file) return null;

  const isImage = file.file.type.startsWith("image/");
  const isVideo = file.file.type.startsWith("video/");
  const isPdf = file.file.type === "application/pdf";
  const previewUrl = file.url || URL.createObjectURL(file.file);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={file.name}
              className="max-h-[70vh] object-contain"
            />
          )}
          {isVideo && (
            <video src={previewUrl} controls className="max-h-[70vh] w-full" />
          )}
          {isPdf && (
            <iframe
              src={previewUrl}
              className="h-[70vh] w-full"
              title={file.name}
            />
          )}
          {!isImage && !isVideo && !isPdf && (
            <div className="flex flex-col items-center gap-4 text-center">
              <IconFile className="h-20 w-20 text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                No preview available
              </p>
              <Button asChild variant="outline">
                <a
                  href={previewUrl}
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

// ─── Upload Queue Overlay ─────────────────────────────────────────────────────
function UploadQueue() {
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
      <Card className="p-0 overflow-hidden shadow-2xl border-border/60">
        <div className="flex items-center justify-between px-4 py-3 bg-card border-b border-border">
          <span className="text-sm font-medium">
            {isUploading
              ? `Uploading ${active.length} file${active.length > 1 ? "s" : ""}…`
              : `${active.length} file${active.length > 1 ? "s" : ""} queued`}
          </span>
          {!isUploading && (
            <Button size="sm" className="h-7 text-xs" onClick={uploadAll}>
              Upload all
            </Button>
          )}
        </div>
        <ScrollArea className="max-h-52">
          <div className="divide-y divide-border/60">
            {active.map((f) => (
              <div key={f.id} className="flex items-center gap-3 px-4 py-2.5">
                <div className="size-8 rounded-lg bg-muted flex items-center justify-center shrink-0">
                  <IconFile size={14} className="text-muted-foreground" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium truncate">{f.file.name}</p>
                  {f.status === "uploading" && (
                    <Progress value={f.progress} className="h-1 mt-1.5" />
                  )}
                  {f.status === "error" && (
                    <p className="text-[10px] text-destructive mt-0.5 truncate">
                      {f.error}
                    </p>
                  )}
                  {f.status === "idle" && (
                    <p className="text-[10px] text-muted-foreground mt-0.5">
                      {formatBytes(f.file.size)}
                    </p>
                  )}
                </div>
                {f.status === "uploading" && (
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {Math.round(f.progress)}%
                  </span>
                )}
                {f.status === "error" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    onClick={() => retryFile(f.id)}
                  >
                    <IconRefresh size={12} />
                  </Button>
                )}
                {f.status === "idle" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="size-6 shrink-0"
                    onClick={() => removeFile(f.id)}
                  >
                    <IconX size={12} />
                  </Button>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      </Card>
    </motion.div>
  );
}

// ─── File Row (list view) ─────────────────────────────────────────────────────
function FileRow({
  driveFile,
  index,
  onStar,
  onPreview,
}: {
  driveFile: DriveFile;
  index: number;
  onStar: (id: string) => void;
  onPreview: (file: DriveFile) => void;
}) {
  const Icon = fileIcon(driveFile.meta?.type);
  return (
    <motion.div
      initial={{ opacity: 0, x: -8 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: index * 0.04 }}
      className="group flex items-center gap-4 px-4 py-2.5 hover:bg-muted/40 rounded-lg cursor-pointer transition-colors"
      onClick={() => onPreview(driveFile)}
    >
      <div
        className={`size-8 rounded-lg bg-muted flex items-center justify-center shrink-0 ${fileColor(driveFile.meta.type)}`}
      >
        <Icon size={16} />
      </div>
      <span className="flex-1 text-sm font-medium min-w-0 truncate">
        {driveFile.name}
      </span>
      {driveFile.meta.shared && (
        <Badge variant="secondary" className="text-[10px] hidden sm:flex">
          Shared
        </Badge>
      )}
      {driveFile.meta.owner && (
        <span className="text-xs text-muted-foreground hidden md:block">
          {driveFile.meta.owner}
        </span>
      )}
      <span className="text-xs text-muted-foreground w-20 text-right hidden sm:block">
        {driveFile.meta.size ?? "—"}
      </span>
      <span className="text-xs text-muted-foreground w-20 text-right">
        {driveFile.meta.modified}
      </span>
      <div
        className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
        onClick={(e) => e.stopPropagation()}
      >
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className="size-7"
                onClick={() => onStar(driveFile.id)}
              >
                <IconStar
                  size={13}
                  className={
                    driveFile.meta.starred
                      ? "fill-yellow-400 text-yellow-400"
                      : ""
                  }
                />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {driveFile.meta.starred ? "Unstar" : "Star"}
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="size-7">
              <IconDots size={13} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => onPreview(driveFile)}>
              <IconEye size={13} className="mr-2" />
              Preview
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconDownload size={13} className="mr-2" />
              Download
            </DropdownMenuItem>
            <DropdownMenuItem>
              <IconShare size={13} className="mr-2" />
              Share
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-destructive">
              <IconTrash size={13} className="mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </motion.div>
  );
}

// ─── File Grid Card ───────────────────────────────────────────────────────────
function FileCard({
  driveFile,
  index,
  onStar,
  onPreview,
}: {
  driveFile: DriveFile;
  index: number;
  onStar: (id: string) => void;
  onPreview: (file: DriveFile) => void;
}) {
  const Icon = fileIcon(driveFile.meta.type);
  const isImage = driveFile.file.type.startsWith("image/");
  const previewUrl =
    driveFile.url || (driveFile.file && URL.createObjectURL(driveFile.file));
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: index * 0.05 }}
      onClick={() => onPreview(driveFile)}
    >
      <Card className="group p-0 overflow-hidden hover:border-primary/30 transition-all cursor-pointer hover:shadow-lg hover:shadow-primary/5">
        <div
          className={`h-28 bg-muted/50 flex items-center justify-center relative ${fileColor(driveFile.meta.type)}`}
        >
          {isImage && previewUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={driveFile.name}
              className="h-full w-full object-cover"
            />
          ) : (
            <Icon size={36} strokeWidth={1.2} />
          )}
          <button
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={(e) => {
              e.stopPropagation();
              onStar(driveFile.id);
            }}
          >
            <IconStar
              size={14}
              className={
                driveFile.meta.starred
                  ? "fill-yellow-400 text-yellow-400"
                  : "text-muted-foreground"
              }
            />
          </button>
          {driveFile.meta.shared && (
            <Badge
              className="absolute bottom-2 left-2 text-[9px] py-0"
              variant="secondary"
            >
              Shared
            </Badge>
          )}
        </div>
        <div className="px-3 py-2.5">
          <p className="text-xs font-medium truncate">{driveFile.name}</p>
          <div className="flex items-center justify-between mt-1">
            <span className="text-[10px] text-muted-foreground">
              {driveFile.meta.modified}
            </span>
            {driveFile.meta.size && (
              <span className="text-[10px] text-muted-foreground">
                {driveFile.meta.size}
              </span>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}

// ─── Sidebar Content (used in both desktop and mobile) ────────────────────────
function SidebarContent({
  activeNav,
  setActiveNav,
}: {
  activeNav: string;
  setActiveNav: (id: string) => void;
}) {
  return (
    <>
      {/* Logo */}
      <div className="flex items-center gap-2.5 px-2 py-3 mb-3">
        <div className="size-7 rounded-lg bg-primary flex items-center justify-center">
          <IconCloud size={14} className="text-primary-foreground" />
        </div>
        <span className="font-semibold text-sm tracking-tight">
          Bevel Drive
        </span>
      </div>

      {/* New button */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            className="justify-start gap-2 text-sm cursor-pointer p-5 rounded-lg w-fit"
            size="sm"
          >
            <IconPlus size={14} />
            New
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-48">
          <FileUploadDropzone>
            {({ getRootProps, getInputProps }) => (
              <DropdownMenuItem
                {...getRootProps()}
                onSelect={(e) => e.preventDefault()}
                className="cursor-pointer"
              >
                <input {...getInputProps()} />
                <IconFileUpload className="mr-2 h-4 w-4" />
                <span>File upload</span>
              </DropdownMenuItem>
            )}
          </FileUploadDropzone>
          <DropdownMenuItem>
            <IconFolderUp className="mr-2 h-4 w-4" />
            Folder upload
          </DropdownMenuItem>

          <DropdownMenuItem>
            <IconFolderPlus className="mr-2 h-4 w-4" />
            New folder
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Nav */}
      <nav className="space-y-0.5 flex-1 my-4">
        {NAV_ITEMS.map(({ icon: Icon, label, id, badge }) => (
          <button
            key={id}
            onClick={() => setActiveNav(id)}
            className={`w-full flex items-center justify-between px-2.5 py-2 rounded-md text-sm transition-colors ${activeNav === id ? "bg-primary/10 text-primary font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <span className="flex items-center gap-2.5">
              <Icon size={15} />
              {label}
            </span>
            {badge && (
              <span className="text-[10px] bg-primary/15 text-primary px-1.5 py-0.5 rounded-full font-medium">
                {badge}
              </span>
            )}
          </button>
        ))}
      </nav>

      <Separator className="my-3" />

      {/* Storage bar */}
      <TourAnchor step={4}>
        <div className="px-2 space-y-2">
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Storage</span>
            <span>3.8 / 15 GB</span>
          </div>
          <Progress value={25} className="h-1.5" />
          <Button variant="outline" size="sm" className="w-full text-xs h-7">
            Upgrade plan
          </Button>
        </div>
      </TourAnchor>

      <Separator className="my-3" />

      <div className="flex items-center gap-2 px-2 py-1">
        <Avatar className="size-6">
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            JD
          </AvatarFallback>
        </Avatar>
        <span className="text-xs text-muted-foreground truncate">
          jamie@acme.com
        </span>
      </div>
    </>
  );
}

// ─── Main App ─────────────────────────────────────────────────────────────────
function DriveApp() {
  const [activeNav, setActiveNav] = useState("drive");
  const [view, setView] = useState<"list" | "grid">("list");
  const [files, setFiles] = useState<DriveFile[]>(INITIAL_FILES);
  const [uploadedFiles, setUploadedFiles] = useState<FileEntry[]>([]);
  const [search, setSearch] = useState("");
  const [previewFile, setPreviewFile] = useState<DriveFile | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleStar = (id: string) =>
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, starred: !f.meta?.starred } : f)),
    );

  const handlePreview = (file: DriveFile) => {
    setPreviewFile(file);
    setPreviewOpen(true);
  };

  const filtered = files.filter((f) => {
    if (search) return f.file.name.toLowerCase().includes(search.toLowerCase());
    if (activeNav === "starred") return f.meta?.starred;
    if (activeNav === "shared") return f.meta?.shared;
    return true;
  });

  // Merge uploaded files into drive list
  const handleUploadComplete = (entries: FileEntry[]) => {
    const newFiles: DriveFile[] = entries.map((e) => ({
      ...e,
      name: e.file.name,
      meta: {
        type: e.file.type.startsWith("image")
          ? "image"
          : e.file.type.startsWith("video")
            ? "video"
            : e.file.type === "application/pdf"
              ? "pdf"
              : "doc",
        size: formatBytes(e.file.size),
        modified: "Just now",
      },
    }));
    setFiles((prev) => [...newFiles, ...prev]);
    setUploadedFiles(entries);
  };

  return (
    <div className="flex h-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      <TourAnchor step={1} asChild>
        <aside className="hidden md:flex w-72 border-r border-border flex-col p-3 shrink-0 bg-card/40">
          <SidebarContent activeNav={activeNav} setActiveNav={setActiveNav} />
        </aside>
      </TourAnchor>

      {/* Mobile Sidebar (Sheet) */}
      <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
        <SheetContent side="left" className="w-72 p-3">
          <SidebarContent
            activeNav={activeNav}
            setActiveNav={(id) => {
              setActiveNav(id);
              setMobileMenuOpen(false);
            }}
          />
        </SheetContent>
      </Sheet>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Topbar */}
        <header className="h-13 border-b border-border flex items-center gap-3 px-5 py-2.5 shrink-0 bg-card/20">
          {/* Mobile menu trigger */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(true)}
          >
            <IconMenu2 className="h-5 w-5" />
          </Button>

          <TourAnchor step={3}>
            <CommandPaletteTrigger asChild>
              <div className="flex items-center gap-2 bg-muted hover:bg-muted/80 text-muted-foreground rounded-lg px-3 py-1.5 w-64 cursor-pointer transition-colors text-sm">
                <IconSearch size={14} />
                <span>Search Drive…</span>
                <kbd className="ml-auto text-[10px] bg-background border border-border px-1.5 py-0.5 rounded font-mono">
                  ⌘K
                </kbd>
              </div>
            </CommandPaletteTrigger>
          </TourAnchor>

          <div className="ml-auto flex items-center gap-2">
            <TourTrigger asChild>
              <Button
                variant="outline"
                size="sm"
                className="gap-1.5 text-xs cursor-pointer"
              >
                <IconPlayerPlay size={12} />
                Tour
              </Button>
            </TourTrigger>
            <div className="flex items-center border border-border rounded-md overflow-hidden">
              <Button
                variant={view === "list" ? "secondary" : "ghost"}
                size="icon"
                className="size-8 rounded-none"
                onClick={() => setView("list")}
              >
                <IconLayoutList size={14} />
              </Button>
              <Button
                variant={view === "grid" ? "secondary" : "ghost"}
                size="icon"
                className="size-8 rounded-none"
                onClick={() => setView("grid")}
              >
                <IconLayoutGrid size={14} />
              </Button>
            </div>
          </div>
        </header>

        {/* Breadcrumb */}
        <div className="flex items-center gap-1 px-5 py-2.5 text-sm border-b border-border/50">
          <span className="text-muted-foreground">Drive</span>
          <IconChevronRight size={14} className="text-muted-foreground" />
          <span className="font-medium capitalize">
            {activeNav === "drive"
              ? "My Files"
              : NAV_ITEMS.find((n) => n.id === activeNav)?.label}
          </span>
          <Badge variant="secondary" className="ml-2 text-[10px]">
            {filtered.length} items
          </Badge>
        </div>

        {/* Drop zone + file list */}
        <ScrollArea className="flex-1">
          <div className="p-5">
            {/* Upload queue */}
            <AnimatePresence>
              <UploadQueue />
            </AnimatePresence>

            {/* Files */}
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center">
                <IconFolder
                  size={48}
                  className="text-muted-foreground/30 mb-4"
                />
                <p className="text-muted-foreground text-sm">
                  No files here yet
                </p>
              </div>
            ) : view === "list" ? (
              <div className="space-y-0.5">
                <div className="flex items-center gap-4 px-4 py-1.5 text-[11px] text-muted-foreground font-medium uppercase tracking-wide">
                  <span className="flex-1">Name</span>
                  <span className="hidden sm:block w-20 text-right">Owner</span>
                  <span className="hidden sm:block w-20 text-right">Size</span>
                  <span className="w-20 text-right">Modified</span>
                  <span className="w-16" />
                </div>
                {filtered.map((f, i) => (
                  <FileRow
                    key={f.id}
                    driveFile={f}
                    index={i}
                    onStar={handleStar}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                {filtered.map((f, i) => (
                  <FileCard
                    key={f.id}
                    driveFile={f}
                    index={i}
                    onStar={handleStar}
                    onPreview={handlePreview}
                  />
                ))}
              </div>
            )}
          </div>
        </ScrollArea>
      </div>

      {/* File Preview Dialog */}
      <FilePreviewDialog
        file={previewFile}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}

// ─── Root ─────────────────────────────────────────────────────────────────────
export default function BevelDriveBlock() {
  return (
    <TourRoot steps={TOUR_STEPS}>
      <CommandPaletteRoot sections={PALETTE_SECTIONS}>
        <FileUploadRoot config={UPLOAD_CONFIG} onUpload={simulateUpload}>
          <DriveApp />
        </FileUploadRoot>
      </CommandPaletteRoot>
    </TourRoot>
  );
}

"use client";

import { useState, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  IconFolder,
  IconFile,
  IconPhoto,
  IconFileText,
  IconVideo,
  IconDotsVertical,
  IconLayoutGrid,
  IconList,
  IconTrash,
  IconDownload,
  IconUpload,
  IconSearch,
  IconChevronRight,
  IconPlus,
  IconBoltFilled,
  IconStar,
  IconClock,
  IconCloud,
  IconFileUpload,
  IconFolderUp,
  IconFolderPlus,
  IconX,
} from "@tabler/icons-react";
import {
  FileUploadConfig,
  FileUploadDropzone,
  FileUploadRoot,
} from "@/components/bevelui/file-upload";
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  useCommandPalette,
} from "@/components/bevelui/command-palette";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { VaultAppSidebar } from "@/components/labs/vault/vault-sidebar";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileItem } from "@/components/labs/vault/vault-types";
import {
  getFileColor,
  getFileIcon,
  getFileType,
  simulateUpload,
} from "@/components/labs/vault/vault-utils";
import { formatBytes } from "@/components/bevelui/file-upload/file-upload-utils";
import { VaultUploadQueue } from "@/components/labs/vault/vault-upload-queue";

import { FileRow } from "@/components/labs/vault/vault-file-row";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { VaultFileViewer } from "@/components/labs/vault/vault-file-viewer";
import { Checkbox } from "@/components/ui/checkbox";
import { VaultSelectionBar } from "./vault-selection-bar";
import { VaultHeader } from "./vault-header";
import { FileCard } from "./vault-file-card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { VaultFileList } from "./vault-file-list";
import { toast } from "sonner";

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_FILES: FileItem[] = [
  {
    id: "1",
    name: "Design Assets",
    type: "folder",
    modified: new Date("2025-04-10"),
    starred: true,
    parentId: null,
  },
  {
    id: "2",
    name: "Project Docs",
    type: "folder",
    modified: new Date("2025-04-08"),
    starred: false,
    parentId: null,
  },
  {
    id: "3",
    name: "hero-screenshot.png",
    type: "image",
    size: 2400000,
    modified: new Date("2025-04-12"),
    starred: false,
    parentId: null,
  },
  {
    id: "4",
    name: "brand-guidelines.pdf",
    type: "document",
    size: 1800000,
    modified: new Date("2025-04-05"),
    starred: true,
    parentId: null,
  },
  {
    id: "5",
    name: "demo-walkthrough.mp4",
    type: "video",
    size: 48000000,
    modified: new Date("2025-04-01"),
    starred: false,
    parentId: null,
  },
  {
    id: "6",
    name: "component-specs.docx",
    type: "document",
    size: 340000,
    modified: new Date("2025-03-28"),
    starred: false,
    parentId: null,
  },
  {
    id: "7",
    name: "logo-final.svg",
    type: "image",
    size: 24000,
    modified: new Date("2025-04-14"),
    starred: true,
    parentId: "1",
  },
  {
    id: "8",
    name: "icons-set.zip",
    type: "file",
    size: 5600000,
    modified: new Date("2025-04-13"),
    starred: false,
    parentId: "1",
  },
  {
    id: "9",
    name: "architecture.md",
    type: "document",
    size: 12000,
    modified: new Date("2025-04-11"),
    starred: false,
    parentId: "2",
  },
  {
    id: "10",
    name: "api-reference.pdf",
    type: "document",
    size: 890000,
    modified: new Date("2025-04-09"),
    starred: false,
    parentId: "2",
  },
];

// ─── Main Vault app ───────────────────────────────────────────────────────────

export default function VaultApp() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [view, setView] = useState<"grid" | "list">("grid");
  const [activeNav, setActiveNav] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [previewFile, setPreviewFile] = useState<FileItem | null>(null);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [search, setSearch] = useState("");

  // Build command palette sections from files
  const cmdSections = useMemo(() => {
    const topLevel = files.filter((f) => f.parentId === null);
    return [
      {
        id: "files",
        title: "Files",
        items: topLevel.map((f) => ({
          id: f.id,
          title: f.name,
          subtitle: f.size ? formatBytes(f.size) : "Folder",
          category: f.type,
          href: undefined,
        })),
      },
      {
        id: "actions",
        title: "Actions",
        items: [
          {
            id: "upload",
            title: "Upload files",
            subtitle: "Add new files",
            category: "action",
            href: undefined,
          },
          {
            id: "new-folder",
            title: "New folder",
            subtitle: "Create a new folder",
            category: "action",
            href: undefined,
          },
        ],
      },
    ];
  }, [files]);

  const visibleFiles = useMemo(() => {
    let result = files.filter((f) => f.parentId === currentFolder);
    if (activeNav === "starred") result = files.filter((f) => f.starred);
    if (activeNav === "recent")
      result = [...files]
        .sort((a, b) => b.modified.getTime() - a.modified.getTime())
        .slice(0, 8);
    if (search)
      result = files.filter((f) =>
        f.name.toLowerCase().includes(search.toLowerCase()),
      );
    return result;
  }, [files, currentFolder, activeNav, search]);

  const storageUsed = files.reduce((sum, f) => sum + (f.size ?? 0), 0);

  function toggleSelect(id: string) {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  }

  function toggleStar(id: string) {
    setFiles((prev) =>
      prev.map((f) => (f.id === id ? { ...f, starred: !f.starred } : f)),
    );
  }

  function deleteFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelected((prev) => {
      const n = new Set(prev);
      n.delete(id);
      return n;
    });
  }

  function deleteSelected() {
    setFiles((prev) => prev.filter((f) => !selected.has(f.id)));
    setSelected(new Set());
  }

  function addUploadedFiles(rawFiles: File[]) {
    const newItems: FileItem[] = rawFiles.map((f, i) => ({
      id: `uploaded-${Date.now()}-${i}`,
      name: f.name,
      type: getFileType(f),
      size: f.size,
      url: URL.createObjectURL(f),
      modified: new Date(),
      starred: false,
      parentId: currentFolder,
    }));
    setFiles((prev) => [...newItems, ...prev]);
  }

  const breadcrumbs = useMemo(() => {
    if (!currentFolder) return [];
    const folder = files.find((f) => f.id === currentFolder);
    return folder ? [folder] : [];
  }, [currentFolder, files]);

  return (
    <CommandPaletteRoot
      sections={cmdSections}
      defaultOpen={false}
      onSelect={(item) => {
        if (item.id === "upload") setUploadOpen(true);
        else if (item.category === "folder") {
          const file = files.find((f) => f.id === item.id);
          if (file?.type === "folder") setCurrentFolder(file.id);
        }
      }}
    >
      <FileUploadRoot
        config={UPLOAD_CONFIG}
        onUpload={simulateUpload}
        onComplete={(files) => {
          const uploaded = files.map((f) => f.file);
          addUploadedFiles(uploaded);
        }}
      >
        <SidebarProvider
          style={
            {
              "--sidebar-width": "calc(var(--spacing) * 60)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <VaultAppSidebar
            active={activeNav}
            onChange={(id) => typeof id == "string" && setActiveNav(id)}
            storageUsed={storageUsed}
          />
          <SidebarInset className="overflow-hidden border border-white/10 ">
            {/* Header */}
            <VaultHeader
              breadcrumbs={breadcrumbs}
              currentFolder={currentFolder}
              setCurrentFolder={setCurrentFolder}
              view={view}
              setView={setView}
            />

            <div className="flex flex-1 flex-col min-h-0">
              <VaultFileList
                visibleFiles={visibleFiles}
                selected={selected}
                toggleSelect={toggleSelect}
                toggleStar={toggleStar}
                deleteFile={deleteFile}
                setPreviewFile={setPreviewFile}
                setUploadOpen={setUploadOpen}
                view={view}
              />
            </div>

            {/* Selection bar */}
            <VaultSelectionBar
              selected={selected}
              setSelected={setSelected}
              deleteSelected={deleteSelected}
            />

            {/* Upload queue */}
            <AnimatePresence>
              <VaultUploadQueue />
            </AnimatePresence>
            <VaultFileViewer
              file={previewFile}
              currentIndex={visibleFiles.findIndex(
                (f) => f.id === previewFile?.id,
              )}
              files={visibleFiles}
              open={!!previewFile}
              onOpenChange={() => setPreviewFile(null)}
              onNavigate={(i) => setPreviewFile(visibleFiles[i])}
            />
          </SidebarInset>
        </SidebarProvider>
      </FileUploadRoot>
    </CommandPaletteRoot>
  );
}

const UPLOAD_CONFIG: FileUploadConfig = {
  accept: {
    "image/*": [],
    "video/*": [],
    "application/pdf": [".pdf"],
    "application/msword": [],
  },
  maxSize: 2000 * 1024 * 1024,
  maxFiles: 20,
  multiple: true,
  title: "Drop files into Drive",
  // auto: true,
  description: "Images, videos, PDFs, and documents up to 200MB",
  auto: true,
};

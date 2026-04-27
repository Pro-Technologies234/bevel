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
  simulateUpload,
} from "@/components/labs/vault/vault-utils";
import { formatBytes } from "@/components/bevelui/file-upload/file-upload-utils";
import { VaultUploadQueue } from "@/components/labs/vault/vault-upload-queue";
import { FileCard } from "@/components/labs/vault/vault-file-card";
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
  const [view, setView] = useState<"grid" | "list">("list");
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
      type: f.type.startsWith("image/")
        ? "image"
        : f.type.includes("video")
          ? "video"
          : f.type.includes("pdf") || f.type.includes("doc")
            ? "document"
            : "file",
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
              "--sidebar-width": "calc(var(--spacing) * 72)",
              "--header-height": "calc(var(--spacing) * 12)",
            } as React.CSSProperties
          }
        >
          <VaultAppSidebar
            active={activeNav}
            onChange={(id) => typeof id == "string" && setActiveNav(id)}
            storageUsed={storageUsed}
          />
          <SidebarInset className="overflow-hidden border border-white/10 bg-[radial-gradient(circle_at_top,rgba(194,241,60,0.07),transparent_28%),linear-gradient(180deg,rgba(255,255,255,0.02),rgba(255,255,255,0.01))]">
            {/* Header */}
            <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-white/10 bg-background/80 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
              {/* Breadcrumb */}
              <div className="flex w-full items-center  gap-2 px-4 lg:px-6">
                <SidebarTrigger className="-ml-1" />
                <Separator
                  orientation="vertical"
                  className="mx-2 data-[orientation=vertical]:h-4"
                />
                <button
                  onClick={() => setCurrentFolder(null)}
                  className={cn(
                    "hover:text-foreground transition-colors",
                    currentFolder ? "text-muted-foreground" : "font-medium",
                  )}
                >
                  Bevel Vault
                </button>
                {breadcrumbs.map((b) => (
                  <span key={b.id} className="flex items-center gap-1">
                    <IconChevronRight
                      size={12}
                      className="text-muted-foreground"
                    />
                    <span className="font-medium">{b.name}</span>
                  </span>
                ))}
                <div className="flex items-center gap-4 ml-auto">
                  {/* Search */}
                  <InputGroup className="relative rounded-full h-8">
                    <InputGroupAddon>
                      <IconSearch size={14} />
                    </InputGroupAddon>
                    <InputGroupInput
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search files..."
                    />
                  </InputGroup>

                  {/* ⌘K search */}
                  <CommandPaletteTrigger
                    label="Quick find"
                    className="h-8 text-xs rounded-full"
                  />

                  {/* View toggle */}
                  <ButtonGroup>
                    <Button
                      onClick={() => setView("list")}
                      variant={"outline"}
                      className={cn(
                        view === "list" ? "bg-muted" : "hover:bg-muted/50",
                      )}
                    >
                      <IconList size={14} />
                    </Button>
                    <Button
                      onClick={() => setView("grid")}
                      variant={"outline"}
                      className={cn(
                        view === "grid" ? "bg-muted" : "hover:bg-muted/50",
                      )}
                    >
                      <IconLayoutGrid size={14} />
                    </Button>
                  </ButtonGroup>

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button size="sm" className=" rounded-full px-4">
                        <IconPlus size={14} />
                        New
                      </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent className="w-40" align="end">
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
                </div>
              </div>
            </header>
            <div className="flex flex-1 flex-col">
              <div className="@container/main flex flex-1 flex-col gap-2">
                <div className="flex flex-col gap-6 p-4 md:p-6">
                  {/* Files */}
                  {visibleFiles.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                      <IconCloud size={32} strokeWidth={1.2} />
                      <p className="text-sm">
                        {search
                          ? "No files match your search"
                          : "This folder is empty"}
                      </p>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setUploadOpen(true)}
                      >
                        <IconPlus size={13} className="mr-1.5" /> Upload files
                      </Button>
                    </div>
                  ) : view === "list" ? (
                    <Table className="w-full">
                      <TableHeader>
                        <TableRow className="text-left border-b border-border/60">
                          <TableHead className="pl-4 pb-2 w-8">
                            <Checkbox
                              checked={!!selected}
                              onClick={() => {
                                // selected && setSelected(new Set())
                                visibleFiles.map((f) => toggleSelect(f.id));
                              }}
                              className="rounded mr-4 cursor-pointer"
                            />
                          </TableHead>
                          <TableHead className="pb-2 text-xs font-medium text-muted-foreground">
                            Name
                          </TableHead>
                          <TableHead className="pb-2 text-xs font-medium text-muted-foreground">
                            Size
                          </TableHead>
                          <TableHead className="pb-2 text-xs font-medium text-muted-foreground">
                            Modified
                          </TableHead>
                          <TableHead className="pb-2 pr-4 w-20"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {visibleFiles.map((file) => (
                          <FileRow
                            key={file.id}
                            file={file}
                            selected={selected.has(file.id)}
                            onSelect={toggleSelect}
                            onStar={toggleStar}
                            onDelete={deleteFile}
                            onOpen={() => setPreviewFile(file)}
                          />
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
                      <AnimatePresence mode="popLayout">
                        {visibleFiles.map((file) => (
                          <FileCard
                            key={file.id}
                            file={file}
                            selected={selected.has(file.id)}
                            onSelect={toggleSelect}
                            onStar={toggleStar}
                            onDelete={deleteFile}
                          />
                        ))}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="flex-1 flex flex-col min-w-0">
              {/* Selection bar */}
              <AnimatePresence>
                {selected.size > 0 && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className=" fixed bottom-4 inset-x-1/2 bg-white "
                  >
                    <div className="flex items-center gap-1 pl-4 pr-1 py-1 bg-popover border rounded-full mx-auto w-fit">
                      <span className="text-xs font-medium text-primary uppercase">
                        {selected.size} selected
                      </span>
                      <Button
                        variant="destructive"
                        size="sm"
                        className="h-7 gap-1 text-xs rounded-full ml-4"
                        onClick={deleteSelected}
                      >
                        <IconTrash size={12} /> Delete
                      </Button>
                      <Button
                        variant="secondary"
                        size="sm"
                        className="h-7 gap-1 text-xs  rounded-full"
                        onClick={() => setSelected(new Set())}
                      >
                        Clear
                      </Button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            {/* Upload queue */}
            <AnimatePresence>
              <VaultUploadQueue />
            </AnimatePresence>
            <VaultFileViewer
              file={previewFile}
              open={!!previewFile}
              onOpenChange={() => setPreviewFile(null)}
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
};

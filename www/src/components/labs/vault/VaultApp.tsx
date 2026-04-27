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
} from "@tabler/icons-react";
import { FileUploadRoot } from "@/components/bevelui/file-upload";
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  useCommandPalette,
} from "@/components/bevelui/command-palette";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

// ─── Types ────────────────────────────────────────────────────────────────────

type FileItem = {
  id: string;
  name: string;
  type: "folder" | "image" | "document" | "video" | "file";
  size?: number;
  modified: Date;
  starred: boolean;
  parentId: string | null;
  url?: string;
};

// ─── Mock data ────────────────────────────────────────────────────────────────

const INITIAL_FILES: FileItem[] = [
  { id: "1", name: "Design Assets", type: "folder", modified: new Date("2025-04-10"), starred: true, parentId: null },
  { id: "2", name: "Project Docs", type: "folder", modified: new Date("2025-04-08"), starred: false, parentId: null },
  { id: "3", name: "hero-screenshot.png", type: "image", size: 2400000, modified: new Date("2025-04-12"), starred: false, parentId: null },
  { id: "4", name: "brand-guidelines.pdf", type: "document", size: 1800000, modified: new Date("2025-04-05"), starred: true, parentId: null },
  { id: "5", name: "demo-walkthrough.mp4", type: "video", size: 48000000, modified: new Date("2025-04-01"), starred: false, parentId: null },
  { id: "6", name: "component-specs.docx", type: "document", size: 340000, modified: new Date("2025-03-28"), starred: false, parentId: null },
  { id: "7", name: "logo-final.svg", type: "image", size: 24000, modified: new Date("2025-04-14"), starred: true, parentId: "1" },
  { id: "8", name: "icons-set.zip", type: "file", size: 5600000, modified: new Date("2025-04-13"), starred: false, parentId: "1" },
  { id: "9", name: "architecture.md", type: "document", size: 12000, modified: new Date("2025-04-11"), starred: false, parentId: "2" },
  { id: "10", name: "api-reference.pdf", type: "document", size: 890000, modified: new Date("2025-04-09"), starred: false, parentId: "2" },
];

// ─── Utilities ────────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function getFileIcon(type: FileItem["type"]) {
  switch (type) {
    case "folder": return IconFolder;
    case "image": return IconPhoto;
    case "document": return IconFileText;
    case "video": return IconVideo;
    default: return IconFile;
  }
}

function getFileColor(type: FileItem["type"]): string {
  switch (type) {
    case "folder": return "#f59e0b";
    case "image": return "#8b5cf6";
    case "document": return "#3b82f6";
    case "video": return "#ef4444";
    default: return "#6b7280";
  }
}

// Simulated upload — in a real app this hits your storage API
async function simulateUpload(file: File, onProgress: (pct: number) => void) {
  await new Promise<void>((resolve) => {
    let p = 0;
    const t = setInterval(() => {
      p += Math.random() * 18 + 4;
      if (p >= 100) { onProgress(100); clearInterval(t); resolve(); }
      else onProgress(Math.round(p));
    }, 80);
  });
  return { url: URL.createObjectURL(file) };
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  { id: "all", label: "All files", icon: IconCloud },
  { id: "recent", label: "Recent", icon: IconClock },
  { id: "starred", label: "Starred", icon: IconStar },
];

function Sidebar({
  active,
  onSelect,
  storageUsed,
}: {
  active: string;
  onSelect: (id: string) => void;
  storageUsed: number;
}) {
  const usedPct = Math.min((storageUsed / (15 * 1024 * 1024 * 1024)) * 100, 100);

  return (
    <aside className="w-52 shrink-0 flex flex-col border-r border-border h-full bg-muted/10">
      <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
        <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center">
          <IconBoltFilled size={12} color="#0a0a0a" />
        </div>
        <span className="font-semibold text-sm">Vault</span>
        <Badge variant="secondary" className="text-[9px] ml-auto px-1.5 py-0">Beta</Badge>
      </div>

      <nav className="flex-1 p-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV_ITEMS.map((item) => (
          <button
            key={item.id}
            onClick={() => onSelect(item.id)}
            className={cn(
              "flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-colors text-left w-full",
              active === item.id
                ? "bg-primary/10 text-primary font-medium"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
            )}
          >
            <item.icon size={14} strokeWidth={1.8} />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Storage meter */}
      <div className="p-4 border-t border-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-[11px] text-muted-foreground">Storage</span>
          <span className="text-[11px] font-mono text-muted-foreground">
            {formatBytes(storageUsed)} / 15 GB
          </span>
        </div>
        <div className="h-1.5 rounded-full bg-muted overflow-hidden">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${usedPct}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
          />
        </div>
      </div>
    </aside>
  );
}

// ─── File row / grid card ─────────────────────────────────────────────────────

function FileRow({
  file,
  selected,
  onSelect,
  onStar,
  onDelete,
}: {
  file: FileItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = getFileIcon(file.type);
  const color = getFileColor(file.type);

  return (
    <motion.tr
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.96 }}
      onClick={() => onSelect(file.id)}
      className={cn(
        "group cursor-pointer transition-colors",
        selected ? "bg-primary/5" : "hover:bg-muted/30",
      )}
    >
      <td className="pl-4 py-2.5 w-8">
        <input
          type="checkbox"
          checked={selected}
          onChange={() => onSelect(file.id)}
          onClick={(e) => e.stopPropagation()}
          className="rounded"
        />
      </td>
      <td className="py-2.5 pr-2">
        <div className="flex items-center gap-2.5">
          <Icon size={16} strokeWidth={1.6} style={{ color }} />
          <span className="text-sm font-medium truncate max-w-[200px]">{file.name}</span>
        </div>
      </td>
      <td className="py-2.5 text-xs text-muted-foreground">
        {file.size ? formatBytes(file.size) : "—"}
      </td>
      <td className="py-2.5 text-xs text-muted-foreground">
        {formatDistanceToNow(file.modified, { addSuffix: true })}
      </td>
      <td className="py-2.5 pr-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          <button
            onClick={(e) => { e.stopPropagation(); onStar(file.id); }}
            className={cn("p-1 rounded hover:bg-muted", file.starred && "text-amber-400")}
          >
            <IconStar size={13} fill={file.starred ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
          >
            <IconTrash size={13} />
          </button>
        </div>
      </td>
    </motion.tr>
  );
}

function FileCard({
  file,
  selected,
  onSelect,
  onStar,
  onDelete,
}: {
  file: FileItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
}) {
  const Icon = getFileIcon(file.type);
  const color = getFileColor(file.type);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => onSelect(file.id)}
      className={cn(
        "group relative p-4 rounded-xl border cursor-pointer transition-all",
        selected
          ? "border-primary/40 bg-primary/5"
          : "border-border hover:border-border/80 hover:bg-muted/30 bg-muted/10",
      )}
    >
      <div className="flex items-start justify-between mb-3">
        <div
          className="w-10 h-10 rounded-lg flex items-center justify-center"
          style={{ background: `${color}18` }}
        >
          <Icon size={20} strokeWidth={1.5} style={{ color }} />
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onStar(file.id); }}
            className={cn("p-1 rounded hover:bg-muted/60", file.starred && "text-amber-400")}
          >
            <IconStar size={12} fill={file.starred ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onDelete(file.id); }}
            className="p-1 rounded hover:bg-muted/60 text-muted-foreground hover:text-destructive"
          >
            <IconTrash size={12} />
          </button>
        </div>
      </div>
      <p className="text-xs font-medium truncate mb-0.5">{file.name}</p>
      <p className="text-[10px] text-muted-foreground">
        {file.size ? formatBytes(file.size) : "Folder"} ·{" "}
        {formatDistanceToNow(file.modified, { addSuffix: true })}
      </p>
    </motion.div>
  );
}

// ─── Upload drawer ────────────────────────────────────────────────────────────

function UploadDrawer({
  open,
  onClose,
  onFilesAdded,
}: {
  open: boolean;
  onClose: () => void;
  onFilesAdded: (files: File[]) => void;
}) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 z-40 bg-background/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed right-0 top-0 bottom-0 z-50 w-96 bg-background border-l border-border flex flex-col"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
          >
            <div className="flex items-center justify-between px-5 py-4 border-b border-border">
              <h2 className="font-semibold text-sm">Upload files</h2>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                ×
              </Button>
            </div>
            <div className="flex-1 overflow-y-auto p-5">
              <FileUploadRoot
                config={{
                  multiple: true,
                  maxFiles: 20,
                  maxSize: 100 * 1024 * 1024,
                  title: "Drop files here",
                  description: "Any file type up to 100MB",
                }}
                onUpload={simulateUpload}
                onComplete={(files) => {
                  onFilesAdded(files.map((f) => f.file));
                  onClose();
                }}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

// ─── Main Vault app ───────────────────────────────────────────────────────────

export default function VaultApp() {
  const [files, setFiles] = useState<FileItem[]>(INITIAL_FILES);
  const [view, setView] = useState<"grid" | "list">("list");
  const [activeNav, setActiveNav] = useState("all");
  const [currentFolder, setCurrentFolder] = useState<string | null>(null);
  const [selected, setSelected] = useState<Set<string>>(new Set());
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
          { id: "upload", title: "Upload files", subtitle: "Add new files", category: "action", href: undefined },
          { id: "new-folder", title: "New folder", subtitle: "Create a new folder", category: "action", href: undefined },
        ],
      },
    ];
  }, [files]);

  const visibleFiles = useMemo(() => {
    let result = files.filter((f) => f.parentId === currentFolder);
    if (activeNav === "starred") result = files.filter((f) => f.starred);
    if (activeNav === "recent") result = [...files].sort((a, b) => b.modified.getTime() - a.modified.getTime()).slice(0, 8);
    if (search) result = files.filter((f) => f.name.toLowerCase().includes(search.toLowerCase()));
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
    setFiles((prev) => prev.map((f) => f.id === id ? { ...f, starred: !f.starred } : f));
  }

  function deleteFile(id: string) {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    setSelected((prev) => { const n = new Set(prev); n.delete(id); return n; });
  }

  function deleteSelected() {
    setFiles((prev) => prev.filter((f) => !selected.has(f.id)));
    setSelected(new Set());
  }

  function addUploadedFiles(rawFiles: File[]) {
    const newItems: FileItem[] = rawFiles.map((f, i) => ({
      id: `uploaded-${Date.now()}-${i}`,
      name: f.name,
      type: f.type.startsWith("image/") ? "image" : f.type.includes("video") ? "video" : f.type.includes("pdf") || f.type.includes("doc") ? "document" : "file",
      size: f.size,
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
      <div className="flex h-full rounded-2xl overflow-hidden border border-border bg-background">
        <Sidebar active={activeNav} onSelect={setActiveNav} storageUsed={storageUsed} />

        <div className="flex-1 flex flex-col min-w-0">
          {/* Toolbar */}
          <div className="flex items-center gap-3 px-5 py-3 border-b border-border">
            {/* Breadcrumb */}
            <div className="flex items-center gap-1 text-sm flex-1 min-w-0">
              <button
                onClick={() => setCurrentFolder(null)}
                className={cn("hover:text-foreground transition-colors", currentFolder ? "text-muted-foreground" : "font-medium")}
              >
                My Vault
              </button>
              {breadcrumbs.map((b) => (
                <span key={b.id} className="flex items-center gap-1">
                  <IconChevronRight size={12} className="text-muted-foreground" />
                  <span className="font-medium">{b.name}</span>
                </span>
              ))}
            </div>

            {/* Search */}
            <div className="relative">
              <IconSearch size={14} className="absolute left-2.5 top-1/2 -translate-y-1/2 text-muted-foreground" />
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search files..."
                className="h-8 pl-8 pr-3 text-xs bg-muted/40 border border-border rounded-lg outline-none focus:border-primary/50 w-48"
              />
            </div>

            {/* ⌘K search */}
            <CommandPaletteTrigger label="Quick find" className="h-8 text-xs w-32" />

            {/* View toggle */}
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => setView("list")}
                className={cn("px-2.5 py-1.5 transition-colors", view === "list" ? "bg-muted" : "hover:bg-muted/50")}
              >
                <IconList size={14} />
              </button>
              <button
                onClick={() => setView("grid")}
                className={cn("px-2.5 py-1.5 transition-colors", view === "grid" ? "bg-muted" : "hover:bg-muted/50")}
              >
                <IconLayoutGrid size={14} />
              </button>
            </div>

            {/* Upload button */}
            <Button
              size="sm"
              className="h-8 gap-1.5 text-xs"
              onClick={() => setUploadOpen(true)}
            >
              <IconUpload size={12} />
              Upload
            </Button>
          </div>

          {/* Selection bar */}
          <AnimatePresence>
            {selected.size > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="flex items-center gap-3 px-5 py-2 bg-primary/5 border-b border-primary/20"
              >
                <span className="text-xs font-medium text-primary">{selected.size} selected</span>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs" onClick={deleteSelected}>
                  <IconTrash size={12} /> Delete
                </Button>
                <Button variant="ghost" size="sm" className="h-7 gap-1 text-xs ml-auto" onClick={() => setSelected(new Set())}>
                  Clear
                </Button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Files */}
          <div className="flex-1 overflow-y-auto p-4">
            {visibleFiles.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
                <IconCloud size={32} strokeWidth={1.2} />
                <p className="text-sm">
                  {search ? "No files match your search" : "This folder is empty"}
                </p>
                <Button size="sm" variant="outline" onClick={() => setUploadOpen(true)}>
                  <IconPlus size={13} className="mr-1.5" /> Upload files
                </Button>
              </div>
            ) : view === "list" ? (
              <table className="w-full">
                <thead>
                  <tr className="text-left border-b border-border/60">
                    <th className="pl-4 pb-2 w-8"></th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Name</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Size</th>
                    <th className="pb-2 text-xs font-medium text-muted-foreground">Modified</th>
                    <th className="pb-2 pr-4 w-20"></th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence mode="popLayout">
                    {visibleFiles.map((file) => (
                      <FileRow
                        key={file.id}
                        file={file}
                        selected={selected.has(file.id)}
                        onSelect={toggleSelect}
                        onStar={toggleStar}
                        onDelete={deleteFile}
                      />
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
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

      {/* Upload drawer */}
      <UploadDrawer
        open={uploadOpen}
        onClose={() => setUploadOpen(false)}
        onFilesAdded={addUploadedFiles}
      />
    </CommandPaletteRoot>
  );
}

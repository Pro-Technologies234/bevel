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
import { getFileColor, getFileIcon, simulateUpload } from "@/components/labs/vault/vault-utils";
import { formatBytes } from "@/components/bevelui/file-upload/file-upload-utils";
import { VaultUploadQueue } from "@/components/labs/vault/vault-upload-queue";
import { Checkbox } from "@/components/ui/checkbox";
import { TableCell, TableRow } from "@/components/ui/table";



// ─── File row / grid card ─────────────────────────────────────────────────────

export function FileRow({
  file,
  selected,
  onSelect,
  onStar,
  onDelete,
  onOpen,
}: {
  file: FileItem;
  selected: boolean;
  onSelect: (id: string) => void;
  onStar: (id: string) => void;
  onDelete: (id: string) => void;
  onOpen: () => void
}) {
  const Icon = getFileIcon(file.type);
  const color = getFileColor(file.type);

  return (
    <TableRow
      className={cn(
        "group  transition-colors",
        selected ? "bg-primary/5" : "hover:bg-muted/30",
      )}
    >
      <TableCell className="pl-4 py-2.5 w-8 ">
        <Checkbox
          checked={selected}
          onClick={() => onSelect(file.id)}
          onChange={() => onSelect(file.id)}
          className="rounded mr-4 cursor-pointer"
        />
      </TableCell>
      <TableCell onClick={onOpen} className="py-2.5 pr-2 cursor-pointer">
        <div className="flex items-center gap-2.5">
          <Icon size={16} strokeWidth={1.6} style={{ color }} />
          <span className="text-sm font-medium truncate max-w-[200px]">
            {file.name}
          </span>
        </div>
      </TableCell>
      <TableCell className="py-2.5 text-xs text-muted-foreground">
        {file.size ? formatBytes(file.size) : "—"}
      </TableCell>
      <TableCell className="py-2.5 text-xs text-muted-foreground">
        {formatDistanceToNow(file.modified, { addSuffix: true })}
      </TableCell>
      <TableCell className="py-2.5 pr-4">
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              onStar(file.id);
            }}
            className={cn(
              "p-1 rounded hover:bg-muted",
              file.starred && "text-amber-400",
            )}
          >
            <IconStar size={13} fill={file.starred ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.id);
            }}
            className="p-1 rounded hover:bg-muted text-muted-foreground hover:text-destructive"
          >
            <IconTrash size={13} />
          </button>
        </div>
      </TableCell>
    </TableRow>
  );
}

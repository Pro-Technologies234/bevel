import { motion } from "motion/react";
import {
  IconTrash,
  IconStar,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { FileItem } from "@/components/labs/vault/vault-types";
import { getFileColor, getFileIcon } from "@/components/labs/vault/vault-utils";
import { formatBytes } from "@/components/bevelui/file-upload/file-upload-utils";


export function FileCard({
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
        "group relative p-4 rounded-lg border cursor-pointer transition-all",
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
            onClick={(e) => {
              e.stopPropagation();
              onStar(file.id);
            }}
            className={cn(
              "p-1 rounded hover:bg-muted/60",
              file.starred && "text-amber-400",
            )}
          >
            <IconStar size={12} fill={file.starred ? "currentColor" : "none"} />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(file.id);
            }}
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

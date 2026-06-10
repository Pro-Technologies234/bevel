import * as React from "react";
import { useGallery } from "./gallery-context";
import { cn } from "@/lib/utils";
import {
  IconFileText,
  IconMusic,
  IconVideo,
  IconFile,
  IconCheck,
  IconEye,
} from "@tabler/icons-react";
import type { GalleryItem, MediaType } from "./types";

function formatSize(bytes?: number): string {
  if (!bytes) return "";
  if (bytes < 1024) return `${bytes}B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`;
}

function formatDuration(seconds?: number): string {
  if (!seconds) return "";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

const TYPE_ICONS: Record<MediaType, React.ElementType> = {
  image: IconFile,
  video: IconVideo,
  audio: IconMusic,
  document: IconFileText,
  other: IconFile,
};

export interface GalleryItemProps {
  item: GalleryItem;
  className?: string;
}

export function GalleryItemCard({ item, className }: GalleryItemProps) {
  const { selectedIds, lightboxId, config, select, openLightbox } =
    useGallery();
  const isSelected = selectedIds.has(item.id);
  const mode = config.selectionMode ?? "single";
  const ar = config.aspectRatio ?? 1;

  const thumb = item.thumbnail ?? (item.type === "image" ? item.url : null);
  const Icon = TYPE_ICONS[item.type];

  function handleClick(e: React.MouseEvent) {
    if (mode !== "none") {
      select(item.id, e.metaKey || e.ctrlKey || e.shiftKey);
    }
  }

  function handleDoubleClick() {
    if (item.type === "image" || item.type === "video") {
      openLightbox(item.id);
    }
  }

  return (
    <div
      onClick={handleClick}
      onDoubleClick={handleDoubleClick}
      className={cn(
        "group relative rounded-lg overflow-hidden border-2 transition-all cursor-pointer",
        "bg-muted/30 hover:bg-muted/50",
        isSelected
          ? "border-primary shadow-[0_0_0_1px] shadow-primary"
          : "border-transparent hover:border-border",
        className,
      )}
      style={{ aspectRatio: ar }}
    >
      {/* Thumbnail */}
      {thumb ? (
        <img
          src={thumb}
          alt={item.name}
          className="w-full h-full object-cover"
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full flex items-center justify-center">
          <Icon
            size={28}
            strokeWidth={1.5}
            className="text-muted-foreground/40"
          />
        </div>
      )}

      {/* Overlay on hover */}
      <div
        className={cn(
          "absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors",
          isSelected && "bg-primary/10",
        )}
      />

      {/* Selection checkbox */}
      {mode !== "none" && (
        <div
          className={cn(
            "absolute top-1.5 left-1.5 w-4.5 h-4.5 rounded-full border-2 flex items-center justify-center transition-all",
            isSelected
              ? "border-primary bg-primary scale-100"
              : "border-white/60 bg-black/20 scale-75 opacity-0 group-hover:opacity-100 group-hover:scale-100",
          )}
        >
          {isSelected && (
            <IconCheck size={10} strokeWidth={3} className="text-black" />
          )}
        </div>
      )}

      {/* Preview button (images/video) */}
      {(item.type === "image" || item.type === "video") && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            openLightbox(item.id);
          }}
          className="absolute top-1.5 right-1.5 w-6 h-6 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60"
          aria-label="Preview"
        >
          <IconEye size={12} className="text-white" />
        </button>
      )}

      {/* Duration badge */}
      {item.duration && (
        <div className="absolute bottom-1 right-1 px-1 py-0.5 rounded bg-black/60 text-[9px] font-mono text-white">
          {formatDuration(item.duration)}
        </div>
      )}

      {/* Name + size (if showNames) */}
      {config.showNames && (
        <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 to-transparent p-2 pt-4">
          <p className="text-[10px] text-white truncate">{item.name}</p>
          {item.size && (
            <p className="text-[9px] text-white/60">{formatSize(item.size)}</p>
          )}
        </div>
      )}
    </div>
  );
}

GalleryItemCard.displayName = "GalleryItemCard";

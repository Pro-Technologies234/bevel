export type MediaType = "image" | "video" | "audio" | "document" | "other";

export interface GalleryItem {
  id: string;
  url: string;
  type: MediaType;
  name: string;
  size?: number;
  width?: number;
  height?: number;
  duration?: number;
  thumbnail?: string;
  createdAt?: Date;
  meta?: Record<string, unknown>;
}

export interface GalleryConfig {
  selectionMode?: "none" | "single" | "multi";
  sortable?: boolean;
  columns?: number;
  aspectRatio?: number;
  showNames?: boolean;
  showTypes?: boolean;
}

export interface GalleryContextValue {
  items: GalleryItem[];
  selectedIds: Set<string>;
  lightboxId: string | null;
  filter: MediaType | "all";
  config: GalleryConfig;

  select: (id: string, multi?: boolean) => void;
  deselect: (id: string) => void;
  selectAll: () => void;
  clearSelection: () => void;
  openLightbox: (id: string) => void;
  closeLightbox: () => void;
  nextLightbox: () => void;
  prevLightbox: () => void;
  setFilter: (f: MediaType | "all") => void;
  reorder: (items: GalleryItem[]) => void;
}

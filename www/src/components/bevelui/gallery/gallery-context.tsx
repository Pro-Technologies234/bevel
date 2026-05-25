import * as React from "react";
import type {
  GalleryConfig,
  GalleryContextValue,
  GalleryItem,
  MediaType,
} from "./gallery-types";

export const GalleryCtx = React.createContext<GalleryContextValue | null>(null);

export function useGallery(): GalleryContextValue {
  const ctx = React.useContext(GalleryCtx);
  if (!ctx) throw new Error("useGallery must be used inside GalleryRoot");
  return ctx;
}

export interface GalleryProviderProps {
  items: GalleryItem[];
  onReorder?: (items: GalleryItem[]) => void;
  onSelect?: (selectedIds: string[]) => void;
  config?: GalleryConfig;
  children?: React.ReactNode;
  className?: string;
}

export function GalleryProvider({
  children,
  config = {},
  items: itemsProp,
  onReorder,
  onSelect,
}: GalleryProviderProps) {
  const [items, setItems] = React.useState<GalleryItem[]>(itemsProp);
  const [selectedIds, setSelectedIds] = React.useState<Set<string>>(new Set());
  const [lightboxId, setLightboxId] = React.useState<string | null>(null);
  const [filter, setFilter] = React.useState<MediaType | "all">("all");

  React.useEffect(() => {
    setItems(itemsProp);
  }, [itemsProp]);

  const filteredItems =
    filter === "all" ? items : items.filter((i) => i.type === filter);

  const lightboxItems = filteredItems.filter(
    (i) => i.type === "image" || i.type === "video",
  );

  const select = React.useCallback(
    (id: string, multi = false) => {
      const mode = config.selectionMode ?? "single";
      if (mode === "none") return;

      setSelectedIds((prev) => {
        if (mode === "single") return new Set([id]);
        if (multi && mode === "multi") {
          const next = new Set(prev);
          if (next.has(id)) next.delete(id);
          else next.add(id);
          return next;
        }
        return new Set([id]);
      });
    },
    [config.selectionMode],
  );

  const deselect = React.useCallback((id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
  }, []);

  const selectAll = React.useCallback(() => {
    setSelectedIds(new Set(filteredItems.map((i) => i.id)));
  }, [filteredItems]);

  const clearSelection = React.useCallback(() => {
    setSelectedIds(new Set());
  }, []);

  const openLightbox = React.useCallback((id: string) => {
    setLightboxId(id);
  }, []);

  const closeLightbox = React.useCallback(() => {
    setLightboxId(null);
  }, []);

  const nextLightbox = React.useCallback(() => {
    setLightboxId((prev) => {
      if (!prev) return null;
      const idx = lightboxItems.findIndex((i) => i.id === prev);
      const next = lightboxItems[(idx + 1) % lightboxItems.length];
      return next?.id ?? prev;
    });
  }, [lightboxItems]);

  const prevLightbox = React.useCallback(() => {
    setLightboxId((prev) => {
      if (!prev) return null;
      const idx = lightboxItems.findIndex((i) => i.id === prev);
      const next =
        lightboxItems[(idx - 1 + lightboxItems.length) % lightboxItems.length];
      return next?.id ?? prev;
    });
  }, [lightboxItems]);

  const reorder = React.useCallback(
    (next: GalleryItem[]) => {
      setItems(next);
      onReorder?.(next);
    },
    [onReorder],
  );

  React.useEffect(() => {
    onSelect?.(Array.from(selectedIds));
  }, [selectedIds]);

  return (
    <GalleryCtx.Provider
      value={{
        items: filteredItems,
        selectedIds,
        lightboxId,
        filter,
        config,
        select,
        deselect,
        selectAll,
        clearSelection,
        openLightbox,
        closeLightbox,
        nextLightbox,
        prevLightbox,
        setFilter,
        reorder,
      }}
    >
      {children}
    </GalleryCtx.Provider>
  );
}

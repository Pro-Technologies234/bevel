import * as React from "react";
import { useGallery } from "./gallery-context";
import { cn } from "@/lib/utils";
import {
  IconX,
  IconChevronLeft,
  IconChevronRight,
  IconDownload,
} from "@tabler/icons-react";

export function GalleryLightbox() {
  const { items, lightboxId, closeLightbox, nextLightbox, prevLightbox } =
    useGallery();
  const item = items.find((i) => i.id === lightboxId);

  React.useEffect(() => {
    if (!lightboxId) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") nextLightbox();
      if (e.key === "ArrowLeft") prevLightbox();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxId, closeLightbox, nextLightbox, prevLightbox]);

  if (!lightboxId || !item) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm"
      onClick={closeLightbox}
    >
      <div className="absolute top-4 right-4 flex items-center gap-2 z-10">
        <a
          href={item.url}
          download={item.name}
          onClick={(e) => e.stopPropagation()}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <IconDownload size={15} />
        </a>
        <button
          onClick={closeLightbox}
          className="w-8 h-8 flex items-center justify-center rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors"
        >
          <IconX size={15} />
        </button>
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          prevLightbox();
        }}
        className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <IconChevronLeft size={20} />
      </button>
      <button
        onClick={(e) => {
          e.stopPropagation();
          nextLightbox();
        }}
        className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 flex items-center justify-center rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
      >
        <IconChevronRight size={20} />
      </button>

      <div
        className="relative max-w-[90vw] max-h-[85vh] flex items-center justify-center"
        onClick={(e) => e.stopPropagation()}
      >
        {item.type === "image" && (
          <img
            src={item.url}
            alt={item.name}
            className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-2xl"
          />
        )}
        {item.type === "video" && (
          <video
            src={item.url}
            controls
            autoPlay
            className="max-w-full max-h-[85vh] rounded-lg shadow-2xl"
          />
        )}

        <div className="absolute -bottom-8 left-0 right-0 text-center">
          <p className="text-[11px] text-white/60 truncate">{item.name}</p>
        </div>
      </div>
    </div>
  );
}

GalleryLightbox.displayName = "GalleryLightbox";

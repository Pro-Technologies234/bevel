import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronRightFilled,
  IconDownload,
  IconFile,
  IconMaximize,
  IconMinimize,
  IconTrash,
  IconX,
  IconZoomIn,
  IconZoomOut,
  IconZoomReset,
} from "@tabler/icons-react";
import { FileItem } from "./vault-types";
import { useCallback, useEffect, useRef, useState } from "react";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

// ─── File Preview Dialog (Full-Featured) ────────────────────────────────────
export function VaultFileViewer({
  file,
  open,
  onOpenChange,
  files,
  currentIndex,
  onNavigate,
}: {
  file: FileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Optional list of all files for navigation (prev/next) */
  files?: FileItem[];
  /** Current index in `files` (if navigation is active) */
  currentIndex?: number;
  /** Called when user navigates to a different file */
  onNavigate?: (index: number) => void;
}) {
  // fallback to single file if no files array provided
  const currentFile = files?.[currentIndex ?? 0] || file;
  const hasNavigation = files && files.length > 1 && currentIndex != null;
  const [full, setFull] = useState(false);
  // Zoom & Pan state (only for images)
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStart = useRef({ x: 0, y: 0 });
  const panRef = useRef(pan);
  panRef.current = pan; // keep pan ref for event handlers without re-binding

  const dialogContainerRef = useRef<HTMLDivElement>(null);
  const isFullscreen = useRef(false);

  // Reset zoom/pan on file change
  useEffect(() => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  }, [currentFile?.id]);

  useEffect(() => {
    setFull(false);
  }, [open]);

  // ─── Navigation helpers ──────────────────────────────────────────────────
  const goNext = useCallback(() => {
    if (!hasNavigation || currentIndex == null || !files) return;
    const nextIndex = (currentIndex + 1) % files.length;
    onNavigate?.(nextIndex);
  }, [hasNavigation, currentIndex, files, onNavigate]);

  const goPrev = useCallback(() => {
    if (!hasNavigation || currentIndex == null || !files) return;
    const prevIndex = (currentIndex - 1 + files.length) % files.length;
    onNavigate?.(prevIndex);
  }, [hasNavigation, currentIndex, files, onNavigate]);

  // ─── Fullscreen ──────────────────────────────────────────────────────────
  const toggleFullscreen = useCallback(() => {
    const el = dialogContainerRef.current;
    if (!el) return;

    if (!document.fullscreenElement) {
      el.requestFullscreen().then(() => {
        isFullscreen.current = true;
      });
      setFull(true);
    } else {
      document.exitFullscreen().then(() => {
        isFullscreen.current = false;
      });
      setFull(false);
    }
  }, []);

  // ─── Keyboard shortcuts ──────────────────────────────────────────────────
  useEffect(() => {
    if (!open) return;

    const handler = (e: KeyboardEvent) => {
      // Don't trap shortcuts from inputs
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      )
        return;

      switch (e.key) {
        case "ArrowRight":
          if (hasNavigation) goNext();
          break;
        case "ArrowLeft":
          if (hasNavigation) goPrev();
          break;
        case "f":
          toggleFullscreen();
          break;
        default:
          break;
      }
    };

    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [open, onOpenChange, hasNavigation, goNext, goPrev, toggleFullscreen]);

  // ─── Render nothing if no file ───────────────────────────────────────────
  if (!currentFile) return null;

  const isImage = currentFile.type === "image";
  const isVideo = currentFile.type === "video";
  const isPdf = currentFile.type === "document";
  const previewUrl = currentFile.url;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        ref={dialogContainerRef}
        showCloseButton={false}
        className={cn(
          "min-h-[70vh] sm:max-w-6xl sm:rounded-md bg-popover/80 backdrop-blur-xl gap-0 pt-0 flex flex-col! justify-between duration-0",
          full && " translate-x-0! translate-y-0! rotate-none",
        )}
      >
        <DialogHeader className="flex-row items-center justify-between py-4">
          <DialogTitle className=" max-w-lg line-clamp-1">
            {currentFile.name}
          </DialogTitle>
          <DialogClose>
            <Button size={"icon-lg"} variant={"ghost"}>
              <IconX />
            </Button>
          </DialogClose>
        </DialogHeader>
        <div className="flex items-center justify-center px-4 flex-1">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={currentFile.name}
              className="max-h-[70vh] object-contain"
            />
          )}
          {isVideo && (
            <video
              src={previewUrl}
              autoPlay
              className={cn("max-h-[70vh]  w-full", full && "max-h-[85vh]")}
            />
          )}
          {isPdf && (
            <iframe
              src={previewUrl}
              className={cn("h-[70vh] w-full", full && "h-[85vh]")}
              title={currentFile.name}
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
                  download={currentFile.name}
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
        <DialogFooter className="flex justify-between items-center h-14">
          <Button
            variant="outline"
            className="mr-auto"
            onClick={() => onOpenChange(false)}
          >
            Close
          </Button>
          <div className="flex gap-2">
            {(isImage || isPdf || isVideo) && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={toggleFullscreen}
                title="Fullscreen (F)"
              >
                <IconMaximize className="h-4 w-4" />
              </Button>
            )}
            <Separator orientation="vertical" />
            <Button variant={"destructive"}>
              <IconTrash /> Delete
            </Button>
            <Button variant={"secondary"}>
              <IconDownload /> Download
            </Button>
          </div>
        </DialogFooter>
        {hasNavigation && (
          <>
            <Button
              variant="ghost"
              size="icon"
              className="absolute left-2 top-1/2 -translate-y-1/2 z-10 h-1/8 w-8 rounded-xs bg-background/40 backdrop-blur hover:bg-background/90"
              onClick={goPrev}
            >
              <IconChevronRightFilled className="h-4 w-4 -scale-x-100" />
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-1/2 -translate-y-1/2 z-10 h-1/8 w-8 rounded-xs bg-background/40 backdrop-blur hover:bg-background/90"
              onClick={goNext}
            >
              <IconChevronRightFilled className="h-4 w-4" />
            </Button>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

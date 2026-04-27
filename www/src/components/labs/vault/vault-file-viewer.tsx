import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { IconDownload, IconFile } from "@tabler/icons-react";
import { FileItem } from "./vault-types";

// ─── File Preview Dialog ─────────────────────────────────────────────────────
export function VaultFileViewer({
  file,
  open,
  onOpenChange,
}: {
  file: FileItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!file) return null;

  const isImage = file.type === "image"
  const isVideo = file.type === "video"
  const isPdf = file.type === "document";
  const previewUrl = file.url

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-4xl">
        <DialogHeader>
          <DialogTitle>{file.name}</DialogTitle>
        </DialogHeader>
        <div className="flex items-center justify-center p-4">
          {isImage && (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={previewUrl}
              alt={file.name}
              className="max-h-[70vh] object-contain"
            />
          )}
          {isVideo && (
            <video src={previewUrl} controls className="max-h-[70vh] w-full" />
          )}
          {isPdf && (
            <iframe
              src={previewUrl}
              className="h-[70vh] w-full"
              title={file.name}
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
                  download={file.name}
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
      </DialogContent>
    </Dialog>
  );
}
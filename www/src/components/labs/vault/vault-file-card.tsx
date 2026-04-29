import { motion } from "motion/react";
import {
  IconTrash,
  IconStar,
  IconDots,
  IconDownload,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";
import { FileItem } from "@/components/labs/vault/vault-types";
import { getFileColor, getFileIcon } from "@/components/labs/vault/vault-utils";
import { formatBytes } from "@/components/bevelui/file-upload/file-upload-utils";
import React from "react";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { ca } from "date-fns/locale";

function FileCardMemo({
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
  onOpen: () => void;
}) {
  const Icon = getFileIcon(file.type);
  const color = getFileColor(file.type);
  const type = file.type;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      onClick={() => onSelect(file.id)}
      className={cn("")}
    >
      <Card onDoubleClick={onOpen} className="py-2 gap-0 cursor-pointer">
        <CardContent className="rounded-lg mx-2 p-0 relative group  h-40 z-0 bg-background">
          <div className="flex justify-center items-center inset-0 absolute -z-1">
            <div
              className="p-3 rounded-xl flex items-center justify-center"
              style={{ background: `${color}18` }}
            >
              <Icon size={40} strokeWidth={1.5} style={{ color }} />
            </div>
          </div>
          <div className="p-4 py-2 absolute inset-x-0 top-0 flex items-center justify-between gap-1 z-1">
            <Button
              size={"icon"}
              variant={"secondary"}
              onClick={(e) => {
                e.stopPropagation();
                onStar(file.id);
              }}
              className={cn(
                "p-1 rounded-sm hover:bg-muted/60",
                file.starred
                  ? "text-yellow-400"
                  : "  opacity-0 group-hover:opacity-100 transition-opacity",
              )}
            >
              <IconStar fill={file.starred ? "currentColor" : "none"} />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Button
                  variant={"secondary"}
                  size={"icon"}
                  className=" rounded-full "
                >
                  <IconDots />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(file.id);
                  }}
                >
                  <IconTrash size={12} /> Delete
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <IconDownload size={12} /> Download
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          {renderPreview(file)}
        </CardContent>
        <CardFooter className="rounded-md flex-col items-start border-t-0 m-2">
          <p className="text-xs font-medium line-clamp-1 mb-0.5">{file.name}</p>
          <p className="text-[10px] text-muted-foreground">
            {file.size ? formatBytes(file.size) : "Folder"} ·{" "}
            {formatDistanceToNow(file.modified, { addSuffix: true })}
          </p>
        </CardFooter>
      </Card>
    </motion.div>
  );
}

const renderPreview = (file: FileItem) => {
  const [hasLoaded, setHasLoaded] = React.useState(false);
  switch (file.type) {
    case "image":
      return (
        <img
          src={file.url}
          alt={file.name}
          className="w-full h-full object-cover rounded z-1"
          onLoadedData={() => setHasLoaded(true)}
        />
      );
    case "video":
      return (
        <video
          src={file.url}
          className="w-full h-full object-cover rounded z-1"
          muted
          onLoadedData={() => setHasLoaded(true)}
        />
      );
  }
};
export const FileCard = React.memo(FileCardMemo);

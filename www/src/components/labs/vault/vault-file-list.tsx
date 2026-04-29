import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IconCloud, IconPlus } from "@tabler/icons-react";
import { FileRow } from "./vault-file-row";
import { AnimatePresence } from "motion/react";
import { FileCard } from "./vault-file-card";
import { FileItem } from "./vault-types";

interface VaultFileListProps {
  visibleFiles: FileItem[];
  selected: Set<string>;
  toggleSelect: (id: string) => void;
  toggleStar: (id: string) => void;
  deleteFile: (id: string) => void;
  setPreviewFile: (file: FileItem | null) => void;
  setUploadOpen: (open: boolean) => void;
  view: "list" | "grid";
}

export function VaultFileList({
  visibleFiles,
  selected,
  toggleSelect,
  toggleStar,
  deleteFile,
  setPreviewFile,
  setUploadOpen,
  view,
}: VaultFileListProps) {
  return (
    <div className="@container/main flex flex-col gap-2 flex-1 min-h-0">
      <ScrollArea className="flex-1 max-h-[90vh]">
        <div className="@container/file-list flex flex-col gap-6 p-4 md:p-6">
          {/* Files */}
          {visibleFiles.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full gap-3 text-muted-foreground">
              <IconCloud size={32} strokeWidth={1.2} />
              <p className="text-sm">
                No files here yet. Start uploading your files to see them here.
              </p>
              <Button
                size="sm"
                variant="outline"
                onClick={() => setUploadOpen(true)}
              >
                <IconPlus size={13} className="mr-1.5" /> Upload files
              </Button>
            </div>
          ) : view === "list" ? (
            <Table className="w-full">
              <TableHeader>
                <TableRow className="text-left border-b border-border/60">
                  <TableHead className="pl-4 pb-2 w-8">
                    <Checkbox
                      checked={!!selected}
                      onClick={() => {
                        // selected && setSelected(new Set())
                        visibleFiles.map((f) => toggleSelect(f.id));
                      }}
                      className="rounded mr-4 cursor-pointer"
                    />
                  </TableHead>
                  <TableHead className="pb-2 text-xs font-medium text-muted-foreground">
                    Name
                  </TableHead>
                  <TableHead className="pb-2 text-xs font-medium text-muted-foreground">
                    Size
                  </TableHead>
                  <TableHead className="pb-2 text-xs font-medium text-muted-foreground">
                    Modified
                  </TableHead>
                  <TableHead className="pb-2 pr-4 w-20"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visibleFiles.map((file) => (
                  <FileRow
                    key={file.id}
                    file={file}
                    selected={selected.has(file.id)}
                    onSelect={toggleSelect}
                    onStar={toggleStar}
                    onDelete={deleteFile}
                    onOpen={() => setPreviewFile(file)}
                  />
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className=" grid grid-cols-1 @md/file-list:grid-cols-2 @lg/file-list:grid-cols-3s @xl/file-list:grid-cols-4 gap-3">
              <AnimatePresence mode="popLayout">
                {visibleFiles.map((file) => (
                  <FileCard
                    key={file.id}
                    file={file}
                    selected={selected.has(file.id)}
                    onSelect={toggleSelect}
                    onStar={toggleStar}
                    onDelete={deleteFile}
                    onOpen={() => setPreviewFile(file)}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}

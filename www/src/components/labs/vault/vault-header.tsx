import { CommandPaletteTrigger } from "@/components/bevelui/command-palette";
import { FileUploadDropzone } from "@/components/bevelui/file-upload";
import { Button } from "@/components/ui/button";
import { ButtonGroup } from "@/components/ui/button-group";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import {
  IconChevronRight,
  IconFileUpload,
  IconFolderPlus,
  IconFolderUp,
  IconLayoutGrid,
  IconList,
  IconPlus,
} from "@tabler/icons-react";

interface VaultHeaderProps {
  breadcrumbs: { id: string; name: string }[];
  currentFolder: string | null;
  setCurrentFolder: (id: string | null) => void;
  view: "list" | "grid";
  setView: (v: "list" | "grid") => void;
}

export function VaultHeader({
  breadcrumbs,
  currentFolder,
  setCurrentFolder,
  view,
  setView,
}: VaultHeaderProps) {
  return (
    <header className="sticky top-0 z-20 flex h-(--header-height) shrink-0 items-center gap-2 border-b border-white/10 bg-background/80 backdrop-blur transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-(--header-height)">
      {/* Breadcrumb */}
      <div className="flex w-full items-center  gap-2 px-4 lg:px-6">
        <SidebarTrigger className="-ml-1" />
        <Separator
          orientation="vertical"
          className="mx-2 data-[orientation=vertical]:h-4"
        />
        <button
          onClick={() => setCurrentFolder(null)}
          className={cn(
            "hover:text-foreground transition-colors",
            currentFolder ? "text-muted-foreground" : "font-medium",
          )}
        >
          Bevel Vault
        </button>
        {breadcrumbs.map((b) => (
          <span key={b.id} className="flex items-center gap-1">
            <IconChevronRight size={12} className="text-muted-foreground" />
            <span className="font-medium">{b.name}</span>
          </span>
        ))}
        <div className="flex items-center gap-4 ml-auto">
          {/* ⌘K search */}
          <CommandPaletteTrigger
            label="Quick find"
            className="h-8 text-xs rounded-full"
          />

          {/* View toggle */}
          <ButtonGroup>
            <Button
              onClick={() => setView("list")}
              variant={"outline"}
              className={cn(view === "list" ? "bg-muted" : "hover:bg-muted/50")}
            >
              <IconList size={14} />
            </Button>
            <Button
              onClick={() => setView("grid")}
              variant={"outline"}
              className={cn(view === "grid" ? "bg-muted" : "hover:bg-muted/50")}
            >
              <IconLayoutGrid size={14} />
            </Button>
          </ButtonGroup>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button className=" px-4">
                <IconPlus size={14} />
                New
              </Button>
            </DropdownMenuTrigger>

            <DropdownMenuContent className="w-40" align="end">
              <FileUploadDropzone>
                {({ getRootProps, getInputProps }) => (
                  <DropdownMenuItem
                    {...getRootProps()}
                    onSelect={(e) => e.preventDefault()}
                    className="cursor-pointer"
                  >
                    <input {...getInputProps()} />
                    <IconFileUpload className="mr-2 h-4 w-4" />
                    <span>File upload</span>
                  </DropdownMenuItem>
                )}
              </FileUploadDropzone>
              <DropdownMenuItem>
                <IconFolderUp className="mr-2 h-4 w-4" />
                Folder upload
              </DropdownMenuItem>

              <DropdownMenuItem>
                <IconFolderPlus className="mr-2 h-4 w-4" />
                New folder
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
}

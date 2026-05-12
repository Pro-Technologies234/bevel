import * as React from "react";
import { usePalette } from "./palette-context";
import { PaletteExport } from "./palette-export";
import {
  IconPlus,
  IconTrash,
  IconCopy,
  IconEdit,
  IconDownload,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";

interface ToolbarButtonProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Button>,
  "children"
> {
  icon: React.ElementType;
  label: string;
}

function ToolbarButton({
  icon: Icon,
  label,
  variant = "ghost",
  size = "sm",
  ...props
}: ToolbarButtonProps) {
  return (
    <Button
      title={label}
      aria-label={label}
      variant={variant}
      size={size}
      {...props}
    >
      <Icon size={13} strokeWidth={1.8} className="shrink-0" />
      {label}
    </Button>
  );
}

export function PaletteToolbar() {
  const { selectedId, add, remove, duplicate, startEdit, config, colors } =
    usePalette();
  const atMax = !!(config.maxColors && colors.length >= config.maxColors);

  return (
    <div className="flex items-center gap-1 px-1 py-1 rounded-lg border border-border bg-card/80 w-fit">
      <ToolbarButton
        icon={IconPlus}
        label="Add color"
        onClick={() => add()}
        disabled={atMax}
      />
      <ToolbarButton
        icon={IconEdit}
        label="Edit"
        onClick={() => selectedId && startEdit(selectedId)}
        disabled={!selectedId}
      />
      <ToolbarButton
        icon={IconCopy}
        label="Duplicate"
        onClick={() => selectedId && duplicate(selectedId)}
        disabled={!selectedId || atMax}
      />
      <Separator orientation="vertical" />
      <ToolbarButton
        icon={IconTrash}
        label="Delete"
        onClick={() => selectedId && remove(selectedId)}
        disabled={!selectedId}
      />
      <Separator orientation="vertical" />
      <Popover>
        <PopoverTrigger>
          <ToolbarButton label="Export" icon={IconDownload} />
        </PopoverTrigger>
        <PopoverContent align="start">
          <PaletteExport />
        </PopoverContent>
      </Popover>
    </div>
  );
}

PaletteToolbar.displayName = "PaletteToolbar";

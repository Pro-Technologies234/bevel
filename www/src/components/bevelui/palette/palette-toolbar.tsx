"use client";

import * as React from "react";
import { usePalette } from "./palette-context";
import { PaletteExport } from "./palette-export";
import {
  IconPlus,
  IconTrash,
  IconCopy,
  IconEdit,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

function ToolbarButton({
  onClick, disabled, icon: Icon, label,
}: {
  onClick: () => void;
  disabled?: boolean;
  icon: React.ElementType;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      title={label}
      aria-label={label}
      className={cn(
        "flex items-center gap-1.5 px-3 py-2 rounded-md text-[11px] font-medium",
        "text-muted-foreground hover:text-foreground hover:bg-muted/60",
        "disabled:opacity-30 disabled:pointer-events-none transition-colors",
      )}
    >
      <Icon size={13} strokeWidth={1.8} />
      {label}
    </button>
  );
}

export function PaletteToolbar() {
  const { selectedId, add, remove, duplicate, startEdit, config, colors } = usePalette();
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
      <div className="w-px h-4 bg-border mx-1" />
      <ToolbarButton
        icon={IconTrash}
        label="Delete"
        onClick={() => selectedId && remove(selectedId)}
        disabled={!selectedId}
      />
      <div className="w-px h-4 bg-border mx-1" />
      <PaletteExport />
    </div>
  );
}

PaletteToolbar.displayName = "PaletteToolbar";
"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "./command-palette-context";

interface CommandPaletteTriggerProps {
  className?: string;
  label?: string;
}

export function CommandPaletteTrigger({
  className,
  label = "Search...",
}: CommandPaletteTriggerProps) {
  const { open } = useCommandPalette();

  return (
    <button
      onClick={open}
      className={cn(
        "flex items-center gap-2 h-9 px-3 rounded-lg",
        "border border-border bg-muted/40 hover:bg-muted/70",
        "text-sm text-muted-foreground transition-colors",
        className
      )}
    >
      <IconSearch size={14} strokeWidth={1.8} />
      <span className="flex-1 text-left">{label}</span>
      <kbd className="text-[10px] bg-background border border-border/60 rounded px-1.5 py-0.5 ml-4">
        ⌘K
      </kbd>
    </button>
  );
}

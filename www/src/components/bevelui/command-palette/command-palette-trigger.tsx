"use client";

import * as React from "react";
import { Button } from "@/components/ui/button";
import { IconSearch } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useCommandPalette } from "./command-palette-context";
import { Kbd, KbdGroup } from "@/components/ui/kbd";

interface CommandPaletteTriggerProps {
  className?: string;
  label?: string;
  hideAddon?: boolean;
}

export function CommandPaletteTrigger({
  className,
  label = "Search...",
  hideAddon,
}: CommandPaletteTriggerProps) {
  const { open } = useCommandPalette();

  return (
    <Button
      onClick={open}
      variant={"outline"}
      className={cn(
        "flex items-center gap-2 h-8 px-3 rounded-lg text-xs",
        hideAddon && "w-8!",
        className,
      )}
    >
      <IconSearch size={14} strokeWidth={1.8} />
      {!hideAddon && (
        <>
          <span className="flex-1 text-left">{label}</span>
          <KbdGroup>
            <Kbd>⌘</Kbd>
            <Kbd>K</Kbd>
          </KbdGroup>
        </>
      )}
    </Button>
  );
}

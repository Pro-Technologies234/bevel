"use client";

import * as React from "react";
import { IconSettings } from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { useCommandPalette } from "./command-palette-context";
import { Kbd } from "@/components/ui/kbd";

function Shortcut({ keys, label }: { keys: string[]; label: string }) {
  return (
    <div className="flex items-center gap-1 text-muted-foreground">
      <div className="flex items-center gap-0.5">
        {keys.map((k, i) => (
          <Kbd
            key={i}
            className="inline-flex items-center justify-center text-[10px] font-medium bg-muted border border-border/60 rounded px-1 min-w-[18px] h-4"
          >
            {k}
          </Kbd>
        ))}
      </div>
      <span className="text-[11px]">{label}</span>
    </div>
  );
}

interface CommandPaletteFooterProps {
  onSettings?: () => void;
}

export function CommandPaletteFooter({ onSettings }: CommandPaletteFooterProps) {
  return (
    <div className="flex items-center gap-3 px-3 py-2 border-t border-border/60 bg-muted/20">
      <div className="flex items-center gap-3 flex-1 min-w-0 overflow-x-auto no-scrollbar">
        <Shortcut keys={["↑", "↓"]} label="Select" />
        <Shortcut keys={["↵"]} label="Open" />
        <Shortcut keys={["⌘", "R"]} label="Open in new tab" />
        <Shortcut keys={["⌘", "L"]} label="Copy link" />
        <Shortcut keys={["Esc"]} label="Close" />
      </div>

      <button
        onClick={onSettings}
        className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
        aria-label="Settings"
      >
        <IconSettings size={15} strokeWidth={1.6} />
      </button>
    </div>
  );
}

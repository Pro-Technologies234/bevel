"use client";

import * as React from "react";
import { TreeRoot, type TreeNodeType } from "@/components/bevelui/tree";
import {
  IconFolderFilled,
  IconFolderOpen,
  IconFileCode,
  IconFileText,
  IconBraces,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

const FILE_TREE: TreeNodeType[] = [
  {
    id: "bevelui",
    label: "components/bevelui",
    icon: IconFolderFilled,
    defaultExpanded: true,
    children: [
      {
        id: "tour",
        label: "tour",
        icon: IconFolderFilled,
        defaultExpanded: true,
        children: [
          { id: "tour-root", label: "tour-root.tsx", icon: IconFileCode },
          { id: "tour-anchor", label: "tour-anchor.tsx", icon: IconFileCode },
          { id: "tour-card", label: "tour-card.tsx", icon: IconFileCode },
          { id: "tour-index", label: "index.ts", icon: IconBraces },
        ],
      },
      {
        id: "command-palette",
        label: "command-palette",
        icon: IconFolderFilled,
        children: [
          {
            id: "cp-root",
            label: "command-palette-root.tsx",
            icon: IconFileCode,
          },
          {
            id: "cp-modal",
            label: "command-palette-modal.tsx",
            icon: IconFileCode,
          },
          { id: "cp-fuzzy", label: "fuzzy.ts", icon: IconBraces },
          { id: "cp-index", label: "index.ts", icon: IconBraces },
        ],
      },
      {
        id: "form-engine",
        label: "form-engine",
        icon: IconFolderFilled,
        children: [
          { id: "fe-root", label: "form-engine-root.tsx", icon: IconFileCode },
          { id: "fe-step", label: "form-engine-step.tsx", icon: IconFileCode },
          {
            id: "fe-field",
            label: "form-engine-field.tsx",
            icon: IconFileCode,
          },
          { id: "fe-index", label: "index.ts", icon: IconBraces },
        ],
      },
      {
        id: "ai-chat",
        label: "ai-chat",
        icon: IconFolderFilled,
        children: [
          { id: "ai-root", label: "ai-chat-root.tsx", icon: IconFileCode },
          {
            id: "ai-message",
            label: "ai-chat-message.tsx",
            icon: IconFileCode,
          },
          { id: "ai-input", label: "ai-chat-input.tsx", icon: IconFileCode },
          { id: "ai-index", label: "index.ts", icon: IconBraces },
        ],
      },
    ],
  },
  {
    id: "ui",
    label: "components/ui",
    icon: IconFolderFilled,
    children: [
      { id: "ui-button", label: "button.tsx", icon: IconFileCode },
      { id: "ui-input", label: "input.tsx", icon: IconFileCode },
      { id: "ui-select", label: "select.tsx", icon: IconFileCode },
    ],
  },
  {
    id: "lib",
    label: "lib",
    icon: IconFolderFilled,
    children: [
      { id: "lib-utils", label: "utils.ts", icon: IconBraces },
      { id: "lib-metadata", label: "metadata.ts", icon: IconBraces },
    ],
  },
];

export function TreeViewDemo() {
  const [selected, setSelected] = React.useState<string[]>([]);

  return (
    <div className="flex gap-4 w-full max-w-2xl items-start">
      {/* Tree panel */}
      <div className="w-64 shrink-0 bg-background rounded-md p-4">
        <div className="px-3 py-2 border-b border-border/40 mb-1">
          <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/40">
            Explorer
          </span>
        </div>
        <TreeRoot
          nodes={FILE_TREE}
          config={{ multiSelect: true, showLines: true }}
          onSelect={(ids) => setSelected(ids)}
          className="p-1"
        />
      </div>

      {/* Info panel */}
      <div className="flex-1 flex flex-col gap-3">
        <div className="p-4 rounded-md bg-background border border-border ">
          <p className="text-xs uppercase text-muted-foreground font-mono  mb-2">
            Selected
          </p>
          {selected.length === 0 ? (
            <p className="text-[12px] text-muted-foreground/40">
              Click a file or folder. Hold ⌘ or Ctrl to multi-select.
            </p>
          ) : (
            <div className="flex flex-col gap-1">
              {selected.map((id) => (
                <span
                  key={id}
                  className="text-[12px] font-mono text-primary/70"
                >
                  {id}
                </span>
              ))}
            </div>
          )}
        </div>

        <div className="p-4 rounded-md bg-background border border-border ">
          <p className="text-xs uppercase text-muted-foreground font-mono  mb-2">
            Keyboard nav
          </p>
          <div className="grid grid-cols-2 gap-x-4 gap-y-1">
            {[
              ["↑ ↓", "Navigate"],
              ["→", "Expand / child"],
              ["←", "Collapse / parent"],
              ["Enter", "Select"],
              ["Home / End", "First / last"],
              ["⌘ + Click", "Multi-select"],
            ].map(([key, label]) => (
              <div key={key} className="flex items-center gap-2">
                <kbd className="text-[9px] font-mono px-1 py-0.5 rounded border border-border bg-muted/40 text-muted-foreground/50 whitespace-nowrap">
                  {key}
                </kbd>
                <span className="text-[11px] text-muted-foreground/50">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

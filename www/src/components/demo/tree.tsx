"use client";

import * as React from "react";
import { TreeRoot, type TreeNodeType } from "@/components/bevelui/tree";
import {
  IconFolderFilled,
  IconFileCode,
  IconBraces,
  IconFileText,
  IconChevronRight,
  IconLayoutSidebar,
  IconX,
  IconCircleFilled,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";

// ─── File tree ─────────────────────────────────────────────────────────────────

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
          { id: "tour-root",   label: "tour-root.tsx",   icon: IconFileCode },
          { id: "tour-anchor", label: "tour-anchor.tsx", icon: IconFileCode },
          { id: "tour-card",   label: "tour-card.tsx",   icon: IconFileCode },
          { id: "tour-index",  label: "index.ts",        icon: IconBraces   },
        ],
      },
      {
        id: "command-palette",
        label: "command-palette",
        icon: IconFolderFilled,
        children: [
          { id: "cp-root",  label: "command-palette-root.tsx",  icon: IconFileCode },
          { id: "cp-modal", label: "command-palette-modal.tsx", icon: IconFileCode },
          { id: "cp-fuzzy", label: "fuzzy.ts",                  icon: IconBraces   },
          { id: "cp-index", label: "index.ts",                  icon: IconBraces   },
        ],
      },
      {
        id: "form-engine",
        label: "form-engine",
        icon: IconFolderFilled,
        children: [
          { id: "fe-root",  label: "form-engine-root.tsx",  icon: IconFileCode },
          { id: "fe-step",  label: "form-engine-step.tsx",  icon: IconFileCode },
          { id: "fe-field", label: "form-engine-field.tsx", icon: IconFileCode },
          { id: "fe-index", label: "index.ts",              icon: IconBraces   },
        ],
      },
      {
        id: "kanban",
        label: "kanban",
        icon: IconFolderFilled,
        children: [
          { id: "kb-root",  label: "kanban-root.tsx",   icon: IconFileCode },
          { id: "kb-board", label: "kanban-board.tsx",  icon: IconFileCode },
          { id: "kb-card",  label: "kanban-card.tsx",   icon: IconFileCode },
          { id: "kb-index", label: "index.ts",          icon: IconBraces   },
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
      { id: "ui-input",  label: "input.tsx",  icon: IconFileCode },
      { id: "ui-select", label: "select.tsx", icon: IconFileCode },
    ],
  },
  {
    id: "lib",
    label: "lib",
    icon: IconFolderFilled,
    children: [
      { id: "lib-utils",    label: "utils.ts",    icon: IconBraces },
      { id: "lib-metadata", label: "metadata.ts", icon: IconBraces },
    ],
  },
  {
    id: "content",
    label: "content/docs",
    icon: IconFolderFilled,
    children: [
      { id: "doc-tour",     label: "product-tour.json",   icon: IconFileText },
      { id: "doc-kanban",   label: "kanban.json",         icon: IconFileText },
      { id: "doc-gallery",  label: "gallery.json",        icon: IconFileText },
      { id: "doc-manifest", label: "manifest.ts",         icon: IconBraces   },
    ],
  },
];

// ─── Fake file content preview ─────────────────────────────────────────────────

const FILE_PREVIEWS: Record<string, { lang: string; content: string }> = {
  "tour-root": {
    lang: "tsx",
    content: `export function TourRoot({ steps, children, defaultOpen }) {
  const [step, setStep] = useState(0);
  const [open, setOpen] = useState(defaultOpen);

  return (
    <TourCtx.Provider value={{ step, setStep, open, setOpen, steps }}>
      {children}
    </TourCtx.Provider>
  );
}`,
  },
  "cp-fuzzy": {
    lang: "ts",
    content: `/** Levenshtein-based fuzzy match, returns 0–1 score */
export function fuzzyScore(query: string, target: string): number {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = target.toLowerCase();
  if (t.includes(q)) return 1 - q.length / t.length * 0.1;
  // ... levenshtein distance
  return 0;
}`,
  },
  "fe-field": {
    lang: "tsx",
    content: `export function FormEngineField({ field, value, onChange }) {
  switch (field.variant) {
    case "text":     return <input value={value} onChange={e => onChange(e.target.value)} />;
    case "email":    return <input type="email" value={value} onChange={...} />;
    case "password": return <PasswordField value={value} onChange={onChange} />;
    case "custom":   return field.render({ value, onChange });
    default:         return null;
  }
}`,
  },
};

// ─── Demo ──────────────────────────────────────────────────────────────────────

export function TreeDemo() {
  const [selected, setSelected] = React.useState<string[]>([]);
  const [openTabs, setOpenTabs] = React.useState<string[]>([]);
  const [activeTab, setActiveTab] = React.useState<string | null>(null);
  const [sidebarOpen, setSidebarOpen] = React.useState(true);

  function handleSelect(ids: string[]) {
    setSelected(ids);
    const id = ids[ids.length - 1];
    if (!id) return;
    // Only open files, not folders
    const hasPreview = FILE_PREVIEWS[id];
    const isFile = id.includes("-") || hasPreview;
    if (isFile) {
      if (!openTabs.includes(id)) setOpenTabs((t) => [...t, id]);
      setActiveTab(id);
    }
  }

  function closeTab(id: string, e: React.MouseEvent) {
    e.stopPropagation();
    const next = openTabs.filter((t) => t !== id);
    setOpenTabs(next);
    if (activeTab === id) setActiveTab(next[next.length - 1] ?? null);
  }

  const preview = activeTab ? FILE_PREVIEWS[activeTab] : null;

  // Resolve filename for a node id
  function labelFor(id: string): string {
    function search(nodes: TreeNodeType[]): string | null {
      for (const n of nodes) {
        if (n.id === id) return n.label;
        if (n.children) { const r = search(n.children); if (r) return r; }
      }
      return null;
    }
    return search(FILE_TREE) ?? id;
  }

  return (
    <div className="w-full max-w-3xl flex flex-col rounded-xl border border-border overflow-hidden bg-[#0d0d0d]">
      {/* IDE title bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border/60 bg-muted/10">
        <div className="flex gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/70" />
          <div className="w-3 h-3 rounded-full bg-yellow-500/70" />
          <div className="w-3 h-3 rounded-full bg-green-500/70" />
        </div>
        <span className="flex-1 text-center text-[11px] text-muted-foreground/50 font-mono">
          bevel-ui — Explorer
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="w-6 h-6 text-muted-foreground/40 hover:text-foreground"
          onClick={() => setSidebarOpen((v) => !v)}
          title="Toggle sidebar"
        >
          <IconLayoutSidebar size={13} />
        </Button>
      </div>

      <div className="flex flex-1 min-h-0 h-[420px]">
        {/* Sidebar */}
        {sidebarOpen && (
          <div className="w-56 shrink-0 flex flex-col border-r border-border/60 bg-[#111]">
            <div className="px-3 py-2 border-b border-border/40">
              <span className="text-[9px] font-mono uppercase tracking-widest text-muted-foreground/40">
                Explorer
              </span>
            </div>
            <div className="flex-1 overflow-y-auto p-1">
              <TreeRoot
                nodes={FILE_TREE}
                config={{ multiSelect: true, showLines: true }}
                onSelect={handleSelect}
                className="p-1"
              />
            </div>

            {/* Keyboard hints */}
            <div className="px-3 py-2 border-t border-border/40 grid grid-cols-2 gap-x-2 gap-y-0.5">
              {[["↑ ↓", "Navigate"], ["→ ←", "Expand"], ["Enter", "Open"], ["⌘+click", "Multi"]].map(([k, l]) => (
                <div key={k} className="flex items-center gap-1">
                  <kbd className="text-[8px] font-mono px-1 rounded border border-border bg-muted/20 text-muted-foreground/50 whitespace-nowrap">{k}</kbd>
                  <span className="text-[9px] text-muted-foreground/40">{l}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Editor area */}
        <div className="flex-1 flex flex-col min-w-0">
          {/* Tab bar */}
          {openTabs.length > 0 && (
            <div className="flex items-center border-b border-border/60 bg-[#0d0d0d] overflow-x-auto shrink-0">
              {openTabs.map((id) => (
                <button
                  key={id}
                  onClick={() => setActiveTab(id)}
                  className={cn(
                    "flex items-center gap-2 px-3 py-1.5 text-[11px] font-mono border-r border-border/40 shrink-0 transition-colors",
                    activeTab === id
                      ? "bg-[#1a1a1a] text-foreground border-t border-t-primary"
                      : "text-muted-foreground/50 hover:text-muted-foreground hover:bg-[#141414]"
                  )}
                >
                  <IconCircleFilled size={6} className={cn("shrink-0", activeTab === id ? "text-primary" : "text-muted-foreground/20")} />
                  {labelFor(id)}
                  <span
                    onClick={(e) => closeTab(id, e)}
                    className="w-4 h-4 rounded flex items-center justify-center opacity-0 hover:opacity-100 hover:bg-muted/50 transition-opacity"
                  >
                    <IconX size={9} />
                  </span>
                </button>
              ))}
            </div>
          )}

          {/* Content */}
          <div className="flex-1 overflow-auto p-4">
            {!activeTab ? (
              <div className="h-full flex flex-col items-center justify-center gap-2 text-center">
                <IconFileCode size={32} className="text-muted-foreground/20" />
                <p className="text-[12px] text-muted-foreground/30 font-mono">
                  Click a file in the explorer to preview it
                </p>
              </div>
            ) : preview ? (
              <pre className="text-[11px] font-mono text-muted-foreground/80 leading-relaxed whitespace-pre-wrap">
                <span className="text-muted-foreground/30 mr-2 select-none">
                  {/* language badge */}
                  <span className="text-[9px] uppercase tracking-widest border border-border/40 rounded px-1 py-0.5 mr-2">{preview.lang}</span>
                </span>
                {preview.content}
              </pre>
            ) : (
              <div className="flex flex-col items-center justify-center h-full gap-2">
                <p className="text-[12px] text-muted-foreground/30 font-mono">
                  {labelFor(activeTab)}
                </p>
                <p className="text-[10px] text-muted-foreground/20 font-mono">No preview available</p>
              </div>
            )}
          </div>

          {/* Status bar */}
          <div className="flex items-center gap-3 px-3 py-1 border-t border-border/40 bg-primary/5">
            <span className="text-[9px] font-mono text-primary/60">
              {selected.length} selected
            </span>
            {activeTab && (
              <>
                <span className="text-muted-foreground/20">·</span>
                <span className="text-[9px] font-mono text-muted-foreground/30">{labelFor(activeTab)}</span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

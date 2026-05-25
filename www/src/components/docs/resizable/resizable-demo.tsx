"use client";

import * as React from "react";
import {
  ResizableRoot,
  ResizablePanel,
  ResizableHandle,
} from "@/components/bevelui/resizable";
import { cn } from "@/lib/utils";
import {
  IconChevronRight,
  IconFile,
  IconFolder,
  IconFolderOpen,
  IconBrandTypescript,
  IconBrandCss3,
  IconX,
} from "@tabler/icons-react";

// ─── Fake file tree ────────────────────────────────────────────────────────────

const TREE = [
  {
    name: "src",
    type: "folder",
    open: true,
    children: [
      {
        name: "components",
        type: "folder",
        open: true,
        children: [
          { name: "button.tsx", type: "tsx" },
          { name: "input.tsx", type: "tsx" },
          { name: "layout.tsx", type: "tsx", active: true },
        ],
      },
      { name: "app.tsx", type: "tsx" },
      { name: "index.css", type: "css" },
    ],
  },
  { name: "package.json", type: "json" },
  { name: "tsconfig.json", type: "json" },
];

type TreeNode = {
  name: string;
  type: string;
  open?: boolean;
  active?: boolean;
  children?: TreeNode[];
};

function TreeItem({ node, depth = 0 }: { node: TreeNode; depth?: number }) {
  const [open, setOpen] = React.useState(node.open ?? false);
  const isFolder = node.type === "folder";

  const Icon = isFolder
    ? open
      ? IconFolderOpen
      : IconFolder
    : node.type === "tsx"
      ? IconBrandTypescript
      : node.type === "css"
        ? IconBrandCss3
        : IconFile;

  return (
    <div>
      <button
        type="button"
        onClick={() => isFolder && setOpen((p) => !p)}
        className={cn(
          "flex items-center gap-1.5 w-full px-2 py-0.5 rounded-sm text-[11px] transition-colors text-left",
          node.active
            ? "bg-primary/10 text-primary"
            : "text-muted-foreground/70 hover:text-foreground hover:bg-muted/40",
          !isFolder && "cursor-pointer",
        )}
        style={{ paddingLeft: `${8 + depth * 12}px` }}
      >
        {isFolder && (
          <IconChevronRight
            size={10}
            className={cn(
              "transition-transform flex-shrink-0",
              open && "rotate-90",
            )}
          />
        )}
        <Icon
          size={12}
          strokeWidth={1.8}
          className={cn(
            "flex-shrink-0",
            node.type === "tsx" && "text-blue-400",
            node.type === "css" && "text-orange-400",
            isFolder && "text-yellow-400/80",
          )}
        />
        <span className="truncate">{node.name}</span>
      </button>
      {isFolder &&
        open &&
        node.children?.map((child) => (
          <TreeItem key={child.name} node={child} depth={depth + 1} />
        ))}
    </div>
  );
}

// ─── Fake editor ───────────────────────────────────────────────────────────────

const CODE = `import * as React from "react";
import { ResizableRoot, ResizablePanel, ResizableHandle } from "@/components/bevelui/resizable";

export function AppLayout() {
  return (
    <ResizableRoot
      defaultSizes={[20, 55, 25]}
      direction="horizontal"
      panelConfigs={[
        { minSize: 12, maxSize: 35, collapsible: true },
        { minSize: 30 },
        { minSize: 15, maxSize: 40 },
      ]}
      className="h-screen"
    >
      <ResizablePanel index={0}>
        <Sidebar />
      </ResizablePanel>
      <ResizableHandle index={0} />
      <ResizablePanel index={1}>
        <Editor />
      </ResizablePanel>
      <ResizableHandle index={1} />
      <ResizablePanel index={2}>
        <Inspector />
      </ResizablePanel>
    </ResizableRoot>
  );
}`.split("\n");

function EditorLine({ num, text }: { num: number; text: string }) {
  // Very basic syntax colouring
  const colored = text.replace(
    /(\/\/.*)|("[^"]*")|(import|export|from|return|const|function)\b/g,
    (match, comment, string, keyword) => {
      if (comment) return `<span style="color:#6b7280">${match}</span>`;
      if (string) return `<span style="color:#f97316">${match}</span>`;
      if (keyword) return `<span style="color:#f97583">${match}</span>`;
      return match;
    },
  );
  return (
    <div className="flex">
      <span className="w-8 text-right flex-shrink-0 text-muted-foreground/30 select-none text-[11px] mr-4">
        {num}
      </span>
      <span
        className="text-[11px] font-mono text-foreground/80 whitespace-pre"
        dangerouslySetInnerHTML={{ __html: colored || "&nbsp;" }}
      />
    </div>
  );
}

// ─── Inspector panel ───────────────────────────────────────────────────────────

const PROPS = [
  { name: "defaultSizes", type: "number[]", value: "[20, 55, 25]" },
  { name: "direction", type: "string", value: '"horizontal"' },
  { name: "minSize", type: "number", value: "12" },
  { name: "collapsible", type: "boolean", value: "true" },
];

// ─── Demo ──────────────────────────────────────────────────────────────────────

export function ResizableDemo() {
  return (
    <div
      className="w-full rounded-xl  border border-border overflow-hidden bg-[#0c0c0c]"
      style={{ height: 480 }}
    >
      <ResizableRoot
        defaultSizes={[22, 53, 25]}
        direction="horizontal"
        panelConfigs={[
          { minSize: 12, maxSize: 38, collapsible: true },
          { minSize: 25 },
          { minSize: 14, maxSize: 40 },
        ]}
        className="h-full"
      >
        {/* Sidebar */}
        <ResizablePanel index={0}>
          <div className="h-full flex flex-col bg-[#0a0a0a] border-x border-border">
            <div className="flex items-center justify-between px-3 py-2 border-b border-border/40">
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                Explorer
              </span>
              <IconX
                size={11}
                className="text-muted-foreground/30 cursor-pointer hover:text-muted-foreground"
              />
            </div>
            <div className="flex-1 overflow-auto space-y-1 p-1">
              {TREE.map((node) => (
                <TreeItem key={node.name} node={node} />
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle index={0} />

        {/* Editor */}
        <ResizablePanel index={1}>
          <div className="h-full flex flex-col">
            {/* Tab bar */}
            <div className="flex items-center border-b border-border/40 bg-[#0a0a0a] px-1">
              {["layout.tsx", "button.tsx"].map((tab, i) => (
                <div
                  key={tab}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 text-[11px] border-r border-border/30",
                    i === 0
                      ? "text-foreground border-t border-t-primary bg-[#0c0c0c]"
                      : "text-muted-foreground/50",
                  )}
                >
                  <IconBrandTypescript size={11} className="text-blue-400" />
                  {tab}
                </div>
              ))}
            </div>
            {/* Code */}
            <div className="flex-1 overflow-auto p-3">
              {CODE.map((line, i) => (
                <EditorLine key={i} num={i + 1} text={line} />
              ))}
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle index={1} />

        {/* Inspector */}
        <ResizablePanel index={3}>
          <div className="h-full flex flex-col bg-[#0a0a0a] pr-2">
            <div className="px-3 py-2 border-b border-border/40">
              <span className="text-[10px] font-medium text-muted-foreground/60 uppercase tracking-wider">
                Properties
              </span>
            </div>
            <div className="flex-1 overflow-auto p-3 flex flex-col gap-2">
              {PROPS.map((p) => (
                <div key={p.name} className="flex flex-col gap-0.5">
                  <span className="text-[9px] font-mono text-muted-foreground/40 uppercase">
                    {p.name}
                    <span className="ml-1 text-primary/50">{p.type}</span>
                  </span>
                  <div className="h-7 px-2 rounded-md bg-muted/30 border border-border/40 flex items-center">
                    <span className="text-[11px] font-mono text-orange-400/80">
                      {p.value}
                    </span>
                  </div>
                </div>
              ))}
              <div className="mt-2 pt-2 border-t border-border/40">
                <p className="text-[9px] text-muted-foreground/30 font-mono">
                  Drag handles to resize.
                  <br />
                  Panels respect min/max constraints.
                </p>
              </div>
            </div>
          </div>
        </ResizablePanel>
      </ResizableRoot>
    </div>
  );
}

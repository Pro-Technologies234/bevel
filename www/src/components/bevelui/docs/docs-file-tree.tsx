import * as React from "react";
import { cn } from "@/lib/utils";
import { IconFolder, IconFolderOpen, IconFile } from "@tabler/icons-react";

export type DocsFileTreeNode = {
  name: string;
  type: "file" | "folder";
  highlight?: boolean;
  comment?: string;
  children?: DocsFileTreeNode[];
};

interface NodeProps {
  node: DocsFileTreeNode;
  depth: number;
  isLast: boolean;
}

function TreeNode({ node, depth, isLast }: NodeProps) {
  const [open, setOpen] = React.useState(true);
  const isFolder = node.type === "folder";
  const FolderIcon = open ? IconFolderOpen : IconFolder;

  return (
    <div>
      <button
        onClick={isFolder ? () => setOpen((p) => !p) : undefined}
        className={cn(
          "flex items-center gap-2 w-full text-left py-0.5 px-2 rounded-md text-[12px] font-mono transition-colors",
          "hover:bg-muted/40",
          node.highlight
            ? "text-primary bg-primary/5"
            : "text-foreground/80",
          !isFolder && "cursor-default",
        )}
        style={{ paddingLeft: `${8 + depth * 16}px` }}
      >
        {isFolder ? (
          <FolderIcon size={13} strokeWidth={1.6} className="text-primary/70 shrink-0" />
        ) : (
          <IconFile size={13} strokeWidth={1.6} className="text-muted-foreground/60 shrink-0" />
        )}
        <span>{node.name}</span>
        {node.comment && (
          <span className="text-muted-foreground/40 text-[11px] ms-2 font-normal">
            {node.comment}
          </span>
        )}
      </button>

      {isFolder && open && node.children && (
        <div>
          {node.children.map((child, i) => (
            <TreeNode
              key={child.name}
              node={child}
              depth={depth + 1}
              isLast={i === (node.children?.length ?? 0) - 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export interface DocsFileTreeProps {
  nodes: DocsFileTreeNode[];
  className?: string;
}

export function DocsFileTree({ nodes, className }: DocsFileTreeProps) {
  return (
    <div
      className={cn(
        "rounded-xl border border-border bg-muted/20 py-3 overflow-hidden",
        className,
      )}
    >
      {nodes.map((node, i) => (
        <TreeNode
          key={node.name}
          node={node}
          depth={0}
          isLast={i === nodes.length - 1}
        />
      ))}
    </div>
  );
}

DocsFileTree.displayName = "DocsFileTree";

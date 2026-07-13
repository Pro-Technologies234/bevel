import * as React from "react";
import { TreeCtx } from "./tree-context";
import { TreeNode as TreeNodeComponent } from "./tree-node";
import {
  getAllIds,
  getVisibleIds,
  getAncestorIds,
  getParentId,
  getFirstChildId,
} from "./tree-utils";
import { cn } from "@/lib/utils";
import type { TreeNode, TreeConfig, TreeContextValue } from "./types";

export interface TreeRootProps<T = unknown> {
  nodes: TreeNode<T>[];
  config?: TreeConfig;
  onSelect?: (ids: string[], nodes: TreeNode<T>[]) => void;
  className?: string;
}

export function TreeRoot<T = unknown>({
  nodes,
  config = {},
  onSelect,
  className,
}: TreeRootProps<T>) {
  const allIds = React.useMemo(() => getAllIds(nodes), [nodes]);

  const [expanded, setExpanded] = React.useState<Set<string>>(() => {
    if (config.defaultExpandAll) return new Set(allIds);
    const ids = new Set<string>(config.defaultExpanded ?? []);
    function addDefaults(ns: TreeNode<T>[]) {
      for (const n of ns) {
        if (n.defaultExpanded) ids.add(n.id);
        if (n.children) addDefaults(n.children);
      }
    }
    addDefaults(nodes);
    return ids;
  });

  const [selected, setSelected] = React.useState<Set<string>>(
    new Set(config.defaultSelected ?? []),
  );
  const [focused, setFocused] = React.useState<string | null>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

  function handleKeyDown(e: React.KeyboardEvent) {
    if (!focused) return;
    const visible = getVisibleIds(nodes, expanded);
    const idx = visible.indexOf(focused);

    switch (e.key) {
      case "ArrowDown": {
        e.preventDefault();
        const next = visible[idx + 1];
        if (next) setFocused(next);
        break;
      }
      case "ArrowUp": {
        e.preventDefault();
        const prev = visible[idx - 1];
        if (prev) setFocused(prev);
        break;
      }
      case "ArrowRight": {
        e.preventDefault();
        if (expanded.has(focused)) {
          const child = getFirstChildId(nodes, focused);
          if (child) setFocused(child);
        } else {
          const node = visible.find((id) => id === focused);
          if (node) expand(focused);
        }
        break;
      }
      case "ArrowLeft": {
        e.preventDefault();
        if (expanded.has(focused)) {
          collapse(focused);
        } else {
          const parent = getParentId(nodes as TreeNode[], focused);
          if (parent) setFocused(parent);
        }
        break;
      }
      case "Enter":
      case " ": {
        e.preventDefault();
        select(focused, e.shiftKey || e.metaKey || e.ctrlKey);
        break;
      }
      case "Home": {
        e.preventDefault();
        setFocused(visible[0] ?? null);
        break;
      }
      case "End": {
        e.preventDefault();
        setFocused(visible[visible.length - 1] ?? null);
        break;
      }
    }
  }

  function expand(id: string) {
    setExpanded((p) => new Set([...p, id]));
  }
  function collapse(id: string) {
    setExpanded((p) => {
      const n = new Set(p);
      n.delete(id);
      return n;
    });
  }
  function toggleExpand(id: string) {
    expanded.has(id) ? collapse(id) : expand(id);
  }
  function expandAll() {
    setExpanded(new Set(allIds));
  }
  function collapseAll() {
    setExpanded(new Set());
  }

  function expandTo(id: string) {
    const ancestors = getAncestorIds(nodes as TreeNode[], id) ?? [];
    setExpanded((p) => new Set([...p, ...ancestors]));
  }

  function select(id: string, additive = false) {
    let next: Set<string>;
    if (additive && config.multiSelect) {
      next = new Set(selected);
      selected.has(id) ? next.delete(id) : next.add(id);
    } else {
      next = new Set([id]);
    }
    setSelected(next);
    onSelect?.(
      [...next],
      [...next].map((nid) => {
        const n = getAllIds(nodes);
        return { id: nid, label: nid } as TreeNode<T>;
      }),
    );
  }

  const ctx: TreeContextValue<T> = {
    nodes: nodes as TreeNode<T>[],
    expanded,
    selected,
    focused,
    config,
    expand,
    collapse,
    toggleExpand,
    select,
    focus: setFocused,
    expandAll,
    collapseAll,
    expandTo,
  };

  return (
    <TreeCtx.Provider value={ctx as TreeContextValue}>
      <div
        ref={containerRef}
        role="tree"
        tabIndex={0}
        onKeyDown={handleKeyDown}
        onFocus={() => {
          if (!focused && nodes[0]) setFocused(nodes[0].id);
        }}
        className={cn("outline-none select-none", className)}
      >
        {nodes.map((node, i) => (
          <TreeNodeComponent
            key={node.id}
            node={node as TreeNode}
            depth={0}
            isLast={i === nodes.length - 1}
          />
        ))}
      </div>
    </TreeCtx.Provider>
  );
}

TreeRoot.displayName = "TreeRoot";

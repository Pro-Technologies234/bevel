import * as React from "react";
import { motion, AnimatePresence } from "motion/react";
import { useTree } from "./tree-context";
import { IconChevronRight, IconFile } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import type { TreeNode } from "./types";

const INDENT = 16;

export function TreeNode({
  node,
  depth,
  isLast,
}: {
  node: TreeNode;
  depth: number;
  isLast: boolean;
}) {
  const { expanded, selected, focused, toggleExpand, select, focus, config } =
    useTree();

  const isExpanded = expanded.has(node.id);
  const isSelected = selected.has(node.id);
  const isFocused = focused === node.id;
  const hasChildren = !!node.children?.length;
  const Icon = node.icon ?? (hasChildren ? null : IconFile);

  function handleClick(e: React.MouseEvent) {
    if (node.disabled) return;
    focus(node.id);
    select(node.id, e.metaKey || e.ctrlKey || e.shiftKey);
    if (hasChildren) toggleExpand(node.id);
  }

  function handleChevron(e: React.MouseEvent) {
    e.stopPropagation();
    toggleExpand(node.id);
  }

  return (
    <div>
      <div
        role="treeitem"
        aria-expanded={hasChildren ? isExpanded : undefined}
        aria-selected={isSelected}
        aria-disabled={node.disabled}
        onClick={handleClick}
        style={{ paddingLeft: depth * INDENT }}
        className={cn(
          "flex items-center gap-1.5 py-[3px] pr-3 rounded-sm cursor-pointer transition-colors group relative",
          isSelected && "bg-primary/10",
          isFocused && !isSelected && "bg-muted/50",
          !isSelected && !isFocused && "hover:bg-muted/40",
          node.disabled && "opacity-40 cursor-not-allowed",
        )}
      >
        {config.showLines && depth > 0 && (
          <span
            className="absolute left-0 top-0 bottom-0 border-l border-border/30"
            style={{ left: (depth - 1) * INDENT + 8 }}
          />
        )}

        <span className="w-4 h-4 flex items-center justify-center shrink-0">
          {hasChildren ? (
            <button
              type="button"
              onClick={handleChevron}
              className="w-4 h-4 flex items-center justify-center"
            >
              <IconChevronRight
                size={12}
                strokeWidth={2}
                className={cn(
                  "text-muted-foreground/40 transition-transform",
                  isExpanded && "rotate-90",
                )}
              />
            </button>
          ) : null}
        </span>

        {Icon && (
          <Icon
            size={14}
            strokeWidth={1.8}
            className={cn(
              "shrink-0 transition-colors",
              isSelected ? "text-primary/70" : "text-muted-foreground/50",
            )}
          />
        )}

        <span
          className={cn(
            "text-[13px] truncate flex-1 transition-colors",
            isSelected
              ? "text-primary font-medium"
              : isFocused
                ? "text-foreground"
                : "text-foreground/80",
          )}
        >
          {node.label}
        </span>
      </div>

      <AnimatePresence initial={false}>
        {hasChildren && isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className=" space-y-0.5"
          >
            {node.children!.map((child, i) => (
              <TreeNode
                key={child.id}
                node={child}
                depth={depth + 1}
                isLast={i === node.children!.length - 1}
              />
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

TreeNode.displayName = "TreeNode";

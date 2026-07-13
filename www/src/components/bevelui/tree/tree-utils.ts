import type { TreeNode } from "./types";

/** Returns all node ids in the tree */
export function getAllIds(nodes: TreeNode[]): string[] {
  return nodes.flatMap((n) => [
    n.id,
    ...(n.children ? getAllIds(n.children) : []),
  ]);
}

/** Returns flat list of visible node ids (respecting collapsed state) */
export function getVisibleIds(
  nodes: TreeNode[],
  expanded: Set<string>,
): string[] {
  const result: string[] = [];
  function walk(ns: TreeNode[]) {
    for (const n of ns) {
      result.push(n.id);
      if (n.children?.length && expanded.has(n.id)) walk(n.children);
    }
  }
  walk(nodes);
  return result;
}

/** Find a node by id */
export function findNode(nodes: TreeNode[], id: string): TreeNode | null {
  for (const n of nodes) {
    if (n.id === id) return n;
    if (n.children) {
      const found = findNode(n.children, id);
      if (found) return found;
    }
  }
  return null;
}

/** Get all ancestor ids of a node */
export function getAncestorIds(
  nodes: TreeNode[],
  targetId: string,
  path: string[] = [],
): string[] | null {
  for (const n of nodes) {
    if (n.id === targetId) return path;
    if (n.children) {
      const found = getAncestorIds(n.children, targetId, [...path, n.id]);
      if (found) return found;
    }
  }
  return null;
}

/** Get parent id */
export function getParentId(
  nodes: TreeNode[],
  id: string,
  parent: string | null = null,
): string | null {
  for (const n of nodes) {
    if (n.id === id) return parent;
    if (n.children) {
      const found = getParentId(n.children, id, n.id);
      if (found !== null) return found;
    }
  }
  return null;
}

/** Get first child id */
export function getFirstChildId(nodes: TreeNode[], id: string): string | null {
  const node = findNode(nodes, id);
  return node?.children?.[0]?.id ?? null;
}

"use client";

import * as React from "react";
import { DiffViewerCtx } from "./diff-viewer-context";
import { computeDiff, computeThreeWayDiff } from "./diff-engine";
import { DiffViewerLayout } from "./diff-viewer-layout";
import type { ConflictChoice, DiffHunk, DiffViewMode, DiffViewerConfig } from "./types";

const DEFAULT_CONFIG: Required<DiffViewerConfig> = {
  viewMode: "split",
  contextLines: 3,
  wordDiff: true,
  virtualizeThreshold: 500,
};

type TwoWayProps = { original: string; modified: string; base?: never; ours?: never; theirs?: never };
type ThreeWayProps = { base: string; ours: string; theirs: string; original?: never; modified?: never };

export type DiffViewerRootProps = (TwoWayProps | ThreeWayProps) & {
  config?: DiffViewerConfig;
  className?: string;
  /** Replace the default split/unified layout entirely. */
  children?: React.ReactNode;
  /** Called whenever every conflict hunk (merge mode) has been resolved. */
  onFullyResolved?: (mergedText: string) => void;
};

export function DiffViewerRoot(props: DiffViewerRootProps) {
  const { config: configInput, className, children, onFullyResolved } = props;
  const config: Required<DiffViewerConfig> = { ...DEFAULT_CONFIG, ...configInput };

  const isMerge = "base" in props && props.base !== undefined;

  const { hunks, stats } = React.useMemo(() => {
    if (isMerge) {
      const p = props as ThreeWayProps;
      return computeThreeWayDiff(p.base, p.ours, p.theirs, config);
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }
    const p = props as TwoWayProps;
    return computeDiff(p.original, p.modified, config);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isMerge, (props as TwoWayProps).original, (props as TwoWayProps).modified, (props as ThreeWayProps).base, (props as ThreeWayProps).ours, (props as ThreeWayProps).theirs, config.contextLines, config.wordDiff]);

  const defaultCollapsed = React.useMemo(
    () =>
      new Set(
        hunks
          .filter((h, idx) => h.kind === "unchanged" && idx > 0 && idx < hunks.length - 1)
          .map((h) => h.id),
      ),
    [hunks],
  );
  const [resolutions, setResolutions] = React.useState<Record<string, ConflictChoice>>({});
  const [collapsedContextIds, setCollapsedContextIds] = React.useState<Set<string>>(defaultCollapsed);
  React.useEffect(() => {
    setCollapsedContextIds(defaultCollapsed);
  }, [defaultCollapsed]);
  const [viewMode, setViewModeState] = React.useState<DiffViewMode>(config.viewMode);

  const resolveConflict = React.useCallback((hunkId: string, choice: ConflictChoice) => {
    setResolutions((prev) => ({ ...prev, [hunkId]: choice }));
  }, []);

  const resolveAll = React.useCallback(
    (choice: ConflictChoice) => {
      const next: Record<string, ConflictChoice> = {};
      hunks.forEach((h) => {
        if (h.kind === "conflict") next[h.id] = choice;
      });
      setResolutions(next);
    },
    [hunks],
  );

  const toggleContext = React.useCallback((hunkId: string) => {
    setCollapsedContextIds((prev) => {
      const next = new Set(prev);
      if (next.has(hunkId)) next.delete(hunkId);
      else next.add(hunkId);
      return next;
    });
  }, []);

  const isFullyResolved = React.useCallback(
    () => hunks.every((h) => h.kind !== "conflict" || resolutions[h.id] !== undefined),
    [hunks, resolutions],
  );

  const getMergedText = React.useCallback(() => {
    const lines: string[] = [];
    for (const h of hunks) {
      if (h.kind === "unchanged") {
        lines.push(...h.lines.map((l) => l.content));
      } else if (h.kind === "change") {
        lines.push(...h.lines.filter((l) => l.type !== "removed").map((l) => l.content));
      } else if (h.kind === "conflict" && h.conflict) {
        const choice = resolutions[h.id] ?? "base";
        if (choice === "ours") lines.push(...h.conflict.ours.map((l) => l.content));
        else if (choice === "theirs") lines.push(...h.conflict.theirs.map((l) => l.content));
        else if (choice === "both") {
          lines.push(...h.conflict.ours.map((l) => l.content));
          lines.push(...h.conflict.theirs.map((l) => l.content));
        } else {
          lines.push(...h.conflict.base.map((l) => l.content));
        }
      }
    }
    return lines.join("\n");
  }, [hunks, resolutions]);

  React.useEffect(() => {
    if (isFullyResolved() && hunks.some((h) => h.kind === "conflict")) {
      onFullyResolved?.(getMergedText());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [resolutions]);

  const ctx = {
    hunks,
    stats,
    resolutions,
    collapsedContextIds,
    viewMode,
    config,
    resolveConflict,
    resolveAll,
    toggleContext,
    setViewMode: setViewModeState,
    getMergedText,
    isFullyResolved,
  };

  return (
    <DiffViewerCtx.Provider value={ctx}>
      {children ?? <DiffViewerLayout className={className} />}
    </DiffViewerCtx.Provider>
  );
}

DiffViewerRoot.displayName = "DiffViewerRoot";

export type { DiffHunk };

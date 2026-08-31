import { useDiffViewerCtx } from "./diff-viewer-context";

/** Call from anywhere under <DiffViewerRoot> for programmatic access to hunks, stats, and merge control. */
export function useDiffViewer() {
  const ctx = useDiffViewerCtx();
  return {
    hunks: ctx.hunks,
    stats: ctx.stats,
    resolutions: ctx.resolutions,
    viewMode: ctx.viewMode,
    setViewMode: ctx.setViewMode,
    resolveConflict: ctx.resolveConflict,
    resolveAll: ctx.resolveAll,
    toggleContext: ctx.toggleContext,
    getMergedText: ctx.getMergedText,
    isFullyResolved: ctx.isFullyResolved,
  };
}

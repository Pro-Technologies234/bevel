export type DiffLineType = "unchanged" | "added" | "removed";

export interface DiffWordSpan {
  text: string;
  changed: boolean;
}

export interface DiffLine {
  type: DiffLineType;
  /** 1-indexed line number in the original text. null for added lines. */
  originalLineNumber: number | null;
  /** 1-indexed line number in the modified text. null for removed lines. */
  modifiedLineNumber: number | null;
  content: string;
  /**
   * Word-level diff spans, computed lazily (only for changed lines that pair with
   * a corresponding removed/added counterpart) — not populated on every line upfront.
   */
  wordSpans?: DiffWordSpan[];
}

export type DiffHunkKind = "unchanged" | "change" | "conflict";

export interface DiffHunk {
  id: string;
  kind: DiffHunkKind;
  lines: DiffLine[];
  /** Only for kind "conflict" — the three sides being reconciled. */
  conflict?: {
    base: DiffLine[];
    ours: DiffLine[];
    theirs: DiffLine[];
  };
}

export type ConflictChoice = "ours" | "theirs" | "both" | "base";

export type DiffViewMode = "unified" | "split";

export interface DiffViewerConfig {
  viewMode?: DiffViewMode; // default "split"
  /** Lines of unchanged context to show around a change before folding. Default 3. */
  contextLines?: number;
  /** Compute word-level highlighting inside changed line pairs. Default true. */
  wordDiff?: boolean;
  /** Enable virtualization above this line count. Default 500. */
  virtualizeThreshold?: number;
}

export interface DiffEngineResult {
  hunks: DiffHunk[];
  stats: { additions: number; deletions: number; conflicts: number };
}

export interface MergeEditorContextValue {
  hunks: DiffHunk[];
  stats: DiffEngineResult["stats"];
  resolutions: Record<string, ConflictChoice>;
  collapsedContextIds: Set<string>;
  viewMode: DiffViewMode;
  config: Required<DiffViewerConfig>;

  resolveConflict: (hunkId: string, choice: ConflictChoice) => void;
  resolveAll: (choice: ConflictChoice) => void;
  toggleContext: (hunkId: string) => void;
  setViewMode: (mode: DiffViewMode) => void;
  /** Reconstructs the final text from unresolved+resolved hunks. */
  getMergedText: () => string;
  /** True once every conflict hunk has a resolution. */
  isFullyResolved: () => boolean;
}

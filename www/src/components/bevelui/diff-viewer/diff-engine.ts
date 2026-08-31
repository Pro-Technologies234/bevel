import { myersDiff } from "./diff-algorithm";
import type { DiffEngineResult, DiffHunk, DiffLine, DiffViewerConfig, DiffWordSpan } from "./types";

function splitLines(text: string): string[] {
  if (text === "") return [];
  return text.split("\n");
}

function wordDiffPair(removed: string, added: string): { removedSpans: DiffWordSpan[]; addedSpans: DiffWordSpan[] } {
  // Split keeping whitespace as its own tokens so spans reconstruct the exact line.
  const tokenize = (s: string) => s.split(/(\s+)/).filter((t) => t.length > 0);
  const aTokens = tokenize(removed);
  const bTokens = tokenize(added);
  const ops = myersDiff(aTokens, bTokens);

  const removedSpans: DiffWordSpan[] = [];
  const addedSpans: DiffWordSpan[] = [];
  for (const op of ops) {
    if (op.type === "equal") {
      removedSpans.push({ text: op.value, changed: false });
      addedSpans.push({ text: op.value, changed: false });
    } else if (op.type === "delete") {
      removedSpans.push({ text: op.value, changed: true });
    } else {
      addedSpans.push({ text: op.value, changed: true });
    }
  }
  return { removedSpans, addedSpans };
}

/**
 * Flat line-level diff between two texts. Adjacent delete/insert runs are
 * paired up (by position within the run) for word-level highlighting.
 */
export function diffLines(a: string, b: string, wordDiff = true): DiffLine[] {
  const aLines = splitLines(a);
  const bLines = splitLines(b);
  const ops = myersDiff(aLines, bLines);

  const lines: DiffLine[] = [];
  let originalNum = 1;
  let modifiedNum = 1;

  // Buffer consecutive delete/insert runs so we can pair them for word-diff
  // before pushing them into the final line list, matching git's convention
  // of rendering all removals in a change block before all additions.
  let pendingRemoved: string[] = [];
  let pendingAdded: string[] = [];

  function flushPending() {
    if (pendingRemoved.length === 0 && pendingAdded.length === 0) return;

    const pairCount = wordDiff ? Math.min(pendingRemoved.length, pendingAdded.length) : 0;

    for (let i = 0; i < pendingRemoved.length; i++) {
      const content = pendingRemoved[i];
      const line: DiffLine = {
        type: "removed",
        originalLineNumber: originalNum++,
        modifiedLineNumber: null,
        content,
      };
      if (i < pairCount) {
        line.wordSpans = wordDiffPair(content, pendingAdded[i]).removedSpans;
      }
      lines.push(line);
    }

    for (let i = 0; i < pendingAdded.length; i++) {
      const content = pendingAdded[i];
      const line: DiffLine = {
        type: "added",
        originalLineNumber: null,
        modifiedLineNumber: modifiedNum++,
        content,
      };
      if (i < pairCount) {
        line.wordSpans = wordDiffPair(pendingRemoved[i], content).addedSpans;
      }
      lines.push(line);
    }

    pendingRemoved = [];
    pendingAdded = [];
  }

  for (const op of ops) {
    if (op.type === "equal") {
      flushPending();
      lines.push({
        type: "unchanged",
        originalLineNumber: originalNum++,
        modifiedLineNumber: modifiedNum++,
        content: op.value,
      });
    } else if (op.type === "delete") {
      pendingRemoved.push(op.value);
    } else {
      pendingAdded.push(op.value);
    }
  }
  flushPending();

  return lines;
}

let _hunkId = 0;
function uid() {
  _hunkId += 1;
  return `hunk_${_hunkId}`;
}

/**
 * Groups a flat DiffLine[] into hunks: runs of unchanged lines (collapsible,
 * with contextLines preserved uncollapsed at each boundary) alternating with
 * change hunks (the removed/added runs).
 */
export function buildHunks(lines: DiffLine[], contextLines: number): DiffHunk[] {
  const hunks: DiffHunk[] = [];
  let i = 0;

  while (i < lines.length) {
    if (lines[i].type === "unchanged") {
      const start = i;
      while (i < lines.length && lines[i].type === "unchanged") i++;
      const run = lines.slice(start, i);

      const isFileStart = start === 0;
      const isFileEnd = i === lines.length;

      if (run.length <= contextLines * 2 || isFileStart || isFileEnd) {
        // Short enough (or at a file boundary) — no point collapsing.
        hunks.push({ id: uid(), kind: "unchanged", lines: run });
      } else {
        // Keep context at both edges, collapse the middle into one foldable hunk.
        hunks.push({ id: uid(), kind: "unchanged", lines: run.slice(0, contextLines) });
        hunks.push({
          id: uid(),
          kind: "unchanged",
          lines: run.slice(contextLines, run.length - contextLines),
        });
        hunks.push({ id: uid(), kind: "unchanged", lines: run.slice(run.length - contextLines) });
      }
    } else {
      const start = i;
      while (i < lines.length && lines[i].type !== "unchanged") i++;
      hunks.push({ id: uid(), kind: "change", lines: lines.slice(start, i) });
    }
  }

  return hunks;
}

function countStats(lines: DiffLine[]) {
  let additions = 0;
  let deletions = 0;
  for (const l of lines) {
    if (l.type === "added") additions++;
    if (l.type === "removed") deletions++;
  }
  return { additions, deletions };
}

export function computeDiff(a: string, b: string, config: Required<DiffViewerConfig>): DiffEngineResult {
  const lines = diffLines(a, b, config.wordDiff);
  const hunks = buildHunks(lines, config.contextLines);
  const { additions, deletions } = countStats(lines);
  return { hunks, stats: { additions, deletions, conflicts: 0 } };
}

// ─── Three-way merge ──────────────────────────────────────────────────────────

interface ChangeRegion {
  baseStart: number; // inclusive, 0-indexed into baseLines
  baseEnd: number; // exclusive
  resultLines: string[];
}

function changeRegions(base: string[], other: string[]): ChangeRegion[] {
  const ops = myersDiff(base, other);
  const regions: ChangeRegion[] = [];

  let baseIdx = 0;
  let i = 0;
  while (i < ops.length) {
    if (ops[i].type === "equal") {
      baseIdx++;
      i++;
      continue;
    }
    const regionStart = baseIdx;
    const resultLines: string[] = [];
    while (i < ops.length && ops[i].type !== "equal") {
      const op = ops[i];
      if (op.type === "delete") baseIdx++;
      else resultLines.push(op.value);
      i++;
    }
    regions.push({ baseStart: regionStart, baseEnd: baseIdx, resultLines });
  }

  return regions;
}

function regionsOverlap(x: ChangeRegion, y: ChangeRegion): boolean {
  return x.baseStart < y.baseEnd && y.baseStart < x.baseEnd;
}

/**
 * Three-way diff: changes are computed independently against base for both
 * sides, then merged by base line range. A base range touched by only one
 * side auto-applies; a range touched by both sides with different results
 * becomes a conflict hunk requiring resolution.
 */
export function computeThreeWayDiff(
  base: string,
  ours: string,
  theirs: string,
  config: Required<DiffViewerConfig>,
): DiffEngineResult {
  const baseLines = splitLines(base);
  const oursRegions = changeRegions(baseLines, splitLines(ours));
  const theirsRegions = changeRegions(baseLines, splitLines(theirs));

  const hunks: DiffHunk[] = [];
  let conflicts = 0;
  let additions = 0;
  let deletions = 0;
  let cursor = 0;

  const allBoundaries = Array.from(
    new Set(
      [...oursRegions, ...theirsRegions].flatMap((r) => [r.baseStart, r.baseEnd]).concat([0, baseLines.length]),
    ),
  ).sort((a, b) => a - b);

  for (let bi = 0; bi < allBoundaries.length - 1; bi++) {
    const segStart = allBoundaries[bi];
    const segEnd = allBoundaries[bi + 1];
    if (segStart >= segEnd && baseLines.length > 0) continue;

    const oursHit = oursRegions.find((r) => r.baseStart <= segStart && r.baseEnd >= segEnd && r.baseEnd > r.baseStart);
    const theirsHit = theirsRegions.find(
      (r) => r.baseStart <= segStart && r.baseEnd >= segEnd && r.baseEnd > r.baseStart,
    );

    if (!oursHit && !theirsHit) {
      const unchangedContent = baseLines.slice(segStart, segEnd);
      if (unchangedContent.length === 0) continue;
      hunks.push({
        id: uid(),
        kind: "unchanged",
        lines: unchangedContent.map((content, idx) => ({
          type: "unchanged" as const,
          originalLineNumber: segStart + idx + 1,
          modifiedLineNumber: segStart + idx + 1,
          content,
        })),
      });
      cursor = segEnd;
      continue;
    }

    const oursResult = oursHit ? oursHit.resultLines : baseLines.slice(segStart, segEnd);
    const theirsResult = theirsHit ? theirsHit.resultLines : baseLines.slice(segStart, segEnd);
    const sameResult = oursResult.length === theirsResult.length && oursResult.every((l, idx) => l === theirsResult[idx]);

    if (sameResult || !oursHit || !theirsHit) {
      // Only one side changed this region (or both changed it identically) — auto-merge.
      const winner = oursHit ? oursResult : theirsResult;
      additions += winner.length;
      deletions += segEnd - segStart;
      hunks.push({
        id: uid(),
        kind: "change",
        lines: [
          ...baseLines.slice(segStart, segEnd).map((content) => ({
            type: "removed" as const,
            originalLineNumber: null,
            modifiedLineNumber: null,
            content,
          })),
          ...winner.map((content) => ({
            type: "added" as const,
            originalLineNumber: null,
            modifiedLineNumber: null,
            content,
          })),
        ],
      });
    } else {
      // Both sides changed this region differently — real conflict.
      conflicts++;
      hunks.push({
        id: uid(),
        kind: "conflict",
        lines: [],
        conflict: {
          base: baseLines.slice(segStart, segEnd).map((content) => ({
            type: "unchanged" as const,
            originalLineNumber: null,
            modifiedLineNumber: null,
            content,
          })),
          ours: oursResult.map((content) => ({
            type: "added" as const,
            originalLineNumber: null,
            modifiedLineNumber: null,
            content,
          })),
          theirs: theirsResult.map((content) => ({
            type: "added" as const,
            originalLineNumber: null,
            modifiedLineNumber: null,
            content,
          })),
        },
      });
    }

    cursor = segEnd;
  }

  void cursor;
  return { hunks, stats: { additions, deletions, conflicts } };
}

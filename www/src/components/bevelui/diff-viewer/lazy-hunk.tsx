"use client";

import * as React from "react";
import { DiffHunkView } from "./diff-hunk-view";
import type { DiffHunk } from "./types";

export interface LazyHunkProps {
  hunk: DiffHunk;
  active: boolean;
}

const LINE_HEIGHT = 22;

function estimateLines(hunk: DiffHunk): number {
  if (hunk.kind === "conflict") {
    return Math.max(hunk.conflict?.ours.length ?? 0, hunk.conflict?.theirs.length ?? 0) + 3;
  }
  return hunk.lines.length;
}

/**
 * When virtualization is active, hunks outside the viewport render as a
 * fixed-height placeholder instead of their real content — this is a
 * hunk-granularity virtualization (not per-line), which is simpler to reason
 * about correctly and is sufficient since large diffs are dominated by a
 * handful of very large unchanged/change hunks rather than thousands of tiny ones.
 */
export function LazyHunk({ hunk, active }: LazyHunkProps) {
  const ref = React.useRef<HTMLDivElement>(null);
  const [visible, setVisible] = React.useState(!active);

  React.useEffect(() => {
    if (!active) return;
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => setVisible(entry.isIntersecting), {
      rootMargin: "600px 0px",
    });
    observer.observe(el);
    return () => observer.disconnect();
  }, [active]);

  if (!active || visible) {
    return (
      <div ref={ref}>
        <DiffHunkView hunk={hunk} />
      </div>
    );
  }

  const height = estimateLines(hunk) * LINE_HEIGHT;
  return <div ref={ref} style={{ height }} />;
}

LazyHunk.displayName = "LazyHunk";

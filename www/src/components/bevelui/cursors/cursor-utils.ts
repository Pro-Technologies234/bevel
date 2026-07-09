// ─── Color ────────────────────────────────────────────────────────────────────
// 12 perceptually distinct colors; deterministic from userId so colors are
// stable across reconnects and consistent for all observers.

const PALETTE = [
  "#ef4444", "#f97316", "#eab308", "#22c55e",
  "#06b6d4", "#3b82f6", "#8b5cf6", "#ec4899",
  "#14b8a6", "#f59e0b", "#84cc16", "#6366f1",
];

export function colorFromUserId(userId: string): string {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash + userId.charCodeAt(i)) | 0;
  }
  return PALETTE[Math.abs(hash) % PALETTE.length];
}

// ─── Label overlap resolver ───────────────────────────────────────────────────
// Given N cursors, computes per-label offsets (relative to cursor tip) that
// eliminate overlaps. Works in absolute container pixels.
//
// Algorithm: iterative axis-aligned separation — for each overlapping pair,
// push apart on the axis with less penetration. Run 8 iterations (fast for
// N < 30, which covers any realistic collaboration scenario).

export interface LabelLayout {
  id: string;
  cursorX: number; // cursor tip in container px
  cursorY: number;
  labelW: number;  // measured label width
  labelH: number;  // measured label height
}

const NATURAL_DX = 12;  // label offset right of cursor tip
const NATURAL_DY = 8;   // label offset below cursor tip
const PAD = 4;          // minimum gap between labels
const ITERS = 8;

/**
 * Returns per-label offsets { dx, dy } relative to each cursor's tip position.
 * Apply as: label.style.transform = `translate(${dx}px, ${dy}px)`
 */
export function resolveLabels(
  layouts: LabelLayout[],
  containerW: number,
  containerH: number,
): Map<string, { dx: number; dy: number }> {
  // Build working rects in absolute container coords
  const rects = layouts.map((l) => ({
    id: l.id,
    x: l.cursorX + NATURAL_DX,
    y: l.cursorY + NATURAL_DY,
    w: l.labelW,
    h: l.labelH,
    cx: l.cursorX,
    cy: l.cursorY,
  }));

  for (let iter = 0; iter < ITERS; iter++) {
    for (let i = 0; i < rects.length; i++) {
      for (let j = i + 1; j < rects.length; j++) {
        const a = rects[i];
        const b = rects[j];

        // AABB overlap with padding
        const overlapX =
          Math.min(a.x + a.w + PAD, b.x + b.w + PAD) - Math.max(a.x, b.x);
        const overlapY =
          Math.min(a.y + a.h + PAD, b.y + b.h + PAD) - Math.max(a.y, b.y);

        if (overlapX <= 0 || overlapY <= 0) continue;

        // Resolve on the minimum-penetration axis
        if (overlapY < overlapX) {
          const half = overlapY / 2 + 1;
          if (a.y < b.y) { a.y -= half; b.y += half; }
          else            { a.y += half; b.y -= half; }
        } else {
          const half = overlapX / 2 + 1;
          if (a.x < b.x) { a.x -= half; b.x += half; }
          else            { a.x += half; b.x -= half; }
        }
      }
    }
  }

  // Clamp to container, convert back to cursor-relative offsets
  const result = new Map<string, { dx: number; dy: number }>();
  for (const r of rects) {
    const cx = Math.max(0, Math.min(containerW - r.w, r.x));
    const cy = Math.max(0, Math.min(containerH - r.h, r.y));
    result.set(r.id, { dx: cx - r.cx, dy: cy - r.cy });
  }
  return result;
}

// ─── Throttle ─────────────────────────────────────────────────────────────────
// Leading-edge throttle — fires immediately then suppresses for `ms`.

export function throttle<T extends (...args: never[]) => void>(
  fn: T,
  ms: number,
): (...args: Parameters<T>) => void {
  let last = 0;
  return (...args) => {
    const now = performance.now();
    if (now - last >= ms) {
      last = now;
      fn(...args);
    }
  };
}

/**
 * Lightweight fuzzy search — no external dependency.
 *
 * Returns a score (higher = better match) for `query` against `text`.
 * Returns -1 if there is no match.
 *
 * Scoring:
 *   100  exact match (case-insensitive)
 *    80  starts with query
 *    60  contains query as a contiguous substring
 *    score based on how many query chars appear in sequence (0–40)
 */
export function fuzzyScore(text: string, query: string): number {
  if (!query) return 100;
  const t = text.toLowerCase();
  const q = query.toLowerCase();

  if (t === q) return 100;
  if (t.startsWith(q)) return 80;
  if (t.includes(q)) return 60;

  let ti = 0;
  let qi = 0;
  let matched = 0;
  while (ti < t.length && qi < q.length) {
    if (t[ti] === q[qi]) {
      matched++;
      qi++;
    }
    ti++;
  }
  if (qi < q.length) return -1;
  return Math.round((matched / q.length) * 40);
}

/**
 * Score an item against a query across its searchable fields.
 */
export function scoreItem(
  item: { title: string; subtitle?: string; meta?: string; category?: string },
  query: string,
): number {
  if (!query.trim()) return 100;
  const titleScore = fuzzyScore(item.title, query);
  const subtitleScore = item.subtitle
    ? fuzzyScore(item.subtitle, query) * 0.6
    : -1;
  const metaScore = item.meta ? fuzzyScore(item.meta, query) * 0.4 : -1;
  return Math.max(titleScore, subtitleScore, metaScore);
}

/**
 * Highlight matched characters in `text` for display.
 * Returns an array of { char, highlight } pairs.
 */
export function highlightMatch(
  text: string,
  query: string,
): { char: string; highlight: boolean }[] {
  if (!query.trim())
    return text.split("").map((c) => ({ char: c, highlight: false }));

  const t = text.toLowerCase();
  const q = query.toLowerCase();
  const result = text.split("").map((c) => ({ char: c, highlight: false }));

  const idx = t.indexOf(q);
  if (idx !== -1) {
    for (let i = idx; i < idx + q.length; i++) result[i].highlight = true;
    return result;
  }

  let qi = 0;
  for (let ti = 0; ti < t.length && qi < q.length; ti++) {
    if (t[ti] === q[qi]) {
      result[ti].highlight = true;
      qi++;
    }
  }
  return result;
}

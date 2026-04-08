import { useMemo, useState } from "react";

type FieldExtractor<T> = (item: T) => string | (string | null | undefined)[];

interface UseSearchOptions<T> {
  /** The full dataset to filter */
  data: T[];
  /** One or more field extractors */
  fields: FieldExtractor<T>[];
}

interface UseSearchReturn<T> {
  query: string;
  setQuery: (q: string) => void;
  filtered: T[];
  hasQuery: boolean;
  noResults: boolean;
  clear: () => void;
}

// ── Hook ───────────────────────────────────────────────────────────────────────
export function useSearch<T>({ data, fields }: UseSearchOptions<T>): UseSearchReturn<T> {
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const raw = query.trim();
    if (!raw) return data;

    // Escape special regex chars so "john." doesn't throw
    const escaped = raw.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const re = new RegExp(escaped, "i");

    return data.filter((item) =>
      fields.some((extract) => {
        const val = extract(item);
        const targets = Array.isArray(val) ? val : [val];
        return targets.some((t) => t && re.test(t));
      }),
    );
  }, [data, query, fields]);

  return {
    query,
    setQuery,
    filtered,
    hasQuery: query.trim().length > 0,
    noResults: data.length > 0 && filtered.length === 0 && query.trim().length > 0,
    clear: () => setQuery(""),
  };
}

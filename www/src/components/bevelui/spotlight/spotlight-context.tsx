import * as React from "react";
import type {
  SpotlightConfig,
  SpotlightContextValue,
  SpotlightResult,
} from "./types";

export const SpotlightCtx = React.createContext<SpotlightContextValue | null>(
  null,
);

export function useSpotlight(): SpotlightContextValue {
  const ctx = React.useContext(SpotlightCtx);
  if (!ctx) throw new Error("useSpotlight must be used inside SpotlightRoot");
  return ctx;
}

export interface SpotlightProviderProps {
  config: SpotlightConfig;
  onSearch: (query: string, signal: AbortSignal) => Promise<SpotlightResult[]>;
  children: React.ReactNode;
}

const DEBOUNCE_MS = 280;

export function SpotlightProvider({
  children,
  config,
  onSearch,
}: SpotlightProviderProps) {
  const storageKey = config.storageKey ?? "bevel-spotlight-history";
  const maxHistory = config.maxRecentSearches ?? 8;

  const [isOpen, setIsOpen] = React.useState(false);
  const [query, setQueryRaw] = React.useState("");
  const [results, setResults] = React.useState<SpotlightResult[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [activeCategory, setActiveCategory] = React.useState("all");
  const [recentSearches, setRecentSearches] = React.useState<string[]>(() => {
    if (typeof window === "undefined") return [];
    try {
      return JSON.parse(localStorage.getItem(storageKey) ?? "[]");
    } catch {
      return [];
    }
  });

  const abortRef = React.useRef<AbortController | null>(null);
  const debounceRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    const hotkey = config.hotkey ?? "/";
    function handler(e: KeyboardEvent) {
      const isMod = e.metaKey || e.ctrlKey;
      const isSlash =
        hotkey === "/" && e.key === "/" && !e.metaKey && !e.ctrlKey;
      const isModK = hotkey === "mod+k" && isMod && e.key === "k";
      if (
        (isSlash || isModK) &&
        !["INPUT", "TEXTAREA"].includes((e.target as HTMLElement)?.tagName)
      ) {
        e.preventDefault();
        setIsOpen((p) => !p);
      }
      if (e.key === "Escape") setIsOpen(false);
    }
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [config.hotkey]);

  function setQuery(q: string) {
    setQueryRaw(q);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!q.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    debounceRef.current = setTimeout(async () => {
      abortRef.current?.abort();
      abortRef.current = new AbortController();
      try {
        const data = await onSearch(q, abortRef.current.signal);
        setResults(data);

        setRecentSearches((prev) => {
          const next = [q, ...prev.filter((r) => r !== q)].slice(0, maxHistory);
          try {
            localStorage.setItem(storageKey, JSON.stringify(next));
          } catch {}
          return next;
        });
      } catch {
        /* aborted */
      } finally {
        setIsLoading(false);
      }
    }, DEBOUNCE_MS);
  }

  function close() {
    setIsOpen(false);
    setQueryRaw("");
    setResults([]);
    setIsLoading(false);
  }

  function removeRecent(q: string) {
    setRecentSearches((prev) => {
      const next = prev.filter((r) => r !== q);
      try {
        localStorage.setItem(storageKey, JSON.stringify(next));
      } catch {}
      return next;
    });
  }

  function clearHistory() {
    setRecentSearches([]);
    try {
      localStorage.removeItem(storageKey);
    } catch {}
  }

  const ctx: SpotlightContextValue = {
    isOpen,
    query,
    results,
    isLoading,
    activeCategory,
    recentSearches,
    config,
    open: () => setIsOpen(true),
    close,
    setQuery,
    setCategory: setActiveCategory,
    clearHistory,
    removeRecent,
  };
  return <SpotlightCtx.Provider value={ctx}>{children}</SpotlightCtx.Provider>;
}

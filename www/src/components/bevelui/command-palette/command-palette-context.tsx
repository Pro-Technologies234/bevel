import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import type {
  CommandPaletteContextValue,
  CommandPaletteItem,
  CommandPaletteSection,
} from "./command-palette-types";
import { scoreItem } from "./command-palette-fuzzy";

const CommandPaletteContext = createContext<
  CommandPaletteContextValue | undefined
>(undefined);

export function useCommandPalette(): CommandPaletteContextValue {
  const ctx = useContext(CommandPaletteContext);
  if (!ctx)
    throw new Error(
      "useCommandPalette must be used within <CommandPaletteProvider>",
    );
  return ctx;
}

interface CommandPaletteProviderProps {
  children: React.ReactNode;
  /** All items across all sections */
  sections: CommandPaletteSection[];
  defaultOpen?: boolean;
  onSelect?: (item: CommandPaletteItem) => void;
  onClose?: () => void;
}

export function CommandPaletteProvider({
  children,
  sections,
  defaultOpen = false,
  onSelect,
  onClose,
}: CommandPaletteProviderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const [query, setQueryState] = useState("");
  const [activeSourceTab, setActiveSourceTab] = useState("all");
  const [activeFilterTab, setActiveFilterTab] = useState("all");
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);

  const filteredSections = useMemo<CommandPaletteSection[]>(() => {
    return sections
      .map((section) => {
        let items = section.items;

        if (activeSourceTab !== "all") {
          items = items.filter((i) => i.source === activeSourceTab);
        }

        if (activeFilterTab !== "all") {
          items = items.filter((i) => i.category === activeFilterTab);
        }

        if (query.trim()) {
          items = items
            .map((item) => ({ item, score: scoreItem(item, query) }))
            .filter(({ score }) => score > 0)
            .sort((a, b) => b.score - a.score)
            .map(({ item }) => item);
        }

        return { ...section, items };
      })
      .filter((s) => s.items.length > 0);
  }, [sections, query, activeSourceTab, activeFilterTab]);

  const flatResults = useMemo<CommandPaletteItem[]>(
    () => filteredSections.flatMap((s) => s.items),
    [filteredSections],
  );

  useEffect(() => {
    setHighlightedIndex(0);
  }, [filteredSections]);

  const open = useCallback(() => {
    setIsOpen(true);
    setQueryState("");
    setHighlightedIndex(0);
  }, []);

  const close = useCallback(() => {
    setIsOpen(false);
    onClose?.();
  }, [onClose]);

  const setQuery = useCallback((q: string) => {
    setQueryState(q);
    setIsLoading(true);

    const t = setTimeout(() => setIsLoading(false), 150);
    return () => clearTimeout(t);
  }, []);

  const setSourceTab = useCallback((id: string) => {
    setActiveSourceTab(id);
    setHighlightedIndex(0);
  }, []);

  const setFilterTab = useCallback((id: string) => {
    setActiveFilterTab(id);
    setHighlightedIndex(0);
  }, []);

  const moveUp = useCallback(() => {
    setHighlightedIndex((i) => (i <= 0 ? flatResults.length - 1 : i - 1));
  }, [flatResults.length]);

  const moveDown = useCallback(() => {
    setHighlightedIndex((i) => (i >= flatResults.length - 1 ? 0 : i + 1));
  }, [flatResults.length]);

  const selectItem = useCallback(
    (item: CommandPaletteItem) => {
      item.onSelect?.(item);
      onSelect?.(item);
      close();
    },
    [onSelect, close],
  );

  const selectHighlighted = useCallback(() => {
    const item = flatResults[highlightedIndex];
    if (item) selectItem(item);
  }, [flatResults, highlightedIndex, selectItem]);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        isOpen ? close() : open();
        return;
      }
      if (!isOpen) return;
      if (e.key === "Escape") {
        e.preventDefault();
        close();
      }
      if (e.key === "ArrowUp") {
        e.preventDefault();
        moveUp();
      }
      if (e.key === "ArrowDown") {
        e.preventDefault();
        moveDown();
      }
      if (e.key === "Enter") {
        e.preventDefault();
        selectHighlighted();
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, open, close, moveUp, moveDown, selectHighlighted]);

  return (
    <CommandPaletteContext.Provider
      value={{
        isOpen,
        query,
        activeSourceTab,
        activeFilterTab,
        highlightedIndex,
        filteredSections,
        flatResults,
        isLoading,
        open,
        close,
        setQuery,
        setSourceTab,
        setFilterTab,
        moveUp,
        moveDown,
        selectHighlighted,
        selectItem,
      }}
    >
      {children}
    </CommandPaletteContext.Provider>
  );
}

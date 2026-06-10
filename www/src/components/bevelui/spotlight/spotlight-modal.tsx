import * as React from "react";
import { useSpotlight } from "./spotlight-context";
import { SpotlightResults } from "./spotlight-results";
import { SpotlightEmpty } from "./spotlight-empty";
import { IconSearch, IconX, IconLoader2 } from "@tabler/icons-react";
import { AnimatePresence, motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { SpotlightConfig } from "./types";

export function SpotlightModal() {
  const { config, isOpen, close, query, setQuery, isLoading } = useSpotlight();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    if (isOpen) setTimeout(() => inputRef.current?.focus(), 50);
  }, [isOpen]);

  const hasResults = query.trim().length > 0;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm"
            onClick={close}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.97, y: -8 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.97, y: -8 }}
            transition={{ duration: 0.16, ease: "easeOut" }}
            className="fixed left-1/2 top-[10%] z-50 -translate-x-1/2 w-full max-w-4xl px-4  "
          >
            <div className="rounded-xl border border-border bg-popover shadow-2xl shadow-black/50 overflow-hidden h-full min-h-[400px] flex flex-col justify-between">
              <div className="flex items-center gap-3 px-4 py-3 border-b border-border/60">
                {isLoading ? (
                  <IconLoader2
                    size={17}
                    className="text-muted-foreground/50 shrink-0 animate-spin"
                  />
                ) : (
                  <IconSearch
                    size={17}
                    className="text-muted-foreground/50 shrink-0"
                  />
                )}
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder={config.placeholder ?? "Search anything…"}
                  className="flex-1 bg-transparent text-[14px] text-foreground placeholder:text-muted-foreground/40 outline-none"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-muted-foreground/40 hover:text-muted-foreground transition-colors shrink-0"
                  >
                    <IconX size={14} />
                  </button>
                )}
              </div>

              {config.categories.length > 0 && hasResults && (
                <CategoryTabs categories={config.categories} />
              )}

              <div className="max-h-[500px] overflow-y-auto flex-1">
                {hasResults ? (
                  <SpotlightResults config={config} />
                ) : (
                  <SpotlightEmpty />
                )}
              </div>

              <div className="flex items-center justify-between px-4 py-2 border-t border-border/40 bg-muted/20">
                <div className="flex items-center gap-3 text-[10px] font-mono text-muted-foreground/30">
                  <span>↑↓ navigate</span>
                  <span>⏎ open</span>
                  <span>esc close</span>
                </div>
                <span className="text-[10px] font-mono text-muted-foreground/20">
                  Spotlight
                </span>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

function CategoryTabs({
  categories,
}: {
  categories: SpotlightConfig["categories"];
}) {
  const { activeCategory, setCategory, results } = useSpotlight();
  const all = [{ id: "all", label: "All" }, ...categories];

  return (
    <div className="flex items-center gap-1 px-3 py-2 border-b border-border/40 overflow-x-auto">
      {all.map((cat) => {
        const count =
          cat.id === "all"
            ? results.length
            : results.filter((r) => r.category === cat.id).length;
        return (
          <button
            key={cat.id}
            type="button"
            onClick={() => setCategory(cat.id)}
            className={cn(
              "flex items-center gap-1.5 px-3 py-1 rounded-sm text-[11px] font-medium transition-colors whitespace-nowrap",
              activeCategory === cat.id
                ? "bg-primary/10 text-primary"
                : "text-muted-foreground/60 hover:text-foreground hover:bg-muted/60",
            )}
          >
            {cat.label}
            {count > 0 && (
              <span
                className={cn(
                  "text-[9px] font-mono",
                  activeCategory === cat.id
                    ? "text-primary/60"
                    : "text-muted-foreground/30",
                )}
              >
                {count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

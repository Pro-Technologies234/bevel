import * as React from "react";
import {
  IconCircleCheck,
  IconLoader2,
  IconSparkles,
  IconX,
} from "@tabler/icons-react";
import { Separator } from "@/components/ui/separator";
import { useCommandPalette } from "./command-palette-context";

export function CommandPaletteSearchbar() {
  const { query, setQuery, close, isLoading } = useCommandPalette();
  const inputRef = React.useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 50);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="flex items-center gap-2 px-3 py-2.5 border-b border-border/60">
      {/* Loading / search icon */}
      <div className="shrink-0 text-muted-foreground">
        {isLoading ? (
          <IconLoader2 size={17} strokeWidth={1.8} className="animate-spin" />
        ) : (
          <IconCircleCheck size={17} strokeWidth={1.8} className="opacity-30" />
        )}
      </div>

      {/* Input */}
      <input
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Type a command or search..."
        className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground/50 text-foreground"
        onKeyDown={(e) => {
          if (["ArrowUp", "ArrowDown", "Enter", "Escape"].includes(e.key)) {
            e.preventDefault();
          }
        }}
      />

      {/* Clear + close */}
      {query && (
        <button
          onClick={() => setQuery("")}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Clear search"
        >
          <IconX size={14} strokeWidth={2} />
        </button>
      )}
      {!query && (
        <button
          onClick={close}
          className="shrink-0 text-muted-foreground hover:text-foreground transition-colors"
          aria-label="Close"
        >
          <IconX size={14} strokeWidth={2} />
        </button>
      )}

      <Separator orientation="vertical" className="h-4 shrink-0" />

      {/* AI button */}
      <button
        className="shrink-0 text-primary hover:text-primary/80 transition-colors"
        aria-label="AI search"
      >
        <IconSparkles size={17} strokeWidth={1.8} />
      </button>
    </div>
  );
}

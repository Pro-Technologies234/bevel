import * as React from "react";
import { cn } from "@/lib/utils";
import { IconCornerDownLeft } from "@tabler/icons-react";
import { useCommandPalette } from "./command-palette-context";
import { highlightMatch } from "./command-palette-fuzzy";
import type { CommandPaletteItem } from "./command-palette-types";

function ItemAvatar({ item }: { item: CommandPaletteItem }) {
  if (typeof item.icon === "string") {
    return (
      <img
        src={item.icon}
        alt={item.title}
        className="w-8 h-8 rounded-full object-cover shrink-0"
      />
    );
  }

  if (item.icon) {
    return (
      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-muted shrink-0 text-sm">
        {item.icon}
      </div>
    );
  }

  if (item.initials) {
    return (
      <div
        className="w-8 h-8 rounded-md flex items-center justify-center shrink-0 text-[11px] font-semibold text-white"
        style={{ background: item.initialsColor ?? "hsl(var(--primary))" }}
      >
        {item.initials}
      </div>
    );
  }

  const letter = item.title.charAt(0).toUpperCase();
  return (
    <div className="w-8 h-8 rounded-full flex items-center justify-center shrink-0 bg-muted text-[11px] font-semibold text-muted-foreground">
      {letter}
    </div>
  );
}

function HighlightedText({ text, query }: { text: string; query: string }) {
  const chars = highlightMatch(text, query);
  return (
    <span>
      {chars.map((c, i) =>
        c.highlight ? (
          <mark key={i} className="bg-transparent text-primary font-semibold">
            {c.char}
          </mark>
        ) : (
          <React.Fragment key={i}>{c.char}</React.Fragment>
        ),
      )}
    </span>
  );
}

function ResultRow({
  item,
  query,
  isHighlighted,
  globalIndex,
}: {
  item: CommandPaletteItem;
  query: string;
  isHighlighted: boolean;
  globalIndex: number;
}) {
  const { selectItem, moveDown, moveUp } = useCommandPalette();
  const rowRef = React.useRef<HTMLButtonElement>(null);

  React.useEffect(() => {
    if (isHighlighted) {
      rowRef.current?.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
  }, [isHighlighted]);

  return (
    <button
      ref={rowRef}
      onClick={() => selectItem(item)}
      className={cn(
        "group flex items-center gap-3 w-full px-3 py-2 text-left",
        "transition-colors duration-75 rounded-md mx-1",
        isHighlighted ? "bg-muted/60" : "hover:bg-muted/40",
      )}
      style={{ width: "calc(100% - 8px)" }}
    >
      {/* Avatar */}
      {item.initialsColor && <ItemAvatar item={item} />}
      {item.icon && <ItemAvatar item={item} />}

      {/* Text */}
      <div className="flex-1 min-w-0 flex items-center gap-1.5">
        <span className="text-sm font-medium text-foreground truncate">
          <HighlightedText text={item.title} query={query} />
        </span>
        {item.subtitle && (
          <>
            <span className="text-muted-foreground/50 text-sm shrink-0">•</span>
            <span className="text-sm text-muted-foreground truncate">
              <HighlightedText text={item.subtitle} query={query} />
            </span>
          </>
        )}
      </div>

      {/* Right meta / enter icon */}
      <div className="shrink-0 flex items-center gap-2">
        {item.meta && (
          <span className="text-xs text-muted-foreground">{item.meta}</span>
        )}
        {isHighlighted && (
          <span className="flex items-center justify-center w-5 h-5 rounded border border-border/60 bg-background text-muted-foreground">
            <IconCornerDownLeft size={11} strokeWidth={2} />
          </span>
        )}
      </div>
    </button>
  );
}

export function CommandPaletteResults() {
  const { filteredSections, flatResults, query, highlightedIndex } =
    useCommandPalette();

  if (flatResults.length === 0) {
    return (
      <div className="flex items-center justify-center py-12 text-sm text-muted-foreground">
        {query ? `No results for "${query}"` : "Start typing to search..."}
      </div>
    );
  }

  let globalIndex = 0;

  return (
    <div className="flex flex-col py-2 overflow-y-auto max-h-[340px]">
      {filteredSections.map((section) => {
        const sectionStart = globalIndex;
        globalIndex += section.items.length;

        return (
          <div key={section.id}>
            {/* Section header */}
            <div className="flex items-center gap-2 px-4 pt-3 pb-1">
              <span className="text-xs font-medium text-muted-foreground">
                {section.title}
              </span>
              <span className="text-xs text-muted-foreground/50">
                {section.items.length}
              </span>
            </div>

            {/* Section items */}
            {section.items.map((item, i) => {
              const gi = sectionStart + i;
              return (
                <ResultRow
                  key={item.id}
                  item={item}
                  query={query}
                  isHighlighted={gi === highlightedIndex}
                  globalIndex={gi}
                />
              );
            })}
          </div>
        );
      })}
    </div>
  );
}

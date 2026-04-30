import * as React from "react";
import { cn } from "@/lib/utils";
import { motion } from "motion/react";
import { IconFilter, IconPlus, IconSortAscending } from "@tabler/icons-react";
import type {
  CommandPaletteSourceTab,
  CommandPaletteFilterTab,
} from "./command-palette-types";
import { useCommandPalette } from "./command-palette-context";

function SourceTabItem({
  tab,
  isActive,
  onClick,
}: {
  tab: CommandPaletteSourceTab;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={tab.label}
      className={cn(
        "relative flex gap-2 items-center justify-center shrink-0 rounded-sm transition-all duration-150 z-1",
        tab.logoSrc || tab.label
          ? "px-2.5 py-1 text-xs font-medium"
          : "w-8 h-8",
        isActive
          ? " text-foreground"
          : "text-muted-foreground hover:text-foreground",
      )}
    >
      {tab.id !== "all" && tab.logoSrc && (
        <img
          src={tab.logoSrc}
          alt={tab.label}
          className="w-4 h-4 rounded-sm object-contain"
        />
      )}

      {tab.icon && !tab.logoSrc && <span className="text-sm">{tab.icon}</span>}
      <span>{tab.label}</span>

      {/* Active indicator */}
      {isActive && (
        <motion.span
          layoutId="source-tab-indicator"
          className="absolute inset-0 rounded-sm border border-border/80 bg-muted/60"
          style={{ zIndex: -1 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}

interface CommandPaletteSourceTabsProps {
  tabs: CommandPaletteSourceTab[];
  onAddSource?: () => void;
}

export function CommandPaletteSourceTabs({
  tabs,
  onAddSource,
}: CommandPaletteSourceTabsProps) {
  const { activeSourceTab, setSourceTab } = useCommandPalette();

  return (
    <div className="flex items-center gap-1 px-3 py-1.5 border-b border-border/60 overflow-x-auto no-scrollbar">
      {tabs.map((tab) => (
        <SourceTabItem
          key={tab.id}
          tab={tab}
          isActive={activeSourceTab === tab.id}
          onClick={() => setSourceTab(tab.id)}
        />
      ))}

      <button
        onClick={onAddSource}
        className="flex items-center justify-center w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors shrink-0 ml-1"
        aria-label="Add source"
      >
        <IconPlus size={14} strokeWidth={2} />
      </button>
    </div>
  );
}

function FilterTabItem({
  tab,
  isActive,
  onClick,
}: {
  tab: CommandPaletteFilterTab;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "relative flex items-center gap-1.5 shrink-0 px-2.5 py-1.5 text-xs font-medium",
        "rounded-md transition-colors duration-150",
        isActive
          ? "text-foreground"
          : "text-muted-foreground hover:text-foreground hover:bg-muted/40",
      )}
    >
      {tab.icon && <span className="text-[13px] leading-none">{tab.icon}</span>}
      {tab.label}

      {/* Active underline */}
      {isActive && (
        <motion.span
          layoutId="filter-tab-underline"
          className="absolute bottom-0 inset-x-0 h-px bg-primary rounded-full"
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        />
      )}
    </button>
  );
}

interface CommandPaletteFilterTabsProps {
  tabs: CommandPaletteFilterTab[];
  onFilter?: () => void;
  onSort?: () => void;
}

export function CommandPaletteFilterTabs({
  tabs,
  onFilter,
  onSort,
}: CommandPaletteFilterTabsProps) {
  const { activeFilterTab, setFilterTab } = useCommandPalette();

  return (
    <div className="flex items-center gap-0.5 px-2 py-1 border-b border-border/60 overflow-x-auto no-scrollbar">
      <div className="flex items-center gap-0.5 flex-1 min-w-0 overflow-x-auto no-scrollbar">
        {tabs.map((tab) => (
          <FilterTabItem
            key={tab.id}
            tab={tab}
            isActive={activeFilterTab === tab.id}
            onClick={() => setFilterTab(tab.id)}
          />
        ))}
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-1 shrink-0 ml-1 pl-1 border-l border-border/50">
        <button
          onClick={onFilter}
          className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-xs"
          aria-label="Filter"
        >
          <IconFilter size={16} />
        </button>
        <button
          onClick={onSort}
          className="flex items-center justify-center w-6 h-6 rounded text-muted-foreground hover:text-foreground hover:bg-muted/50 transition-colors text-xs"
          aria-label="Sort"
        >
          <IconSortAscending size={16} />
        </button>
      </div>
    </div>
  );
}

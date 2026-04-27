"use client";

import pageData from "@/content/docs/command-palette.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  CommandPaletteProvider,
  useCommandPalette,
  type CommandPaletteSection,
  type CommandPaletteSourceTab,
  type CommandPaletteFilterTab,
  CommandPaletteTrigger,
  CommandPaletteRoot,
} from "@/components/bevelui/command-palette";
import {
  IconBook,
  IconCheckbox,
  IconFile,
  IconFolder,
  IconMail,
  IconPhoto,
  IconUser,
  IconSearch,
  IconSettings,
  IconBell,
  IconLayoutGrid,
  IconUsers,
  IconCalendar,
  IconMessage,
  IconBrandFigma,
  IconBrandGithub,
  IconBrandSlack,
  IconBrandNotion,
  IconTerminal,
  IconRocket,
  IconStar,
  IconClock,
  IconFileText,
  IconX,
  IconArrowUp,
  IconArrowDown,
  IconCornerDownLeft,
  IconLoader2,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import * as Dialog from "@radix-ui/react-dialog";
import { useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { docsCommandPaletteMetadata } from "@/lib/metadata";
export const metadata = docsCommandPaletteMetadata;
// ─── Original Demo (kept for docs) ───────────────────────────────────────────

const SOURCE_TABS: CommandPaletteSourceTab[] = [
  { id: "all", label: "All" },
  {
    id: "gmail",
    label: "Gmail",
    logoSrc:
      "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
  },
  {
    id: "figma",
    label: "Figma",
    logoSrc:
      "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
  {
    id: "slack",
    label: "Slack",
    logoSrc:
      "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
  },
];

const FILTER_TABS: CommandPaletteFilterTab[] = [
  { id: "all", label: "All" },
  { id: "people", label: "People", icon: <IconUser size={12} /> },
  { id: "task", label: "Tasks", icon: <IconCheckbox size={12} /> },
  { id: "pages", label: "Pages", icon: <IconFile size={12} /> },
  { id: "files", label: "Files", icon: <IconFolder size={12} /> },
  { id: "docs", label: "Docs", icon: <IconBook size={12} /> },
  { id: "messages", label: "Messages", icon: <IconMail size={12} /> },
  { id: "images", label: "Images", icon: <IconPhoto size={12} /> },
];

const SECTIONS: CommandPaletteSection[] = [
  {
    id: "best-matches",
    title: "Best matches",
    items: [
      {
        id: "harper",
        title: "Harper Martinez",
        subtitle: "gmartinez@example.com",
        icon: "https://i.pravatar.cc/150?img=47",
        category: "people",
        href: "#",
      },
      {
        id: "mason",
        title: "Mason Parker",
        subtitle: "parker@example.com",
        meta: "Applied AI Engineer",
        icon: "https://i.pravatar.cc/150?img=12",
        category: "people",
        href: "#",
      },
    ],
  },
  {
    id: "recent",
    title: "Recent",
    items: [
      {
        id: "q3-report",
        title: "Q3 Engineering Report",
        subtitle: "Updated 2 hours ago",
        meta: "Doc",
        initials: "Q3",
        initialsColor: "#6366f1",
        category: "docs",
        href: "#",
      },
      {
        id: "design-system",
        title: "Design System v2",
        subtitle: "Figma file",
        meta: "File",
        initials: "DS",
        initialsColor: "#ec4899",
        category: "files",
        source: "figma",
        href: "#",
      },
      {
        id: "onboarding-task",
        title: "Update onboarding flow",
        subtitle: "Due tomorrow",
        meta: "In progress",
        initials: "T",
        initialsColor: "#f59e0b",
        category: "task",
        href: "#",
      },
      {
        id: "alex",
        title: "Alex Chen",
        subtitle: "achen@example.com",
        meta: "Engineering Lead",
        icon: "https://i.pravatar.cc/150?img=33",
        category: "people",
        href: "#",
      },
    ],
  },
];

// ─── Data ─────────────────────────────────────────────────────────────────────

export function CommandPaletteDemo() {
  return (
    <CommandPaletteRoot
      sections={SECTIONS}
      sourceTabs={SOURCE_TABS}
      filterTabs={FILTER_TABS}
      defaultOpen={false}
      onSelect={(item) => console.log("Selected:", item.title)}
    >
      <div className="flex flex-col items-center gap-4 py-4">
        <p className="text-sm text-muted-foreground">
          Click the trigger or press{" "}
          <kbd className="text-[11px] bg-muted border border-border rounded px-1.5 py-0.5">
            ⌘K
          </kbd>{" "}
          to open
        </p>
        <CommandPaletteTrigger
          label="Search people, tasks, docs..."
          className="w-72"
        />
      </div>
    </CommandPaletteRoot>
  );
}

// ─── Built‑in UI (reused from the original root, but we need to embed it here) ─
// We'll just import the existing modal from the component; for brevity I'm assuming
// it's exported as CommandPaletteModal. But to avoid duplication, I'll create a
// custom UI in the showcase anyway.

// ─── Showcase: Custom UI using useCommandPalette ─────────────────────────────

const SHOWCASE_SECTIONS: CommandPaletteSection[] = [
  {
    id: "people",
    title: "Team Members",
    items: [
      {
        id: "sarah",
        title: "Sarah Chen",
        subtitle: "sarah@bevel.ai",
        meta: "Product Design",
        icon: "https://i.pravatar.cc/150?img=32",
        category: "people",
      },
      {
        id: "marcus",
        title: "Marcus Johnson",
        subtitle: "marcus@bevel.ai",
        meta: "Engineering",
        icon: "https://i.pravatar.cc/150?img=52",
        category: "people",
      },
      {
        id: "alex",
        title: "Alex Rivera",
        subtitle: "alex@bevel.ai",
        meta: "Marketing",
        icon: "https://i.pravatar.cc/150?img=28",
        category: "people",
      },
    ],
  },
  {
    id: "projects",
    title: "Recent Projects",
    items: [
      {
        id: "design-system",
        title: "Design System v2",
        subtitle: "Figma · Updated today",
        meta: "In progress",
        initials: "DS",
        initialsColor: "#ec4899",
        category: "files",
        source: "figma",
      },
      {
        id: "website-redesign",
        title: "Website Redesign",
        subtitle: "Figma · Due next week",
        meta: "Review",
        initials: "WR",
        initialsColor: "#6366f1",
        category: "files",
        source: "figma",
      },
    ],
  },
  {
    id: "actions",
    title: "Quick Actions",
    items: [
      {
        id: "new-project",
        title: "Create new project",
        icon: <IconRocket size={16} className="text-primary" />,
        category: "task",
      },
      {
        id: "invite",
        title: "Invite team members",
        icon: <IconUsers size={16} className="text-primary" />,
        category: "people",
      },
      {
        id: "settings",
        title: "Open settings",
        icon: <IconSettings size={16} />,
        category: "pages",
      },
    ],
  },
];

// Custom Modal UI built with the context
function CustomCommandPalette({
  sourceTabs = [],
  filterTabs = [],
}: {
  sourceTabs?: CommandPaletteSourceTab[];
  filterTabs?: CommandPaletteFilterTab[];
}) {
  const {
    isOpen,
    close,
    query,
    setQuery,
    filteredSections,
    flatResults,
    highlightedIndex,
    moveUp,
    moveDown,
    selectHighlighted,
    selectItem,
    isLoading,
    activeSourceTab,
    setSourceTab,
    activeFilterTab,
    setFilterTab,
  } = useCommandPalette();

  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  // Auto‑focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (highlightedIndex >= 0 && listRef.current) {
      const element = listRef.current.children[highlightedIndex] as HTMLElement;
      element?.scrollIntoView({ block: "nearest" });
    }
  }, [highlightedIndex]);

  return (
    <div className=" w-full max-w-2xl bg-popover rounded-xl">
      {/* Search input */}
      <div className="flex items-center gap-2 p-3 border-b border-border">
        <InputGroup>
          <InputGroupAddon>
            <IconSearch size={18} className="text-muted-foreground" />
          </InputGroupAddon>
          <InputGroupInput
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
          />
          {isLoading && (
            <IconLoader2
              size={16}
              className="animate-spin text-muted-foreground"
            />
          )}
        </InputGroup>
      </div>

      {/* Source tabs (optional) */}
      {sourceTabs.length > 0 && (
        <div className="flex gap-1 p-2 border-b border-border/60 bg-muted/5">
          {sourceTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSourceTab(tab.id)}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-colors",
                activeSourceTab === tab.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {tab.logoSrc && (
                <img src={tab.logoSrc} alt="" className="w-4 h-4" />
              )}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Filter tabs (optional) */}
      {filterTabs.length > 0 && (
        <div className="flex gap-1 p-2 border-b border-border/60 bg-muted/5">
          {filterTabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilterTab(tab.id)}
              className={cn(
                "flex items-center gap-1 px-2.5 py-1 rounded-md text-xs transition-colors",
                activeFilterTab === tab.id
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted/60",
              )}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
        </div>
      )}

      {/* Results list */}
      <div ref={listRef} className="max-h-[400px] overflow-y-auto p-2">
        {filteredSections.length === 0 ? (
          <div className="py-8 text-center text-sm text-muted-foreground">
            No results found.
          </div>
        ) : (
          filteredSections.map((section) => (
            <div key={section.id} className="mb-4 last:mb-0">
              <div className="px-2 py-1 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                {section.title}
              </div>
              {section.items.map((item, idx) => {
                const globalIndex = flatResults.indexOf(item);
                const isHighlighted = globalIndex === highlightedIndex;
                return (
                  <button
                    key={item.id}
                    onClick={() => selectItem(item)}
                    onMouseEnter={() => {
                      // Could set highlighted index on hover
                    }}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors",
                      isHighlighted
                        ? "bg-primary/10 text-primary"
                        : "hover:bg-muted/40",
                    )}
                  >
                    {/* Avatar / Icon */}
                    <div className="shrink-0">
                      {typeof item.icon === "string" ? (
                        <img
                          src={item.icon}
                          alt=""
                          className="w-8 h-8 rounded-full"
                        />
                      ) : item.icon ? (
                        <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
                          {item.icon}
                        </div>
                      ) : item.initials ? (
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium text-white"
                          style={{
                            backgroundColor: item.initialsColor || "#6b7280",
                          }}
                        >
                          {item.initials}
                        </div>
                      ) : (
                        <div className="w-8 h-8 rounded-full bg-muted" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium truncate">
                          {item.title}
                        </span>
                        {item.meta && (
                          <span className="text-[10px] text-muted-foreground">
                            {item.meta}
                          </span>
                        )}
                      </div>
                      {item.subtitle && (
                        <p className="text-xs text-muted-foreground truncate">
                          {item.subtitle}
                        </p>
                      )}
                    </div>

                    {isHighlighted && (
                      <IconCornerDownLeft
                        size={14}
                        className="text-muted-foreground"
                      />
                    )}
                  </button>
                );
              })}
            </div>
          ))
        )}
      </div>

      {/* Footer with keyboard hints */}
      <div className="flex items-center justify-between px-3 py-2 border-t border-border bg-muted/5 text-[10px] text-muted-foreground">
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1">
            <IconArrowUp size={12} />
            <IconArrowDown size={12} />
            <span>Navigate</span>
          </span>
          <span className="flex items-center gap-1">
            <IconCornerDownLeft size={12} />
            <span>Select</span>
          </span>
        </div>
        <span>Esc to close</span>
      </div>
    </div>
  );
}

export function CommandPaletteShowcase() {
  return (
    <CommandPaletteProvider
      sections={SHOWCASE_SECTIONS}
      defaultOpen={false}
      onSelect={(item) => console.log("Custom UI selected:", item.title)}
    >
      <CustomCommandPalette
        sourceTabs={[
          { id: "all", label: "All" },
          {
            id: "figma",
            label: "Figma",
            logoSrc:
              "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
          },
          {
            id: "github",
            label: "GitHub",
            logoSrc:
              "https://upload.wikimedia.org/wikipedia/commons/9/91/Octicons-mark-github.svg",
          },
        ]}
        filterTabs={[
          { id: "all", label: "All" },
          { id: "people", label: "People", icon: <IconUser size={12} /> },
          { id: "files", label: "Files", icon: <IconFolder size={12} /> },
          { id: "task", label: "Tasks", icon: <IconCheckbox size={12} /> },
        ]}
      />
    </CommandPaletteProvider>
  );
}

// ─── Built‑in UI placeholder (just for the original demo) ────────────────────
// Since we removed CommandPaletteRoot, we need to provide the built‑in modal.
// I'll assume it's exported from the component; for simplicity I'll stub it.
function BuiltInPaletteUI({ sourceTabs, filterTabs }: any) {
  // This is just a placeholder — in reality you'd import the actual modal component
  return null;
}

// ─── Page Export ─────────────────────────────────────────────────────────────

export default function CommandPalettePage() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{
        CommandPaletteDemo,
        CommandPaletteShowcase,
      }}
    />
  );
}

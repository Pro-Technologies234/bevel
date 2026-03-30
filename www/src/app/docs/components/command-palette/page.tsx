"use client";

/**
 * Example usage — matches the screenshot exactly.
 * Drop this anywhere in your app.
 */

import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  type CommandPaletteSection,
  type CommandPaletteSourceTab,
  type CommandPaletteFilterTab,
} from "@/registry/command-palette";

import {
  IconUser,
  IconCheckbox,
  IconFile,
  IconFolder,
  IconBook,
  IconMail,
  IconPhoto,
} from "@tabler/icons-react";

// ─── Source tabs (integration icons) ─────────────────────────────────────────

const SOURCE_TABS: CommandPaletteSourceTab[] = [
  { id: "all", label: "All" },
  { id: "openai", label: "ChatGPT", logoSrc: "https://upload.wikimedia.org/wikipedia/commons/0/04/ChatGPT_logo.svg" },
  { id: "gmail", label: "Gmail", logoSrc: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg" },
  { id: "figma", label: "Figma", logoSrc: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg" },
  { id: "slack", label: "Slack", logoSrc: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg" },
];

// ─── Filter tabs (content types) ─────────────────────────────────────────────

const FILTER_TABS: CommandPaletteFilterTab[] = [
  { id: "all", label: "All" },
  { id: "people", label: "People", icon: <IconUser size={12} strokeWidth={1.8} /> },
  { id: "task", label: "Task", icon: <IconCheckbox size={12} strokeWidth={1.8} /> },
  { id: "pages", label: "Pages", icon: <IconFile size={12} strokeWidth={1.8} /> },
  { id: "files", label: "Files", icon: <IconFolder size={12} strokeWidth={1.8} /> },
  { id: "docs", label: "Docs", icon: <IconBook size={12} strokeWidth={1.8} /> },
  { id: "messages", label: "Messages", icon: <IconMail size={12} strokeWidth={1.8} /> },
  { id: "images", label: "Images", icon: <IconPhoto size={12} strokeWidth={1.8} /> },
];

// ─── Sections + items ─────────────────────────────────────────────────────────

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
        href: "/people/harper",
      },
      {
        id: "mason",
        title: "Mason Parker",
        subtitle: "parker@example.com",
        meta: "Applied AI Engineer",
        icon: "https://i.pravatar.cc/150?img=12",
        category: "people",
        href: "/people/mason",
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
        href: "/docs/q3-report",
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
        href: "/files/design-system",
      },
      {
        id: "onboarding-task",
        title: "Update onboarding flow",
        subtitle: "Due tomorrow",
        meta: "In progress",
        initials: "T",
        initialsColor: "#f59e0b",
        category: "task",
        href: "/tasks/onboarding",
      },
    ],
  },
];

// ─── Example page ─────────────────────────────────────────────────────────────

export default function CommandPaletteExample() {
  return (
    <CommandPaletteRoot
      sections={SECTIONS}
      sourceTabs={SOURCE_TABS}
      filterTabs={FILTER_TABS}
      defaultOpen={false}
      onSelect={(item) => {
        console.log("Selected:", item);
        if (item.href) window.location.href = item.href;
      }}
    >
      <div className="flex flex-col items-center justify-center min-h-screen gap-6">
        <div className="text-center flex flex-col gap-2">
          <h1 className="text-2xl font-semibold tracking-tight">
            Command Palette
          </h1>
          <p className="text-sm text-muted-foreground">
            Press{" "}
            <kbd className="text-xs bg-muted border border-border rounded px-1.5 py-0.5">
              ⌘K
            </kbd>{" "}
            to open
          </p>
        </div>

        <CommandPaletteTrigger
          label="Search people, tasks, docs..."
          className="w-72"
        />
      </div>
    </CommandPaletteRoot>
  );
}

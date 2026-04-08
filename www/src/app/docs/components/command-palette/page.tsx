"use client";

import pageData from "@/content/docs/command-palette.json";
import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  type CommandPaletteSection,
  type CommandPaletteSourceTab,
  type CommandPaletteFilterTab,
} from "@/components/bevelui/command-palette";
import {
  IconBook,
  IconCheckbox,
  IconFile,
  IconFolder,
  IconMail,
  IconPhoto,
  IconUser,
} from "@tabler/icons-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

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
  {
    id: "people",
    label: "People",
    icon: <IconUser size={12} strokeWidth={1.8} />,
  },
  {
    id: "task",
    label: "Tasks",
    icon: <IconCheckbox size={12} strokeWidth={1.8} />,
  },
  {
    id: "pages",
    label: "Pages",
    icon: <IconFile size={12} strokeWidth={1.8} />,
  },
  {
    id: "files",
    label: "Files",
    icon: <IconFolder size={12} strokeWidth={1.8} />,
  },
  { id: "docs", label: "Docs", icon: <IconBook size={12} strokeWidth={1.8} /> },
  {
    id: "messages",
    label: "Messages",
    icon: <IconMail size={12} strokeWidth={1.8} />,
  },
  {
    id: "images",
    label: "Images",
    icon: <IconPhoto size={12} strokeWidth={1.8} />,
  },
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

// ─── Demo ─────────────────────────────────────────────────────────────────────

function CommandPaletteDemo() {
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

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function CommandPalettePage() {
  return (
    <DocPageRenderer
      page={pageData as any}
      demoRegistry={{ CommandPaletteDemo }}
    />
  );
}

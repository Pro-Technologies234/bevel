"use client";

import * as React from "react";
import {
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
  IconBell,
  IconLayoutDashboard,
  IconChartBar,
  IconSettings,
  IconUsers,
  IconSearch,
} from "@tabler/icons-react";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOURCE_TABS: CommandPaletteSourceTab[] = [
  { id: "all", label: "All" },
  {
    id: "gmail",
    label: "Gmail",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/7/7e/Gmail_icon_%282020%29.svg",
  },
  {
    id: "figma",
    label: "Figma",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/3/33/Figma-logo.svg",
  },
  {
    id: "slack",
    label: "Slack",
    logoSrc: "https://upload.wikimedia.org/wikipedia/commons/d/d5/Slack_icon_2019.svg",
  },
];

const FILTER_TABS: CommandPaletteFilterTab[] = [
  { id: "all",      label: "All" },
  { id: "people",   label: "People",   icon: <IconUser size={12} /> },
  { id: "task",     label: "Tasks",    icon: <IconCheckbox size={12} /> },
  { id: "pages",    label: "Pages",    icon: <IconFile size={12} /> },
  { id: "files",    label: "Files",    icon: <IconFolder size={12} /> },
  { id: "docs",     label: "Docs",     icon: <IconBook size={12} /> },
  { id: "messages", label: "Messages", icon: <IconMail size={12} /> },
  { id: "images",   label: "Images",   icon: <IconPhoto size={12} /> },
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

// ─── Simulated app chrome ─────────────────────────────────────────────────────

const NAV_ITEMS = [
  { icon: IconLayoutDashboard, label: "Dashboard", active: true },
  { icon: IconChartBar,        label: "Analytics" },
  { icon: IconUsers,           label: "Team" },
  { icon: IconSettings,        label: "Settings" },
];

const METRICS = [
  { label: "MRR",          value: "$12,840", delta: "+8.2%",  up: true  },
  { label: "Active users", value: "3,204",   delta: "+5.1%",  up: true  },
  { label: "Churn rate",   value: "2.1%",    delta: "-0.4%",  up: false },
  { label: "Open tickets", value: "14",      delta: "+2",     up: false },
];

export function CommandPaletteDemo() {
  return (
    <CommandPaletteRoot
      sections={SECTIONS}
      sourceTabs={SOURCE_TABS}
      filterTabs={FILTER_TABS}
      defaultOpen={false}
      onSelect={(item) => console.log("Selected:", item.title)}
    >
      {/* Simulated app window */}
      <div className="w-full max-w-3xl rounded-xl border border-border bg-background overflow-hidden">
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-muted/20">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
              <span className="text-[9px] font-black text-black">B</span>
            </div>
            <span className="text-[13px] font-semibold tracking-tight">Acme Inc.</span>
          </div>

          <div className="flex items-center gap-2">
            {/* The actual palette trigger — styled as a search bar */}
            <CommandPaletteTrigger
              label="Search people, tasks, docs..."
              className="w-52 h-8 text-xs"
            />
            <button className="relative p-1.5 rounded-md hover:bg-muted transition-colors text-muted-foreground">
              <IconBell size={15} strokeWidth={1.8} />
              <span className="absolute top-1 right-1 w-1.5 h-1.5 rounded-full bg-primary" />
            </button>
            <div className="w-7 h-7 rounded-full bg-primary/20 border border-primary/30 flex items-center justify-center">
              <span className="text-[10px] font-bold text-primary">AC</span>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="flex">
          {/* Sidebar */}
          <aside className="hidden sm:flex flex-col gap-0.5 w-40 shrink-0 p-2 border-r border-border bg-muted/10">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.label}
                className={cn(
                  "flex items-center gap-2 px-2.5 py-1.5 rounded-md text-[12px] transition-colors w-full text-left",
                  item.active
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-muted-foreground hover:bg-muted/50"
                )}
              >
                <item.icon size={14} strokeWidth={item.active ? 2.2 : 1.8} />
                {item.label}
              </button>
            ))}
          </aside>

          {/* Main content */}
          <div className="flex-1 p-4 flex flex-col gap-4 min-w-0">
            {/* Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {METRICS.map((m) => (
                <div
                  key={m.label}
                  className="flex flex-col gap-1 p-3 rounded-lg bg-muted/30 border border-border/50"
                >
                  <span className="text-[10px] text-muted-foreground">{m.label}</span>
                  <span className="text-sm font-semibold tracking-tight">{m.value}</span>
                  <span className={cn("text-[10px] font-medium", m.up ? "text-emerald-400" : "text-rose-400")}>
                    {m.delta}
                  </span>
                </div>
              ))}
            </div>

            {/* Chart placeholder */}
            <div className="rounded-lg border border-border/50 bg-muted/20 p-3 flex flex-col gap-2">
              <span className="text-[10px] text-muted-foreground">Revenue over time</span>
              <div className="flex items-end gap-0.5 h-20">
                {[40, 65, 45, 80, 55, 90, 70, 85, 60, 95, 75, 88].map((h, i) => (
                  <div
                    key={i}
                    className="flex-1 rounded-t-sm bg-primary/20 hover:bg-primary/40 transition-colors"
                    style={{ height: `${h}%` }}
                  />
                ))}
              </div>
            </div>

            {/* Hint */}
            <p className="text-[11px] text-muted-foreground/50 text-center font-mono">
              Click the search bar above or press{" "}
              <kbd className="bg-muted border border-border rounded px-1 py-0.5 text-[10px]">⌘K</kbd>{" "}
              to open the command palette
            </p>
          </div>
        </div>
      </div>
    </CommandPaletteRoot>
  );
}

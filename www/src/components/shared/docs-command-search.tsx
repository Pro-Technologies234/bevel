"use client";

import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  type CommandPaletteSection,
  type CommandPaletteSourceTab,
  type CommandPaletteFilterTab,
} from "@/components/bevelui/command-palette";
import {
  IconRoute, // For Tours/Walkthroughs
  IconForms, // For Multi-step systems
  IconCalendar, // For Scheduler systems
  IconCommand, // For Palette systems
  IconLayoutCards, // For Kanban/Board systems
  IconShieldCheck, // For Auth/Onboarding systems
  IconBook,
} from "@tabler/icons-react";

// ─── Data ─────────────────────────────────────────────────────────────────────

const SOURCE_TABS: CommandPaletteSourceTab[] = [
  { id: "all", label: "All Systems" },
  { id: "core", label: "Core Lab" },
  { id: "pro", label: "Pro Systems" },
];

const FILTER_TABS: CommandPaletteFilterTab[] = [
  { id: "all", label: "All" },
  {
    id: "onboarding",
    label: "Onboarding",
    icon: <IconRoute size={12} strokeWidth={1.8} />,
  },
  {
    id: "forms",
    label: "Forms",
    icon: <IconForms size={12} strokeWidth={1.8} />,
  },
  {
    id: "productivity",
    label: "Productivity",
    icon: <IconCalendar size={12} strokeWidth={1.8} />,
  },
  {
    id: "navigation",
    label: "Navigation",
    icon: <IconCommand size={12} strokeWidth={1.8} />,
  },
];

const SECTIONS: CommandPaletteSection[] = [
  {
    id: "featured-systems",
    title: "Engineered Systems",
    items: [
      {
        id: "product-tour",
        title: "Product Tour Engine",
        subtitle: "Multi-step onboarding with state management",
        meta: "UX System",
        initials: "PT",
        initialsColor: "#6366f1",
        category: "onboarding",
        href: "/docs/components/product-tour",
      },
      {
        id: "multi-step-wizard",
        title: "Advanced Form Wizard",
        subtitle: "Validation, persistence, and branch logic",
        meta: "Logic System",
        initials: "FW",
        initialsColor: "#ec4899",
        category: "forms",
        href: "/docs/components/multi-step-wizard",
      },
    ],
  },
  {
    id: "components",
    title: "Productivity Kits",
    items: [
      //   {
      //     id: "scheduler",
      //     title: "Enterprise Scheduler",
      //     subtitle: "Full-scale drag & drop calendar system",
      //     meta: "Complex UI",
      //     initials: "ES",
      //     initialsColor: "#f59e0b",
      //     category: "productivity",
      //     href: "/docs/components/scheduler",
      //   },
      {
        id: "command-palette",
        title: "Command Palette",
        subtitle: "Global search and action orchestrator",
        meta: "Nav System",
        initials: "CP",
        initialsColor: "#10b981",
        category: "navigation",
        href: "/docs/components/command-palette",
      },
    ],
  },
];

export function DocsCommandSearch() {
  return (
    <CommandPaletteRoot
      sections={SECTIONS}
      sourceTabs={SOURCE_TABS}
      filterTabs={FILTER_TABS}
      defaultOpen={false}
      onSelect={(item) => (window.location.href = item.href || "#")}
    >
      <CommandPaletteTrigger
        label="Search documentation..."
        className="w-full md:w-72"
      />
    </CommandPaletteRoot>
  );
}

"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CommandPaletteRoot,
  CommandPaletteTrigger,
  useCommandPalette,
  type CommandPaletteSection,
} from "@/components/bevelui/command-palette";
import searchData from "@/content/docs-search-data.json";

// ─── Build sections from JSON ─────────────────────────────────────────────────

function buildSections(): CommandPaletteSection[] {
  return searchData.sections.map((section) => ({
    id: section.id,
    title: section.title,
    items: section.items.map((item) => ({
      id: item.id,
      title: item.title,
      subtitle: item.description,
      category: item.category,
      href: item.href,
    })),
  }));
}

const DOCS_SECTIONS = buildSections();

// ─── Inner trigger — reads from context for router navigation ─────────────────

function DocsSearchTrigger() {
  const router = useRouter();

  return (
    <CommandPaletteTrigger
      label="Search documentation..."
      className="w-full lg:w-64 rounded-full h-9"
      // onOpen={() => open()}
    />
  );
}

// ─── DocsCommandSearch ────────────────────────────────────────────────────────

export function DocsCommandSearch() {
  const router = useRouter();

  return (
    <CommandPaletteRoot
      sections={DOCS_SECTIONS}
      defaultOpen={false}
      onSelect={(item) => {
        if (item.href) router.push(item.href as string);
      }}
    >
      <DocsSearchTrigger />
    </CommandPaletteRoot>
  );
}

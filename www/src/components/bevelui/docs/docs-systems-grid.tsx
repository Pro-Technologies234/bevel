"use client";

import * as React from "react";
import { useState, useMemo } from "react";
import { DOCS_SYSTEMS, type DocsCategoryId } from "@/content/docs/manifest";
import { DocsComponentCard } from "./docs-component-card";
import { DocsCategoryFilter } from "./docs-category-filter";
import { IconSearch } from "@tabler/icons-react";

export function DocsSystemsGrid() {
  const [activeCategory, setActiveCategory] = useState<DocsCategoryId | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  const counts = useMemo(() => {
    const acc: Record<string, number> = { all: DOCS_SYSTEMS.length };
    DOCS_SYSTEMS.forEach((s) => {
      acc[s.category] = (acc[s.category] || 0) + 1;
    });
    return acc;
  }, []);

  const filteredSystems = useMemo(() => {
    return DOCS_SYSTEMS.filter((s) => {
      const matchesCategory =
        activeCategory === "all" || s.category === activeCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        s.title.toLowerCase().includes(q) ||
        s.description.toLowerCase().includes(q) ||
        s.useCases?.some((u) => u.toLowerCase().includes(q)) ||
        s.keywords?.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, searchQuery]);

  return (
    <div className="flex flex-col gap-6 my-6">
      {/* Search & Filter Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 pb-2 border-b border-border/40">
        <DocsCategoryFilter
          activeCategory={activeCategory}
          onSelectCategory={setActiveCategory}
          counts={counts}
        />

        {/* Local Search Input */}
        <div className="relative shrink-0 sm:w-64">
          <IconSearch
            size={14}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
          />
          <input
            type="text"
            placeholder="Search systems..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-muted/30 border border-border/50 rounded-full pl-9 pr-4 py-1.5 text-xs text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>
      </div>

      {/* Grid */}
      {filteredSystems.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredSystems.map((system) => (
            <DocsComponentCard key={system.route} system={system} />
          ))}
        </div>
      ) : (
        <div className="py-16 text-center border border-dashed border-border/60 rounded-2xl bg-muted/10 flex flex-col items-center justify-center gap-2">
          <p className="text-sm font-medium text-foreground">No systems found</p>
          <p className="text-xs text-muted-foreground">
            Try adjusting your search query or category filter.
          </p>
        </div>
      )}
    </div>
  );
}

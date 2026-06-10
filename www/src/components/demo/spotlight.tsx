"use client";

import * as React from "react";
import {
  SpotlightRoot,
  useSpotlight,
  type SpotlightResult,
} from "@/components/bevelui/spotlight";
import {
  IconUser,
  IconFolder,
  IconFileText,
  IconCode,
  IconSettings,
  IconSearch,
  IconWorldSearch,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { Kbd } from "../ui/kbd";

// ─── Fake data ────────────────────────────────────────────────────────────────

const PEOPLE: SpotlightResult[] = [
  {
    id: "u1",
    title: "Alice Chen",
    subtitle: "alice@example.com",
    category: "people",
    icon: IconUser,
    badge: "Admin",
  },
  {
    id: "u2",
    title: "Bob Martinez",
    subtitle: "bob@example.com",
    category: "people",
    icon: IconUser,
    badge: "Member",
  },
  {
    id: "u3",
    title: "Sara Williams",
    subtitle: "sara@example.com",
    category: "people",
    icon: IconUser,
    badge: "Member",
  },
  {
    id: "u4",
    title: "James Okafor",
    subtitle: "james@example.com",
    category: "people",
    icon: IconUser,
  },
];

const PROJECTS: SpotlightResult[] = [
  {
    id: "p1",
    title: "Bevel UI",
    subtitle: "Component systems library",
    category: "projects",
    icon: IconFolder,
    badge: "Active",
  },
  {
    id: "p2",
    title: "Dashboard v2",
    subtitle: "Analytics redesign",
    category: "projects",
    icon: IconFolder,
    badge: "Draft",
  },
  {
    id: "p3",
    title: "Mobile App",
    subtitle: "React Native project",
    category: "projects",
    icon: IconFolder,
    badge: "Paused",
  },
];

const DOCS: SpotlightResult[] = [
  {
    id: "d1",
    title: "Product Tour Docs",
    subtitle: "Installation and API reference",
    category: "docs",
    icon: IconFileText,
  },
  {
    id: "d2",
    title: "Form Engine Guide",
    subtitle: "Multi-step form walkthrough",
    category: "docs",
    icon: IconFileText,
  },
  {
    id: "d3",
    title: "Quick Start",
    subtitle: "Get up and running in 5 minutes",
    category: "docs",
    icon: IconFileText,
  },
  {
    id: "d4",
    title: "Theming Guide",
    subtitle: "CSS variables and dark mode",
    category: "docs",
    icon: IconCode,
  },
  {
    id: "d5",
    title: "Settings — General",
    subtitle: "Account and workspace settings",
    category: "docs",
    icon: IconSettings,
  },
];

const ALL = [...PEOPLE, ...PROJECTS, ...DOCS];

async function fakeSearch(
  query: string,
  signal: AbortSignal,
): Promise<SpotlightResult[]> {
  await new Promise<void>((res, rej) => {
    const t = setTimeout(res, 250 + Math.random() * 150);
    signal.addEventListener("abort", () => {
      clearTimeout(t);
      rej(new DOMException("Aborted"));
    });
  });
  const q = query.toLowerCase();
  return ALL.filter(
    (r) =>
      r.title.toLowerCase().includes(q) ||
      (r.subtitle ?? "").toLowerCase().includes(q),
  );
}

// ─── Inner ────────────────────────────────────────────────────────────────────

function SpotlightDemoInner() {
  const { open } = useSpotlight();

  return (
    <div className="flex flex-col items-center gap-5 py-8 px-4">
      <div className="flex flex-col items-center gap-2 text-center">
        <div className="w-12 h-12 rounded-xl bg-muted/40 border border-border flex items-center justify-center">
          <IconWorldSearch />
        </div>
        <p className="text-3xl font-medium text-foreground font-sans">
          Spotlight Search
        </p>
        <p className="text-sm text-muted-foreground max-w-md">
          Async content search with categories and recent history. Distinct from
          Command Palette — results come from your API.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Button variant="outline" onClick={open} className="rounded-full px-4">
          <IconWorldSearch />
          Open spotlight search
        </Button>
        <span className="text-[11px] text-muted-foreground">or press</span>
        <Kbd className="text-[11px] font-mono p-3 h-8  border border-border bg-muted/80 text-white ">
          /
        </Kbd>
      </div>

      <p className="text-[11px] text-muted-foreground/50 font-mono">
        Try searching "alice", "dashboard", "form", "guide"
      </p>
    </div>
  );
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function SpotlightDemo() {
  return (
    <SpotlightRoot
      config={{
        categories: [
          { id: "people", label: "People", icon: IconUser },
          { id: "projects", label: "Projects", icon: IconFolder },
          { id: "docs", label: "Docs", icon: IconFileText },
        ],
        hotkey: "/",
        placeholder: "Search people, projects, docs…",
        storageKey: "demo-spotlight-history",
      }}
      onSearch={fakeSearch}
    >
      <SpotlightDemoInner />
    </SpotlightRoot>
  );
}

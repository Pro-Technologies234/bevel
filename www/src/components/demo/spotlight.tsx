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
  IconBell,
  IconLayoutDashboard,
  IconChartBar,
  IconUsers,
} from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// ─── Data ─────────────────────────────────────────────────────────────────────

const PEOPLE: SpotlightResult[] = [
  { id: "u1", title: "Alice Chen",      subtitle: "alice@example.com",  category: "people",   icon: IconUser, badge: "Admin"  },
  { id: "u2", title: "Bob Martinez",    subtitle: "bob@example.com",    category: "people",   icon: IconUser, badge: "Member" },
  { id: "u3", title: "Sara Williams",   subtitle: "sara@example.com",   category: "people",   icon: IconUser, badge: "Member" },
  { id: "u4", title: "James Okafor",    subtitle: "james@example.com",  category: "people",   icon: IconUser },
];

const PROJECTS: SpotlightResult[] = [
  { id: "p1", title: "Bevel UI",        subtitle: "Component systems library",  category: "projects", icon: IconFolder, badge: "Active" },
  { id: "p2", title: "Dashboard v2",    subtitle: "Analytics redesign",          category: "projects", icon: IconFolder, badge: "Draft"  },
  { id: "p3", title: "Mobile App",      subtitle: "React Native project",        category: "projects", icon: IconFolder, badge: "Paused" },
];

const DOCS: SpotlightResult[] = [
  { id: "d1", title: "Product Tour Docs",    subtitle: "Installation and API reference",  category: "docs", icon: IconFileText },
  { id: "d2", title: "Form Engine Guide",    subtitle: "Multi-step form walkthrough",     category: "docs", icon: IconFileText },
  { id: "d3", title: "Quick Start",          subtitle: "Get up and running in 5 minutes", category: "docs", icon: IconFileText },
  { id: "d4", title: "Theming Guide",        subtitle: "CSS variables and dark mode",     category: "docs", icon: IconCode     },
  { id: "d5", title: "Settings — General",   subtitle: "Account and workspace settings",  category: "docs", icon: IconSettings },
];

const ALL = [...PEOPLE, ...PROJECTS, ...DOCS];

async function fakeSearch(query: string, signal: AbortSignal): Promise<SpotlightResult[]> {
  await new Promise<void>((res, rej) => {
    const t = setTimeout(res, 200 + Math.random() * 120);
    signal.addEventListener("abort", () => { clearTimeout(t); rej(new DOMException("Aborted")); });
  });
  const q = query.toLowerCase();
  return ALL.filter(
    (r) => r.title.toLowerCase().includes(q) || (r.subtitle ?? "").toLowerCase().includes(q)
  );
}

// ─── Nav items for the simulated app ──────────────────────────────────────────

const NAV_ITEMS = [
  { icon: IconLayoutDashboard, label: "Dashboard", active: true },
  { icon: IconChartBar,        label: "Analytics" },
  { icon: IconUsers,           label: "Team" },
  { icon: IconSettings,        label: "Settings" },
];

// ─── Inner ────────────────────────────────────────────────────────────────────

function SpotlightDemoInner() {
  const { open } = useSpotlight();

  return (
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
          <button
            onClick={open}
            className="flex items-center gap-2 h-8 px-3 rounded-lg border border-border bg-muted/30 text-[11px] text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors"
          >
            <IconSearch size={12} />
            <span className="hidden sm:inline">Search anything...</span>
            <kbd className="ml-1 bg-muted border border-border rounded px-1.5 py-0.5 text-[9px] font-mono">/</kbd>
          </button>
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
        <div className="flex-1 flex flex-col items-center justify-center gap-5 p-8 min-h-[280px]">
          <div className="w-14 h-14 rounded-2xl bg-muted/40 border border-border flex items-center justify-center">
            <IconSearch size={22} className="text-muted-foreground" strokeWidth={1.5} />
          </div>
          <div className="flex flex-col items-center gap-1.5 text-center">
            <p className="text-base font-semibold text-foreground">Spotlight Search</p>
            <p className="text-[12px] text-muted-foreground max-w-xs leading-relaxed">
              Async content search with categories and recent history. Results come from your API.
            </p>
          </div>
          <Button variant="outline" onClick={open} className="rounded-full px-5 gap-2">
            <IconSearch size={13} />
            Open spotlight
            <kbd className="ml-1 bg-muted border border-border rounded px-1.5 py-0.5 text-[9px] font-mono">/</kbd>
          </Button>
          <p className="text-[10px] text-muted-foreground/40 font-mono">
            Try: "alice" · "dashboard" · "form" · "guide"
          </p>
        </div>
      </div>
    </div>
  );
}

// ─── Demo ─────────────────────────────────────────────────────────────────────

export function SpotlightDemo() {
  return (
    <SpotlightRoot
      config={{
        categories: [
          { id: "people",   label: "People",   icon: IconUser     },
          { id: "projects", label: "Projects", icon: IconFolder   },
          { id: "docs",     label: "Docs",     icon: IconFileText },
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

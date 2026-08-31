"use client";

import * as React from "react";
import { DocsShell } from "./docs-shell";
import { useDocsChrome } from "./docs-chrome-context";
import { buildDocsSidebarSections } from "@/content/docs/manifest";
import { ThemeToggle } from "./theme-toggle";

// Built once at module scope, not per render — it's derived from the static
// manifest, not from any page-specific state.
const SIDEBAR_SECTIONS = buildDocsSidebarSections();

export function DocsLayoutShell({ children }: { children: React.ReactNode }) {
  const { chrome } = useDocsChrome();

  return (
    <DocsShell
      sections={SIDEBAR_SECTIONS}
      activeItem={chrome.activeItem}
      toc={chrome.toc}
      breadcrumb={chrome.breadcrumb}
      githubHref="https://github.com/your-org/bevel-ui"
      // Was never set before, which was half of why the desktop topbar read
      // as empty — the other half was DocsTopbar hiding its own logo/search
      // at lg:hidden, fixed directly in docs-topbar.tsx.
      topbarRightSlot={<ThemeToggle />}
    >
      {children}
    </DocsShell>
  );
}

"use client";

import * as React from "react";
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { DocTocItem } from "./docs-toc";
import type { DocsBreadcrumbItem } from "./docs-shell";

/**
 * Your pages are manual, one folder per route — not a dynamic [...slug]
 * page — so there's no single place that naturally knows "what page is
 * this" the way a catch-all route would. This context is that place: it
 * lives once in app/docs/layout.tsx (via DocsLayoutShell below), and each
 * page registers its own sidebar active-item, TOC, and breadcrumb into it
 * on mount — which is exactly what DocPageRenderer does automatically, so
 * a system's page component doesn't have to think about layout chrome at
 * all, only its content.
 */

export type DocsChrome = {
  activeItem?: string;
  toc: DocTocItem[];
  breadcrumb: DocsBreadcrumbItem[];
};

const DEFAULT_CHROME: DocsChrome = { toc: [], breadcrumb: [] };

const DocsChromeContext = createContext<{
  chrome: DocsChrome;
  setChrome: (chrome: DocsChrome) => void;
} | null>(null);

export function DocsChromeProvider({ children }: { children: React.ReactNode }) {
  const [chrome, setChrome] = useState<DocsChrome>(DEFAULT_CHROME);
  const value = useMemo(() => ({ chrome, setChrome }), [chrome]);
  return (
    <DocsChromeContext.Provider value={value}>{children}</DocsChromeContext.Provider>
  );
}

export function useDocsChrome() {
  const ctx = useContext(DocsChromeContext);
  if (!ctx) {
    throw new Error(
      "useDocsChrome must be used within <DocsChromeProvider>. This should only happen if something under app/docs renders outside app/docs/layout.tsx.",
    );
  }
  return ctx;
}

/**
 * Call once per page — DocPageRenderer does this for you using the page's
 * own meta/tocs, and the landing grid calls it directly since it has no
 * DocPage to read from. Resets to empty on unmount so navigating to a page
 * that doesn't register anything (or a slow-loading one) doesn't leave the
 * previous page's TOC/breadcrumb showing.
 */
export function useRegisterDocsChrome(chrome: DocsChrome) {
  const { setChrome } = useDocsChrome();

  // Deps as a primitive key: chrome.toc/breadcrumb are frequently new array
  // literals each render (e.g. DocPageRenderer builds breadcrumb inline), so
  // comparing by reference would re-run this every render. Comparing by the
  // actual ids/labels inside is cheap and correct for these small arrays.
  const key = [
    chrome.activeItem ?? "",
    chrome.toc.map((t) => t.id).join(","),
    chrome.breadcrumb.map((b) => b.label).join(","),
  ].join("|");

  useEffect(() => {
    setChrome(chrome);
    return () => setChrome(DEFAULT_CHROME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);
}

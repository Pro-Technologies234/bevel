"use client";

import * as React from "react";
import type { DocPage } from "@/content/docs/doc-schema";
import { DocsPageHeader, DocsPageFooterNav } from "@/components/shared/docs-page-header";
import { useRegisterDocsChrome } from "@/components/shared/docs-chrome-context";
import { DocContentRenderer } from "./docs-content/doc-content-renderer";
import type { DemoRegistry } from "./docs-content/demo-block";

/**
 * The single renderer every XContent component calls:
 *
 *   <DocPageRenderer page={pageData as any} demoRegistry={{ TourDemo }} />
 *
 * It does three things:
 *  1. Registers this page's sidebar active-item, TOC, and breadcrumb with
 *     the layout-level DocsShell (via useRegisterDocsChrome) — this is what
 *     lets your pages stay this minimal without each one rendering
 *     <DocsShell> itself.
 *  2. Renders the page header (title, tier badge, install command, "Copy
 *     page" button).
 *  3. Dispatches every section's blocks to the right component.
 */
export function DocPageRenderer({
  page,
  demoRegistry,
}: {
  page: DocPage;
  demoRegistry?: DemoRegistry;
}) {
  useRegisterDocsChrome({
    activeItem: page.meta.title,
    toc: page.tocs,
    breadcrumb: [
      { label: "Docs", href: "/docs" },
      ...(page.meta.category ? [{ label: page.meta.category }] : []),
      { label: page.meta.title },
    ],
  });

  return (
    <div className="mx-auto flex max-w-3xl flex-col gap-8">
      <DocsPageHeader meta={page.meta} page={page} />
      <DocContentRenderer sections={page.sections} demoRegistry={demoRegistry} />
      <DocsPageFooterNav meta={page.meta} />
    </div>
  );
}

"use client";

import * as React from "react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconChevronRight } from "@tabler/icons-react";
import { BevelSidebar, type SidebarSection } from "./sidebar";
import { DocsMobileNav } from "./docs-mobile-nav";
import { DocsTopbar } from "./docs-topbar";
import { DocsToc, DocsMobileToc, type DocTocItem } from "./docs-toc";

export type DocsBreadcrumbItem = {
  label: string;
  href?: string;
};

export type DocsShellProps = {
  sections: SidebarSection[];
  toc?: DocTocItem[];
  activeItem?: string;
  breadcrumb?: DocsBreadcrumbItem[];
  githubHref?: string;
  /** Extra controls in the topbar — theme toggle, version switcher, CTA, etc. */
  topbarRightSlot?: React.ReactNode;
  children: React.ReactNode;
};

function DocsBreadcrumb({ items }: { items: DocsBreadcrumbItem[] }) {
  if (items.length === 0) return null;

  return (
    <nav
      aria-label="Breadcrumb"
      className="flex items-center gap-1 overflow-x-auto whitespace-nowrap font-mono text-[11px] text-muted-foreground/80"
    >
      {items.map((item, i) => {
        const isLast = i === items.length - 1;
        return (
          <React.Fragment key={item.label + i}>
            {i > 0 && (
              <IconChevronRight
                size={11}
                strokeWidth={2}
                className="shrink-0 text-muted-foreground/50"
              />
            )}
            {item.href && !isLast ? (
              <Link href={item.href} className="shrink-0 hover:text-foreground">
                {item.label}
              </Link>
            ) : (
              <span
                className={cn("shrink-0", isLast && "text-foreground")}
                aria-current={isLast ? "page" : undefined}
              >
                {item.label}
              </span>
            )}
          </React.Fragment>
        );
      })}
    </nav>
  );
}

export function DocsShell({
  sections,
  toc = [],
  activeItem,
  breadcrumb = [],
  githubHref,
  topbarRightSlot,
  children,
}: DocsShellProps) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <DocsTopbar
        onMenuClick={() => setMobileNavOpen(true)}
        githubHref={githubHref}
        rightSlot={topbarRightSlot}
      />

      <DocsMobileNav
        sections={sections}
        open={mobileNavOpen}
        onOpenChange={setMobileNavOpen}
        activeItem={activeItem}
      />

      <div className="mx-auto flex w-full max-w-[1440px]">
        {/* Desktop sidebar rail */}
        <div className="hidden w-[240px] shrink-0 lg:block xl:w-[264px]">
          <BevelSidebar
            sections={sections}
            activeItem={activeItem}
            hideHeader
            className="sticky top-[calc(3.5rem+1px)] h-[calc(100vh-3.5rem-1px)]"
          />
        </div>

        {/* Content column — width is controlled by children, not this shell.
            Doc pages wrap in max-w-3xl for reading width; the landing page
            uses max-w-5xl for its card grid. Only the breadcrumb/mobile TOC
            rendered here are capped, since they belong to the shell. */}
        <main className="min-w-0 flex-1 px-4 py-6 sm:px-6 lg:px-10 lg:py-10">
          {breadcrumb.length > 0 && (
            <div className="mx-auto mb-5 max-w-3xl">
              <DocsBreadcrumb items={breadcrumb} />
            </div>
          )}
          {toc.length > 0 && (
            <div className="mx-auto mb-5 max-w-3xl">
              <DocsMobileToc items={toc} className="xl:hidden" />
            </div>
          )}
          {children}
        </main>

        {/* Desktop TOC rail */}
        <DocsToc items={toc} />
      </div>
    </div>
  );
}

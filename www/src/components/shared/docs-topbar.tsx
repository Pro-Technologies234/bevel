"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconMenu2, IconBrandGithub } from "@tabler/icons-react";
import { Button } from "@/components/ui/button";
import { DocsCommandSearch } from "../bevelui/docs/docs-command-search";
import { BrandMark } from "./brand-mark";

export type DocsTopbarNavItem = {
  id: string;
  label: string;
  href: string;
};

// Same three destinations as the main site navbar's `navigations` list,
// minus "Intro" duplicated as a hardcoded default here would drift from that
// file over time — pass `siteNav` explicitly from wherever you already have
// that array if you'd rather share one source of truth.
const DEFAULT_SITE_NAV: DocsTopbarNavItem[] = [
  { id: "intro", label: "Intro", href: "/" },
  { id: "docs", label: "Documentation", href: "/docs/introduction" },
  { id: "systems", label: "Systems", href: "/docs/components" },
];

export type DocsTopbarProps = {
  onMenuClick: () => void;
  githubHref?: string;
  /** Top-level site links shown at lg+, next to the logo. Defaults to Intro/Documentation/Systems. */
  siteNav?: DocsTopbarNavItem[];
  /** Extra controls rendered on the right — theme toggle, version switcher, CTA, etc. */
  rightSlot?: React.ReactNode;
  className?: string;
};

/**
 * Reads scroll progress of the whole document and exposes it as a width %
 * on a 2px hairline pinned to the bottom of the topbar. This is the same
 * "progress" motif echoed in the sidebar active-bar and the TOC rail —
 * it's how the dense/technical direction communicates "where am I" without
 * spending any vertical space.
 */
function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const ticking = useRef(false);

  useEffect(() => {
    const onScroll = () => {
      if (ticking.current) return;
      ticking.current = true;
      requestAnimationFrame(() => {
        const scrollTop = window.scrollY;
        const docHeight =
          document.documentElement.scrollHeight - window.innerHeight;
        setProgress(docHeight > 0 ? Math.min(1, scrollTop / docHeight) : 0);
        ticking.current = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return progress;
}

export function DocsTopbar({
  onMenuClick,
  githubHref,
  siteNav = DEFAULT_SITE_NAV,
  rightSlot,
  className,
}: DocsTopbarProps) {
  const progress = useScrollProgress();
  const pathname = usePathname();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4 lg:px-6">
        {/* Hamburger — only below lg, where the sidebar rail isn't shown */}
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground lg:hidden"
        >
          <IconMenu2 size={19} strokeWidth={1.9} />
        </button>

        {/* Logo — visible at every width now, not just mobile. The sidebar
            below it doesn't carry a logo/search of its own (hideHeader is
            set on <BevelSidebar> in DocsShell), so this is the only place
            either lives — it needs to actually be there on desktop. */}
        <Link href="/" className="flex shrink-0 items-center gap-2">
          <BrandMark />
        </Link>

        {/* Site-level nav — same destinations as the main navbar, shown at
            lg+ once there's room next to the logo and the docs sidebar. */}
        <nav className="hidden items-center gap-1 lg:flex">
          {siteNav.map((item) => {
            const isActive =
              pathname === item.href ||
              (item.href !== "/" && pathname.startsWith(item.href));
            return (
              <Link key={item.id} href={item.href}>
                <Button size={"sm"} variant={isActive ? "default" : "ghost"}>
                  {item.label}
                </Button>
              </Link>
            );
          })}
        </nav>

        {/* Search — visible from sm up at every width, including desktop.
            DocsCommandSearch sets its own lg:w-64 internally once it's past
            sm, so the wrapper only needs to cap width in the sm–lg range
            before that kicks in. */}
        <div className="hidden flex-1 sm:block sm:ml-auto sm:max-w-[220px] lg:max-w-none">
          <DocsCommandSearch className="w-full" />
        </div>

        <div className="ml-auto flex shrink-0 items-center gap-1.5">
          {githubHref && (
            <Link
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              aria-label="View on GitHub"
            >
              <Button
                variant="ghost"
                size="icon"
                className="hidden h-9 w-9 rounded-full text-muted-foreground hover:text-foreground sm:flex"
              >
                <IconBrandGithub size={18} strokeWidth={1.9} />
              </Button>
            </Link>
          )}
          {rightSlot}
        </div>
      </div>

      {/* Scroll-progress hairline */}
      <div className="h-px w-full bg-border/70">
        <div
          className="h-px bg-primary transition-[width] duration-150 ease-out"
          style={{ width: `${progress * 100}%` }}
        />
      </div>
    </header>
  );
}

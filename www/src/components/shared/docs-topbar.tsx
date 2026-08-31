"use client";

import * as React from "react";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { IconMenu2, IconBrandGithub } from "@tabler/icons-react";
import { DocsCommandSearch } from "../bevelui/docs/docs-command-search";
import { BrandMark } from "./brand-mark";

export type DocsTopbarProps = {
  onMenuClick: () => void;
  githubHref?: string;
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
  rightSlot,
  className,
}: DocsTopbarProps) {
  const progress = useScrollProgress();

  return (
    <header
      className={cn(
        "sticky top-0 z-40 border-b border-border/70 bg-background/85 backdrop-blur-md",
        className,
      )}
    >
      <div className="flex h-14 items-center gap-3 px-3 sm:px-4">
        <button
          type="button"
          onClick={onMenuClick}
          aria-label="Open navigation"
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground lg:hidden"
        >
          <IconMenu2 size={19} strokeWidth={1.9} />
        </button>

        <Link href="/" className="flex shrink-0 items-center gap-2 lg:hidden">
          <BrandMark />
        </Link>

        <div className="hidden flex-1 max-w-md sm:block lg:hidden">
          <DocsCommandSearch className="w-full" />
        </div>

        <div className="ml-auto flex items-center gap-2">
          {githubHref && (
            <Link
              href={githubHref}
              target="_blank"
              rel="noreferrer"
              aria-label="View on GitHub"
              className="hidden h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground sm:flex"
            >
              <IconBrandGithub size={17} strokeWidth={1.9} />
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

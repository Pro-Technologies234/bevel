"use client";

import * as React from "react";
import { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { AnimatePresence, motion } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import type { DocTOCItem } from "@/content/docs/doc-schema";

// Alias kept for readability in this file and call sites that predate the
// schema import — same shape as the canonical DocTOCItem from doc-schema.
export type DocTocItem = DocTOCItem;

function useActiveHeading(items: DocTocItem[]) {
  const [activeId, setActiveId] = useState<string | undefined>(items[0]?.id);

  useEffect(() => {
    if (items.length === 0) return;

    const elements = items
      .map((item) => document.getElementById(item.id))
      .filter((el): el is HTMLElement => Boolean(el));

    if (elements.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible.length > 0) {
          setActiveId(visible[0].target.id);
        }
      },
      {
        rootMargin: "-96px 0px -70% 0px",
        threshold: [0, 1],
      },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, [items]);

  return activeId;
}

function TocLinks({
  items,
  activeId,
  onNavigate,
}: {
  items: DocTocItem[];
  activeId?: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5 border-l border-border/70">
      {items.map((item) => {
        const isActive = item.id === activeId;
        const depth = item.depth ?? 1;
        return (
          <li key={item.id} style={{ paddingLeft: (depth - 1) * 10 }}>
            <a
              href={`#${item.id}`}
              onClick={onNavigate}
              data-active={isActive || undefined}
              className={cn(
                "relative block py-1 pl-3 text-[12.5px] leading-snug transition-colors",
                "-ml-px border-l",
                isActive
                  ? "border-primary font-medium text-foreground"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground",
              )}
            >
              {item.label}
            </a>
          </li>
        );
      })}
    </ul>
  );
}

// ─── Desktop rail ─────────────────────────────────────────────────────────────

export function DocsToc({
  items,
  className,
}: {
  items: DocTocItem[];
  className?: string;
}) {
  const activeId = useActiveHeading(items);

  if (items.length === 0) return null;

  return (
    <aside
      className={cn(
        "sticky top-[calc(3.5rem+1px)] hidden h-fit max-h-[calc(100vh-4.5rem)] w-56 shrink-0 overflow-y-auto py-8 pl-6 xl:block",
        className,
      )}
    >
      <p className="mb-2.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
        On this page
      </p>
      <TocLinks items={items} activeId={activeId} />
    </aside>
  );
}

// ─── Mobile accordion ─────────────────────────────────────────────────────────
// Sits at the top of the content column below 1280px, where there's no room
// for a persistent right rail.

export function DocsMobileToc({
  items,
  className,
}: {
  items: DocTocItem[];
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const activeId = useActiveHeading(items);
  const activeLabel = items.find((i) => i.id === activeId)?.label;

  if (items.length === 0) return null;

  return (
    <div
      className={cn(
        "rounded-md border border-border/70 bg-card/60 xl:hidden",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-2 px-3 py-2"
      >
        <span className="flex min-w-0 items-center gap-1.5 font-mono text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/80">
          On this page
          {activeLabel && (
            <span className="truncate font-sans text-[12px] normal-case tracking-normal text-foreground">
              — {activeLabel}
            </span>
          )}
        </span>
        <IconChevronDown
          size={14}
          strokeWidth={2}
          className={cn(
            "shrink-0 text-muted-foreground transition-transform duration-150",
            open && "rotate-180",
          )}
        />
      </button>

      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.15, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="px-3 pb-3 pt-1">
              <TocLinks
                items={items}
                activeId={activeId}
                onNavigate={() => setOpen(false)}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

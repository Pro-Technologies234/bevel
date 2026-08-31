"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { IconX } from "@tabler/icons-react";
import { DocsCommandSearch } from "../bevelui/docs/docs-command-search";
import { BrandMark } from "./brand-mark";
import { DocsNavList, type SidebarAction, type SidebarSection } from "./sidebar";

export type DocsMobileNavProps = {
  sections: SidebarSection[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activeItem?: string;
};

export function DocsMobileNav({
  sections,
  open,
  onOpenChange,
  activeItem,
}: DocsMobileNavProps) {
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      sections.reduce(
        (acc, s) => ({ ...acc, [s.label]: s.defaultOpen ?? true }),
        {},
      ),
  );

  const toggleSection = useCallback((label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  // Close on route change
  useEffect(() => {
    onOpenChange(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  // Lock body scroll + close on Escape while open
  useEffect(() => {
    if (!open) return;
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onOpenChange(false);
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onOpenChange]);

  function handleAction(action: SidebarAction) {
    if (action.disabled) return;
    action.onClick?.();
    onOpenChange(false);
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => onOpenChange(false)}
            className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm lg:hidden"
            aria-hidden
          />

          {/* Drawer */}
          <motion.div
            key="drawer"
            role="dialog"
            aria-modal="true"
            aria-label="Documentation navigation"
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 420, damping: 40 }}
            className={cn(
              "fixed inset-y-0 left-0 z-50 flex w-[85vw] max-w-[340px] flex-col",
              "bg-card border-r border-border/70 lg:hidden",
            )}
          >
            <div className="flex items-center justify-between gap-2 border-b border-border/70 px-4 py-3">
              <Link href="/" className="flex shrink-0 items-center gap-2">
                <BrandMark />
              </Link>
              <button
                type="button"
                onClick={() => onOpenChange(false)}
                aria-label="Close navigation"
                className="flex h-8 w-8 items-center justify-center rounded-md text-muted-foreground hover:bg-muted/60 hover:text-foreground"
              >
                <IconX size={18} strokeWidth={1.9} />
              </button>
            </div>

            <div className="px-4 py-3">
              <DocsCommandSearch className="w-full" />
            </div>

            <div className="flex-1 overflow-y-auto px-2 pb-8">
              <DocsNavList
                sections={sections}
                active={activeItem}
                onSelect={handleAction}
                openSections={openSections}
                onToggleSection={toggleSection}
                scrollActiveIntoView
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

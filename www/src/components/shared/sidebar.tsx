"use client";

import * as React from "react";
import { useState, useCallback, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { IconChevronDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { DocsCommandSearch } from "../bevelui/docs/docs-command-search";
import { BrandMark } from "./brand-mark";

// ─── Types ────────────────────────────────────────────────────────────────────
// Kept stable — manifest.ts and other call sites depend on these shapes.

export type SidebarAction = {
  label: string;
  href?: string;
  /** Short badge label e.g. "New", "Beta", "Soon" */
  badge?: string;
  /** Colour of the badge. Defaults to neutral */
  badgeVariant?:
    | "primary"
    | "new"
    | "indigo"
    | "green"
    | "amber"
    | "red"
    | "pro";
  disabled?: boolean;
  /** Optional icon next to the label */
  icon?: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  onClick?: () => void;
};

export type SidebarSection = {
  label: string;
  /** Tabler icon shown next to the section label */
  icon?: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  /** Whether this section can be collapsed. Default true */
  collapsible?: boolean;
  /** Whether this section starts open. Default true */
  defaultOpen?: boolean;
  actions: SidebarAction[];
};

export type BevelSidebarProps = {
  sections: SidebarSection[];
  /** Externally controlled active item label */
  activeItem?: string;
  onActiveChange?: (label: string) => void;
  className?: string;
  /** Hide the logo/search header — used when the shell renders its own topbar */
  hideHeader?: boolean;
};

// ─── Badge colours ────────────────────────────────────────────────────────────
// Flat, subdued fills — no gradients. Reads as data, not decoration.

const BADGE_CLASSES: Record<
  NonNullable<SidebarAction["badgeVariant"]>,
  string
> = {
  new: "bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-500/20",
  primary: "bg-primary/10 text-primary border-primary/20",
  indigo: "bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20",
  green: "bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  amber: "bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20",
  red: "bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20",
  pro: "bg-amber-500/10 text-amber-600 dark:text-amber-500 border-amber-500/20",
};

// ─── Shared nav list ──────────────────────────────────────────────────────────
// Rendered by both the desktop rail and the mobile drawer, so the two navs
// never drift apart visually.

function NavItem({
  action,
  isActive,
  onClick,
  registerRef,
}: {
  action: SidebarAction;
  isActive: boolean;
  onClick: () => void;
  registerRef?: (el: HTMLElement | null) => void;
}) {
  const Icon = action.icon;
  const badgeClass = BADGE_CLASSES[action.badgeVariant ?? "indigo"];

  const inner = (
    <button
      ref={registerRef as React.Ref<HTMLButtonElement>}
      disabled={action.disabled}
      onClick={onClick}
      data-active={isActive || undefined}
      className={cn(
        "group relative flex w-full items-center gap-2 rounded-[5px] px-2.5 py-1.5",
        "text-left text-[13px] leading-none transition-colors duration-150",
        "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isActive
          ? "bg-primary/8 font-medium text-foreground"
          : "font-normal text-muted-foreground hover:bg-muted/60 hover:text-foreground",
      )}
    >
      {/* Active bar — the sidebar's expression of the progress-hairline motif */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="sidebar-active-bar"
            className="absolute left-0 top-1/2 h-3.5 w-[2px] -translate-y-1/2 rounded-full bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 500, damping: 34 }}
          />
        )}
      </AnimatePresence>

      {Icon && (
        <Icon
          size={14}
          strokeWidth={1.9}
          className={cn(
            "shrink-0 text-muted-foreground/70 transition-colors",
            isActive && "text-primary",
          )}
        />
      )}
      <span className="min-w-0 flex-1 truncate">{action.label}</span>

      {action.badge && (
        <Badge
          className={cn(
            "shrink-0 rounded-[4px] border px-1.5 py-0 font-mono text-[9px] font-medium uppercase leading-[18px] tracking-wide",
            badgeClass,
          )}
        >
          {action.badge}
        </Badge>
      )}
    </button>
  );

  if (action.href && !action.disabled) {
    return (
      <Link href={action.href} tabIndex={-1} className="contents">
        {inner}
      </Link>
    );
  }
  return inner;
}

export function DocsNavList({
  sections,
  active,
  onSelect,
  openSections,
  onToggleSection,
  scrollActiveIntoView = false,
}: {
  sections: SidebarSection[];
  active?: string;
  onSelect: (action: SidebarAction) => void;
  openSections: Record<string, boolean>;
  onToggleSection: (label: string) => void;
  scrollActiveIntoView?: boolean;
}) {
  const pathname = usePathname();
  const activeRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (scrollActiveIntoView && activeRef.current) {
      activeRef.current.scrollIntoView({ block: "center" });
    }
    // Only run on mount — subsequent nav shouldn't yank scroll position.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex flex-col gap-4">
      {sections.map((section, si) => {
        const SectionIcon = section.icon;
        const isOpen = openSections[section.label] ?? true;
        const collapsible = section.collapsible !== false;

        return (
          <div key={section.label + si} className="flex flex-col gap-0.5">
            <button
              type="button"
              onClick={() => collapsible && onToggleSection(section.label)}
              className={cn(
                "flex items-center gap-1.5 px-2.5 py-0.5 text-muted-foreground/80",
                collapsible && "cursor-pointer hover:text-foreground",
              )}
            >
              {SectionIcon && (
                <SectionIcon size={11} strokeWidth={2} className="shrink-0" />
              )}
              <span className="flex-1 text-left font-mono text-[10px] font-semibold uppercase tracking-wider">
                {section.label}
              </span>
              {collapsible && (
                <IconChevronDown
                  size={12}
                  strokeWidth={2}
                  className={cn(
                    "shrink-0 transition-transform duration-150",
                    !isOpen && "-rotate-90",
                  )}
                />
              )}
            </button>

            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.15, ease: "easeInOut" }}
                  className="flex flex-col gap-0.5 overflow-hidden pt-0.5"
                >
                  {section.actions.map((action, ai) => {
                    const isActive =
                      active === action.label ||
                      (action.href ? pathname === action.href : false);

                    return (
                      <NavItem
                        key={(action.label ?? "a") + ai}
                        action={action}
                        isActive={isActive}
                        onClick={() => onSelect(action)}
                        registerRef={isActive ? (el) => (activeRef.current = el) : undefined}
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}

// ─── BevelSidebar (desktop rail) ───────────────────────────────────────────────

export function BevelSidebar({
  sections,
  activeItem,
  onActiveChange,
  className,
  hideHeader = false,
}: BevelSidebarProps) {
  const pathname = usePathname();

  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      sections.reduce(
        (acc, s) => ({ ...acc, [s.label]: s.defaultOpen ?? true }),
        {},
      ),
  );

  const [internalActive, setInternalActive] = useState<string | undefined>(
    activeItem,
  );

  const active = activeItem ?? internalActive;

  // Sync active item from URL pathname automatically
  useEffect(() => {
    sections.forEach((section) => {
      section.actions.forEach((action) => {
        if (action.href && pathname === action.href) {
          setInternalActive(action.label);
        }
      });
    });
  }, [pathname, sections]);

  const toggleSection = useCallback((label: string) => {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }, []);

  function handleAction(action: SidebarAction) {
    if (action.disabled) return;
    setInternalActive(action.label);
    onActiveChange?.(action.label);
    action.onClick?.();
  }

  return (
    <nav
      aria-label="Documentation navigation"
      className={cn(
        "relative hidden h-full flex-col gap-5 overflow-y-auto bg-card/60 py-6 lg:flex",
        // Width is set by the parent — sidebar is width-agnostic
        className,
      )}
    >
      {!hideHeader && (
        <div className="flex flex-col gap-3 px-4">
          <Link href="/" className="flex shrink-0 items-center gap-2">
            <BrandMark />
          </Link>
          <DocsCommandSearch className="w-full" />
        </div>
      )}

      <div className="flex flex-col gap-4 px-2">
        <DocsNavList
          sections={sections}
          active={active}
          onSelect={handleAction}
          openSections={openSections}
          onToggleSection={toggleSection}
        />
      </div>

      {/* Right border hairline */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-border/70" />
    </nav>
  );
}

"use client";

import * as React from "react";
import { useState, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { motion, AnimatePresence } from "motion/react";
import { IconBoltFilled, IconChevronDown } from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { DocsCommandSearch } from "../bevelui/docs/docs-command-search";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SidebarAction = {
  label: string;
  href?: string;
  /** Short badge label e.g. "New", "Beta", "Soon" */
  badge?: string;
  /** Colour of the badge. Defaults to indigo gradient */
  badgeVariant?: "primary" | "new" | "indigo" | "green" | "amber" | "red";
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
};

// ─── Badge colours ────────────────────────────────────────────────────────────

const BADGE_CLASSES: Record<
  NonNullable<SidebarAction["badgeVariant"]>,
  string
> = {
  new: "bg-linear-to-tr from-yellow-400 text-black  to-yellow-200 border-none",
  primary: "bg-primary/15 text-primary border-primary/20",
  indigo:
    "bg-linear-to-tr from-indigo-600 to-indigo-400 text-white border-transparent",
  green:
    "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/20",
  amber:
    "bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/20",
  red: "bg-red-500/15 text-red-600 dark:text-red-400 border-red-500/20",
};

// ─── Single action row ────────────────────────────────────────────────────────

function SidebarItem({
  action,
  isActive,
  onClick,
}: {
  action: SidebarAction;
  isActive: boolean;
  onClick: () => void;
}) {
  const Icon = action.icon;
  const badgeClass = BADGE_CLASSES[action.badgeVariant ?? "indigo"];

  const inner = (
    <button
      disabled={action.disabled}
      onClick={onClick}
      className={cn(
        "group relative flex items-center  w-full px-2.5 py-1.5 rounded-md font-medium ",
        "text-left text-sm  transition-colors duration-500 ease-in",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        "disabled:opacity-40 disabled:cursor-not-allowed",
        isActive ? "bg-primary/8 text-lime-200 " : " hover:bg-muted/50",
      )}
    >
      {/* Active bar */}
      <AnimatePresence>
        {isActive && (
          <motion.span
            layoutId="sidebar-active-bar"
            className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-4 rounded-full bg-primary"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
          />
        )}
      </AnimatePresence>

      <span className="flex items-center gap-2 pl-1.5 min-w-0">
        {Icon && (
          <Icon
            size={16}
            className={cn(
              "shrink-0 transition-colors",
              isActive && "text-primary",
            )}
          />
        )}
        <span className="truncate">{action.label}</span>
      </span>

      {action.badge && (
        <Badge
          className={cn(
            "text-[10px] font-semibold px-2 py-0.5 rounded-full border shrink-0 ml-2",
            badgeClass,
          )}
        >
          {action.badge}
        </Badge>
      )}
    </button>
  );

  if (action.href && !action.disabled) {
    return <Link href={action.href}>{inner}</Link>;
  }
  return inner;
}

// ─── BevelSidebar ─────────────────────────────────────────────────────────────

export function BevelSidebar({
  sections,
  activeItem,
  onActiveChange,
  className,
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

  // Keyboard: Escape collapses all sections
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") {
        setOpenSections(
          sections.reduce((acc, s) => ({ ...acc, [s.label]: false }), {}),
        );
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [sections]);

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
        "relative h-full flex flex-col py-6 pt-0  gap-5 overflow-y-auto bg-card/80",
        // Width is set by the parent — sidebar is width-agnostic
        className,
      )}
    >
      <div className=" space-y-2 dark:bg-black bg-white p-2 pt-4 rounded-b-3xl mx-2">
        <Link href="/" className="flex items-center gap-2 shrink-0">
          <div className="size-6 flex items-center justify-center bg-primary bevel rounded-full shrink-0">
            <IconBoltFilled color="black" size={14} />
          </div>
          <span className="font-medium text-lg tracking-tight font-sans">
            Bevel UI
          </span>
        </Link>
        <DocsCommandSearch className="lg:w-full" />
      </div>
      {sections.map((section, si) => {
        const SectionIcon = section.icon;
        const isOpen = openSections[section.label] ?? true;
        const collapsible = section.collapsible !== false;

        return (
          <div key={section.label + si} className="flex flex-col gap-0.5 px-3">
            <div className="flex items-center gap-1.5 text-muted-foreground">
              {SectionIcon && <SectionIcon size={12} strokeWidth={1.8} />}
              <span className="text-[10px] font-semibold uppercase ">
                {section.label}
              </span>
            </div>
            {/* Actions */}
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.18, ease: "easeInOut" }}
                  className="overflow-hidden flex flex-col gap-0.5"
                >
                  {section.actions.map((action, ai) => {
                    const isActive =
                      active === action.label ||
                      (action.href ? pathname === action.href : false);

                    return (
                      <SidebarItem
                        key={(action.label ?? "a") + ai}
                        action={action}
                        isActive={isActive}
                        onClick={() => handleAction(action)}
                      />
                    );
                  })}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Divider — skip on last */}
            {si < sections.length - 1 && (
              <div className="mt-3 h-px bg-gradient-to-r from-transparent via-border/50 to-transparent" />
            )}
          </div>
        );
      })}

      {/* Right border gradient */}
      <div className="pointer-events-none absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-border/60 to-transparent" />
    </nav>
  );
}

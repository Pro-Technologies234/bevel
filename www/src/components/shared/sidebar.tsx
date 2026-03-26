"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { IconChevronDown, type Icon } from "@tabler/icons-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SidebarAction = {
  label: string;
  href?: string;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  badge?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export type SidebarSection = {
  label: string;
  collapsible?: boolean;
  defaultOpen?: boolean;
  icon?: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  onClick?: () => void;
  actions: SidebarAction[];
};

export type SidebarProps = {
  sections: SidebarSection[];
  activeItem?: string;
  onActiveChange?: (label: string) => void;
  className?: string;
};

// ─── BevelSidebar ─────────────────────────────────────────────────────────────

export function BevelSidebar({
  sections,
  activeItem,
  onActiveChange,
  className,
}: SidebarProps) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>(
    () =>
      sections.reduce(
        (acc, section) => ({
          ...acc,
          [section.label]: section.defaultOpen ?? true,
        }),
        {}
      )
  );

  const [internalActive, setInternalActive] = useState<string | undefined>(
    activeItem
  );

  const active = activeItem ?? internalActive;

  function handleActionClick(action: SidebarAction) {
    if (action.disabled) return;
    const next = action.label;
    setInternalActive(next);
    onActiveChange?.(next);
    action.onClick?.();
  }

  function toggleSection(label: string) {
    setOpenSections((prev) => ({ ...prev, [label]: !prev[label] }));
  }

  return (
    <div
      className={cn(
        "relative h-full w-60 flex flex-col gap-1 py-4 px-3  overflow-y-auto",
        className
      )}
    >
      {sections.map((section, si) => {
        const isOpen = openSections[section.label] ?? true;
        const SectionIcon = section.icon;

        return (
          <div key={section.label + si} className="flex flex-col">
            {/* Section header */}
            <button
              onClick={() => {
                section.onClick?.();
                if (section.collapsible) toggleSection(section.label);
              }}
              className={cn(
                "group flex items-center justify-between w-full px-2 py-1.5 rounded-md mb-0.5",
                "text-left transition-colors duration-150",
                section.collapsible &&
                  "hover:bg-muted/40 cursor-pointer",
                !section.collapsible && "cursor-default"
              )}
            >
              <div className="flex items-center gap-2">
                {SectionIcon && (
                  <SectionIcon
                    size={13}
                    strokeWidth={1.8}
                    className="text-muted-foreground"
                  />
                )}
                <span className="text-xs font-medium  capitalize">
                  {section.label}
                </span>
              </div>

              {section.collapsible && (
                <IconChevronDown
                  size={13}
                  strokeWidth={2}
                  className={cn(
                    "text-muted-foreground/60 transition-transform duration-200",
                    !isOpen && "-rotate-90"
                  )}
                />
              )}
            </button>

            {/* Actions */}
            <div
              className={cn(
                "flex flex-col gap-0.5 overflow-hidden transition-all duration-200",
                isOpen ? "opacity-100" : "max-h-0 opacity-0"
              )}
            >
              {section.actions.map((action, ai) => {
                const isActive = active === action.label;
                const ActionIcon = action.icon;

                return (
                  <button
                    key={(action.label ?? "action") + ai}
                    disabled={action.disabled}
                    onClick={() => handleActionClick(action)}
                    className={cn(
                      "group flex items-center justify-between w-full px-2 py-1.5 rounded-md",
                      "text-left text-xs transition-colors duration-150",
                      "disabled:opacity-40 disabled:cursor-not-allowed",
                      isActive
                        ? "bg-primary/10 text-primary font-medium"
                        : "text-foreground/70 hover:text-foreground hover:bg-muted/30"
                    )}
                  >
                    <div className="flex items-center gap-2">
                      {/* Active indicator line */}
                      <span
                        className={cn(
                          "w-0.5 h-3.5 rounded-full transition-all duration-150 shrink-0",
                          isActive ? "bg-primary" : "bg-transparent"
                        )}
                      />

                      {ActionIcon && (
                        <ActionIcon
                          size={14}
                          strokeWidth={1.6}
                        //   className={cn(
                        //     "transition-colors",
                        //     isActive
                        //       ? "text-primary"
                        //       : "text-muted-foreground group-hover:text-foreground"
                        //   )}
                        />
                      )}

                      <span className="truncate">{action.label}</span>
                    </div>

                    {/* Badge */}
                    {action.badge && (
                      <span
                        className={cn(
                          "text-[10px] px-1.5 py-0.5 rounded-full font-medium shrink-0",
                          " from-rose-600 to-rose-400 bg-linear-to-tr text-white",
                        //   isActive
                        //     ? "from-orange-600 to-orange-400 bg-linear-to-tr text-white"
                        //     : " from-rose-600 to-rose-400 bg-linear-to-tr text-white"
                        )}
                      >
                        {action.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Section divider — skip on last */}
            {si < sections.length - 1 && (
              <div className="my-2 h-px bg-border/50" />
            )}
          </div>
        );
      })}

      {/* Right border line */}
      <div className="absolute inset-y-0 right-0 bg-gradient-to-t from-transparent via-border/60 to-transparent w-px" />
    </div>
  );
}
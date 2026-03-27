"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";

// ─── Types ────────────────────────────────────────────────────────────────────

export type SidebarAction = {
  label: string;
  href?: string;
  badge?: string;
  disabled?: boolean;
  onClick?: () => void;
};

export type SidebarSection = {
  label: string;
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
  const [internalActive, setInternalActive] = useState<string | undefined>(
    activeItem,
  );

  const active = activeItem ?? internalActive;

  function handleClick(action: SidebarAction) {
    if (action.disabled) return;
    setInternalActive(action.label);
    onActiveChange?.(action.label);
    action.onClick?.();
  }

  return (
    <div
      className={cn(
        "relative w-56 flex flex-col py-6 px-4 gap-6 overflow-y-auto",
        className,
      )}
    >
      {sections.map((section, si) => (
        <div key={section.label + si} className="flex flex-col gap-1">
          {/* Section label */}
          <p className="text-xs font-semibold text-foreground mb-1 px-2">
            {section.label}
          </p>

          {/* Actions */}
          {section.actions.map((action, ai) => {
            const isActive = active === action.label;

            return (
              <button
                key={(action.label ?? "a") + ai}
                disabled={action.disabled}
                onClick={() => handleClick(action)}
                className={cn(
                  "flex items-center justify-between w-full px-2 py-1 rounded-md",
                  "text-left text-sm transition-colors duration-100",
                  "disabled:opacity-35 disabled:cursor-not-allowed",
                  isActive
                    ? "text-primary font-medium"
                    : "text-muted-foreground hover:text-foreground font-normal",
                )}
              >
                <span className="truncate">{action.label}</span>

                {action.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ml-2",
                      isActive
                        ? "text-primary bg-primary/10"
                        : "text-muted-foreground bg-muted",
                    )}
                  >
                    {action.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      ))}

      {/* Right border */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
    </div>
  );
}

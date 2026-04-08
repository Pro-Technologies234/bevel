"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import { usePathname } from "next/navigation";
import { Button } from "../ui/button";

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
  const pathName = usePathname();
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
        <div key={section.label + si} className="flex flex-col gap-0.5">
          {/* Section label */}
          <p className="text-[10px] font-medium text-muted-foreground mb-1 px-2">
            {section.label}
          </p>

          {/* Actions */}
          {section.actions.map((action, ai) => {
            const isActive = pathName === action.href;

            return (
              <Button
                variant={"ghost"}
                size={"sm"}
                key={(action.label ?? "a") + ai}
                disabled={action.disabled}
                onClick={() => handleClick(action)}
                className={cn(
                  " w-fit rounded-md! hover:bg-secondary/80! cursor-pointer py-3 text-xs",
                  isActive
                    ? "text-primary bg-primary/10!"
                    : " hover:text-foreground ",
                )}
              >
                <span className=" line-clamp-1 tracking-tight">
                  {action.label}
                </span>

                {action.badge && (
                  <span
                    className={cn(
                      "text-[10px] font-medium px-1.5 py-0.5 rounded-md shrink-0 ml-2 text-white bg-linear-to-tr from-indigo-600 to-indigo-400",
                    )}
                  >
                    {action.badge}
                  </span>
                )}
              </Button>
            );
          })}
        </div>
      ))}

      {/* Right border */}
      <div className="absolute inset-y-0 right-0 w-px bg-gradient-to-b from-transparent via-border to-transparent" />
    </div>
  );
}

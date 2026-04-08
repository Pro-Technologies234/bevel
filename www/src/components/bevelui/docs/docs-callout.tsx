import * as React from "react";
import { cn } from "@/lib/utils";
import {
  IconInfoCircle,
  IconAlertTriangle,
  IconBulb,
  IconAlertCircle,
} from "@tabler/icons-react";

export type DocsCalloutVariant = "info" | "warning" | "tip" | "danger";

export interface DocsCalloutProps {
  variant?: DocsCalloutVariant;
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const CALLOUT_CONFIG = {
  info: {
    icon: IconInfoCircle,
    containerClass: "bg-blue-500/8 border-blue-500/20",
    iconClass: "text-blue-500",
    titleClass: "text-blue-600 dark:text-blue-400",
    defaultTitle: "Note",
  },
  warning: {
    icon: IconAlertTriangle,
    containerClass: "bg-amber-500/8 border-amber-500/20",
    iconClass: "text-amber-500",
    titleClass: "text-amber-600 dark:text-amber-400",
    defaultTitle: "Warning",
  },
  tip: {
    icon: IconBulb,
    containerClass: "bg-primary/8 border-primary/20",
    iconClass: "text-primary",
    titleClass: "text-primary",
    defaultTitle: "Tip",
  },
  danger: {
    icon: IconAlertCircle,
    containerClass: "bg-destructive/8 border-destructive/20",
    iconClass: "text-destructive",
    titleClass: "text-destructive",
    defaultTitle: "Important",
  },
} as const;

export function DocsCallout({
  variant = "info",
  title,
  children,
  className,
}: DocsCalloutProps) {
  const config = CALLOUT_CONFIG[variant];
  const Icon = config.icon;
  const resolvedTitle = title ?? config.defaultTitle;

  return (
    <div
      className={cn(
        "flex gap-3 p-4 rounded-xl border",
        config.containerClass,
        className,
      )}
      role={variant === "danger" || variant === "warning" ? "alert" : "note"}
    >
      <Icon
        size={16}
        strokeWidth={2}
        className={cn("shrink-0 mt-0.5", config.iconClass)}
      />
      <div className="flex flex-col gap-1 min-w-0">
        {resolvedTitle && (
          <span className={cn("text-xs font-semibold", config.titleClass)}>
            {resolvedTitle}
          </span>
        )}
        <div className="text-xs text-muted-foreground leading-relaxed">
          {children}
        </div>
      </div>
    </div>
  );
}

DocsCallout.displayName = "DocsCallout";

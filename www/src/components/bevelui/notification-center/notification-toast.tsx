"use client";

import * as React from "react";
import { IconX } from "@tabler/icons-react";
import { cn } from "@/lib/utils";
import { useNotificationCtx } from "./notification-context";
import type { ToastGroupState } from "./types";

export interface NotificationToastProps {
  group: ToastGroupState;
  className?: string;
}

const PRIORITY_ACCENT: Record<string, string> = {
  low: "bg-muted-foreground/40",
  normal: "bg-primary",
  high: "bg-amber-400",
  critical: "bg-red-500",
};

export function NotificationToast({ group, className }: NotificationToastProps) {
  const { history, dismissToast, pauseToast, resumeToast, undo } = useNotificationCtx();

  const latestId = group.ids[group.ids.length - 1];
  const latest = history.find((n) => n.id === latestId);
  const count = group.ids.length;

  // Progress bar: width animates from 100% to 0% over durationMs, restarting the
  // CSS transition whenever expiresAt changes (new item bumps the group, or resume).
  const [ready, setReady] = React.useState(false);
  React.useEffect(() => {
    setReady(false);
    const raf = requestAnimationFrame(() => setReady(true));
    return () => cancelAnimationFrame(raf);
  }, [group.expiresAt]);

  if (!latest) return null;

  return (
    <div
      role="status"
      onMouseEnter={() => pauseToast(group.groupKey)}
      onMouseLeave={() => resumeToast(group.groupKey)}
      className={cn(
        "relative w-80 max-w-[90vw] overflow-hidden rounded-xl border border-border",
        "bg-card/95 backdrop-blur shadow-lg",
        className,
      )}
    >
      <div className="flex items-start gap-3 p-3">
        <span
          className={cn("mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full", PRIORITY_ACCENT[group.priority] ?? PRIORITY_ACCENT.normal)}
        />

        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <p className="truncate text-[13px] font-medium text-foreground">{latest.title}</p>
            {count > 1 && (
              <span className="shrink-0 rounded-full bg-muted px-1.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                {count}
              </span>
            )}
          </div>
          {latest.message && (
            <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">{latest.message}</p>
          )}

          {(latest.actions?.length || latest.undo) && (
            <div className="mt-2 flex items-center gap-3">
              {latest.undo && (
                <button
                  type="button"
                  onClick={() => undo(latest.id)}
                  className="text-[11px] font-medium text-primary hover:underline"
                >
                  Undo
                </button>
              )}
              {latest.actions?.map((a) => (
                <button
                  key={a.label}
                  type="button"
                  onClick={a.onClick}
                  className="text-[11px] font-medium text-muted-foreground hover:text-foreground"
                >
                  {a.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <button
          type="button"
          onClick={() => dismissToast(group.groupKey)}
          aria-label="Dismiss notification"
          className="shrink-0 rounded p-0.5 text-muted-foreground/50 transition-colors hover:text-foreground"
        >
          <IconX size={13} strokeWidth={1.8} />
        </button>
      </div>

      {group.durationMs !== null && (
        <div className="h-0.5 w-full bg-border/60">
          {group.paused && group.remainingMs !== null ? (
            <div
              className={cn("h-full", PRIORITY_ACCENT[group.priority] ?? PRIORITY_ACCENT.normal)}
              style={{ width: `${(group.remainingMs / group.durationMs) * 100}%` }}
            />
          ) : (
            <div
              className={cn("h-full", PRIORITY_ACCENT[group.priority] ?? PRIORITY_ACCENT.normal)}
              style={{
                width: ready ? "0%" : "100%",
                transitionProperty: "width",
                transitionTimingFunction: "linear",
                transitionDuration: ready ? `${group.durationMs}ms` : "0ms",
              }}
            />
          )}
        </div>
      )}
    </div>
  );
}

NotificationToast.displayName = "NotificationToast";

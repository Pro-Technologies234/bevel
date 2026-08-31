"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useNotificationCtx } from "./notification-context";
import type { Notification } from "./types";

export interface NotificationItemProps {
  notification: Notification;
  className?: string;
}

const PRIORITY_DOT: Record<string, string> = {
  low: "bg-muted-foreground/40",
  normal: "bg-primary",
  high: "bg-amber-400",
  critical: "bg-red-500",
};

export function NotificationItem({ notification, className }: NotificationItemProps) {
  const { markRead, undo, removeFromHistory } = useNotificationCtx();

  return (
    <div
      onClick={() => !notification.read && markRead(notification.id)}
      className={cn(
        "group flex items-start gap-2.5 rounded-lg px-2.5 py-2.5 transition-colors",
        !notification.read && "bg-primary/[0.04]",
        "hover:bg-muted/60 cursor-default",
        className,
      )}
    >
      <span
        className={cn(
          "mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full",
          notification.read ? "bg-transparent" : PRIORITY_DOT[notification.priority ?? "normal"],
        )}
      />

      <div className="min-w-0 flex-1">
        <p className="truncate text-[13px] font-medium text-foreground">{notification.title}</p>
        {notification.message && (
          <p className="mt-0.5 line-clamp-2 text-[12px] text-muted-foreground">{notification.message}</p>
        )}

        <div className="mt-1 flex items-center gap-3">
          <span className="text-[10px] text-muted-foreground/60">{timeAgo(notification.createdAt)}</span>
          {notification.undo && !notification.undone && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                undo(notification.id);
              }}
              className="text-[11px] font-medium text-primary hover:underline"
            >
              Undo
            </button>
          )}
          {notification.undone && (
            <span className="text-[11px] text-muted-foreground/60 italic">Undone</span>
          )}
        </div>
      </div>

      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          removeFromHistory(notification.id);
        }}
        aria-label="Remove notification"
        className="shrink-0 text-[11px] text-muted-foreground/0 transition-colors group-hover:text-muted-foreground/50 hover:!text-foreground"
      >
        ✕
      </button>
    </div>
  );
}

NotificationItem.displayName = "NotificationItem";

function timeAgo(ts: number): string {
  const diff = Math.max(0, Date.now() - ts);
  const s = Math.floor(diff / 1000);
  if (s < 60) return "just now";
  const m = Math.floor(s / 60);
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

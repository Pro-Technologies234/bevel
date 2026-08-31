"use client";

import * as React from "react";
import { cn } from "@/lib/utils";
import { useNotificationCtx } from "./notification-context";
import { NotificationToast } from "./notification-toast";
import type { ToastGroupState } from "./types";

export interface NotificationToastViewportProps {
  className?: string;
  renderToast?: (group: ToastGroupState) => React.ReactNode;
}

const POSITION_CLASSES: Record<string, string> = {
  "top-left": "top-4 left-4 items-start",
  "top-right": "top-4 right-4 items-end",
  "bottom-left": "bottom-4 left-4 items-start flex-col-reverse",
  "bottom-right": "bottom-4 right-4 items-end flex-col-reverse",
};

export function NotificationToastViewport({ className, renderToast }: NotificationToastViewportProps) {
  const { toastOrder, toastGroups, config } = useNotificationCtx();

  if (toastOrder.length === 0) return null;

  return (
    <div
      className={cn(
        "pointer-events-none fixed z-50 flex max-h-[100dvh] flex-col gap-2 p-4",
        POSITION_CLASSES[config.toastPosition] ?? POSITION_CLASSES["bottom-right"],
        className,
      )}
    >
      {toastOrder.map((groupKey) => {
        const group = toastGroups[groupKey];
        if (!group) return null;
        return (
          <div key={groupKey} className="pointer-events-auto">
            {renderToast ? renderToast(group) : <NotificationToast group={group} />}
          </div>
        );
      })}
    </div>
  );
}

NotificationToastViewport.displayName = "NotificationToastViewport";

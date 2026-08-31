"use client";

import * as React from "react";
import {
  NotificationRoot,
  NotificationInbox,
  useNotifications,
} from "@/components/bevelui/notification-center";
import { cn } from "@/lib/utils";

const SCENARIOS = [
  {
    label: "New comment",
    run: (notify: ReturnType<typeof useNotifications>["notify"]) =>
      notify({
        type: "comment",
        groupKey: "comments:demo-post",
        title: "Alex commented on your post",
        message: "\"This is exactly what I needed, thanks!\"",
        priority: "normal",
      }),
  },
  {
    label: "Trigger 3 comments (stacking)",
    run: (notify: ReturnType<typeof useNotifications>["notify"]) => {
      const names = ["Priya", "Sam", "Jordan"];
      names.forEach((name, i) => {
        setTimeout(
          () =>
            notify({
              type: "comment",
              groupKey: "comments:demo-post",
              title: `${name} commented on your post`,
              priority: "normal",
            }),
          i * 300,
        );
      });
    },
  },
  {
    label: "Critical error (persists)",
    run: (notify: ReturnType<typeof useNotifications>["notify"]) =>
      notify({
        type: "system",
        title: "Sync failed",
        message: "Changes couldn't be saved. Retry or work offline.",
        priority: "critical",
        ttl: null,
      }),
  },
  {
    label: "Deletable item (undo)",
    run: (notify: ReturnType<typeof useNotifications>["notify"]) =>
      notify({
        type: "delete",
        title: "Item deleted",
        message: "\"Q3 Roadmap\" was removed.",
        undo: () => {
          /* demo: restore would happen here */
        },
      }),
  },
];

function DemoControls() {
  const { notify } = useNotifications();

  return (
    <div className="flex flex-wrap gap-2">
      {SCENARIOS.map((s) => (
        <button
          key={s.label}
          type="button"
          onClick={() => s.run(notify)}
          className={cn(
            "rounded-lg border border-border bg-card/80 px-3 py-2 text-[12px] font-medium",
            "text-foreground/80 transition-colors hover:bg-muted/60 hover:text-foreground",
          )}
        >
          {s.label}
        </button>
      ))}
    </div>
  );
}

export function NotificationCenterDemo() {
  return (
    <div className="relative flex min-h-[280px] flex-col gap-4 rounded-xl border border-border bg-background/60 p-4">
      <NotificationRoot config={{ maxVisibleToasts: 3, defaultTtl: 4000, toastPosition: "bottom-right" }}>
        <div className="flex items-center justify-between">
          <span className="text-[12px] font-medium text-muted-foreground">Try it</span>
          <NotificationInbox />
        </div>
        <DemoControls />
      </NotificationRoot>
    </div>
  );
}

NotificationCenterDemo.displayName = "NotificationCenterDemo";

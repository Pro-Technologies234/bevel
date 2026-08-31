"use client";

import * as React from "react";
import { NotificationCtx } from "./notification-context";
import { useNotificationEngine } from "./use-notification-engine";
import { NotificationToastViewport } from "./notification-toast-viewport";
import type { NotificationConfig } from "./types";

export interface NotificationRootProps {
  config?: NotificationConfig;
  /**
   * Custom toast rendering. Receives the group's notification ids and the shared
   * dismiss/undo/pause/resume handlers already bound to that group.
   */
  renderToast?: React.ComponentProps<typeof NotificationToastViewport>["renderToast"];
  /** Mount the default toast viewport. Set false if you render your own via useNotifications(). */
  showToastViewport?: boolean;
  children: React.ReactNode;
}

/**
 * Mount once, high in the tree (e.g. root layout), so notification history and
 * active toasts persist across route changes for the lifetime of the session.
 */
export function NotificationRoot({
  config,
  renderToast,
  showToastViewport = true,
  children,
}: NotificationRootProps) {
  const ctx = useNotificationEngine(config);

  return (
    <NotificationCtx.Provider value={ctx}>
      {children}
      {showToastViewport && <NotificationToastViewport renderToast={renderToast} />}
    </NotificationCtx.Provider>
  );
}

NotificationRoot.displayName = "NotificationRoot";

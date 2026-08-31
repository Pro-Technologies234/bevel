"use client";

import * as React from "react";
import type { NotificationContextValue } from "./types";

export const NotificationCtx = React.createContext<NotificationContextValue | null>(null);

export function useNotificationCtx(): NotificationContextValue {
  const ctx = React.useContext(NotificationCtx);
  if (!ctx) throw new Error("useNotificationCtx must be used inside NotificationRoot");
  return ctx;
}

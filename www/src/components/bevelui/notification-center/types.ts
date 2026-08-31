export type NotificationPriority = "low" | "normal" | "high" | "critical";

export interface NotificationAction {
  label: string;
  onClick: () => void;
}

export interface NotificationInput {
  /** Groups this notification with others sharing the same key (e.g. "comments:post-42"). */
  groupKey?: string;
  /** Used for the default groupBy="type" strategy and for consumer-side icon/color mapping. */
  type: string;
  title: string;
  message?: string;
  priority?: NotificationPriority;
  /** ms until auto-dismiss from the toast surface. null = persists until manually dismissed. */
  ttl?: number | null;
  actions?: NotificationAction[];
  /** If provided, an Undo action is shown; calling it fires this and removes the toast. */
  undo?: () => void;
  /** Arbitrary consumer payload for custom rendering. */
  data?: unknown;
}

export interface Notification extends NotificationInput {
  id: string;
  createdAt: number;
  read: boolean;
  undone?: boolean;
}

export type GroupByStrategy = "type" | "groupKey" | "none";

export interface NotificationConfig {
  /** Max number of toast groups visible at once. Default 3. */
  maxVisibleToasts?: number;
  /** Default ttl (ms) applied when a notification doesn't specify one. Default 5000. */
  defaultTtl?: number;
  /** How toasts are grouped/stacked. Default "groupKey" (falls back to type if no groupKey given). */
  groupBy?: GroupByStrategy;
  /** Max history length retained for the inbox. Default 200. */
  maxHistory?: number;
  /** Corner the toast viewport renders in. Default "bottom-right". */
  toastPosition?: "top-left" | "top-right" | "bottom-left" | "bottom-right";
}

export interface ToastGroupState {
  groupKey: string;
  type: string;
  /** Notification ids in this group, oldest first. */
  ids: string[];
  priority: NotificationPriority;
  expiresAt: number | null;
  /** Duration (ms) of the current running phase — used to compute progress-bar ratio. */
  durationMs: number | null;
  paused: boolean;
  remainingMs: number | null;
}

export interface NotificationContextValue {
  history: Notification[];
  toastOrder: string[];
  toastGroups: Record<string, ToastGroupState>;
  unreadCount: number;
  config: Required<NotificationConfig>;

  notify: (input: NotificationInput) => string;
  dismissToast: (groupKey: string) => void;
  dismissAllToasts: () => void;
  undo: (id: string) => void;
  pauseToast: (groupKey: string) => void;
  resumeToast: (groupKey: string) => void;

  markRead: (id: string) => void;
  markAllRead: () => void;
  clearHistory: () => void;
  removeFromHistory: (id: string) => void;
}

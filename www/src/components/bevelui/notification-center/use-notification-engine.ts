import * as React from "react";
import type {
  Notification,
  NotificationConfig,
  NotificationContextValue,
  NotificationInput,
  ToastGroupState,
} from "./types";

const DEFAULT_CONFIG: Required<NotificationConfig> = {
  maxVisibleToasts: 3,
  defaultTtl: 5000,
  groupBy: "groupKey",
  maxHistory: 200,
  toastPosition: "bottom-right",
};

const PRIORITY_WEIGHT: Record<Notification["priority"] & string, number> = {
  low: 0,
  normal: 1,
  high: 2,
  critical: 3,
};

let _seq = 0;
function uid() {
  _seq += 1;
  return `ntf_${Date.now().toString(36)}_${_seq}`;
}

// ─── Reducer ──────────────────────────────────────────────────────────────────

interface EngineState {
  history: Notification[];
  toastOrder: string[]; // groupKeys, most-recently-active last
  toastGroups: Record<string, ToastGroupState>;
}

type Action =
  | { type: "ADD"; notification: Notification; groupKey: string; maxVisibleToasts: number; maxHistory: number }
  | { type: "REMOVE_TOAST_GROUP"; groupKey: string }
  | { type: "CLEAR_TOASTS" }
  | {
      type: "SET_GROUP_TIMING";
      groupKey: string;
      expiresAt: number | null;
      durationMs: number | null;
      paused: boolean;
      remainingMs: number | null;
    }
  | { type: "MARK_UNDONE"; id: string }
  | { type: "MARK_READ"; id: string }
  | { type: "MARK_ALL_READ" }
  | { type: "CLEAR_HISTORY" }
  | { type: "REMOVE_HISTORY_ITEM"; id: string };

function pickEvictionCandidate(
  toastOrder: string[],
  toastGroups: Record<string, ToastGroupState>,
): string | null {
  if (toastOrder.length === 0) return null;
  // Prefer lowest priority, then oldest (earliest in toastOrder = least recently active).
  let best: string | null = null;
  let bestWeight = Infinity;
  let bestIndex = Infinity;
  toastOrder.forEach((key, idx) => {
    const g = toastGroups[key];
    if (!g) return;
    const w = PRIORITY_WEIGHT[g.priority] ?? 1;
    if (w < bestWeight || (w === bestWeight && idx < bestIndex)) {
      best = key;
      bestWeight = w;
      bestIndex = idx;
    }
  });
  return best;
}

function reducer(state: EngineState, action: Action): EngineState {
  switch (action.type) {
    case "ADD": {
      const { notification, groupKey, maxVisibleToasts, maxHistory } = action;

      const history = [notification, ...state.history].slice(0, maxHistory);

      let { toastOrder, toastGroups } = state;
      const existing = toastGroups[groupKey];

      if (existing) {
        toastGroups = {
          ...toastGroups,
          [groupKey]: {
            ...existing,
            ids: [...existing.ids, notification.id],
            priority: notification.priority ?? existing.priority,
          },
        };
        // Bump to most-recently-active.
        toastOrder = [...toastOrder.filter((k) => k !== groupKey), groupKey];
      } else {
        let nextOrder = toastOrder;
        let nextGroups = toastGroups;

        if (nextOrder.length >= maxVisibleToasts) {
          const evictKey = pickEvictionCandidate(nextOrder, nextGroups);
          if (evictKey) {
            nextOrder = nextOrder.filter((k) => k !== evictKey);
            const { [evictKey]: _drop, ...rest } = nextGroups;
            nextGroups = rest;
          }
        }

        const newGroup: ToastGroupState = {
          groupKey,
          type: notification.type,
          ids: [notification.id],
          priority: notification.priority ?? "normal",
          expiresAt: null,
          durationMs: null,
          paused: false,
          remainingMs: null,
        };

        toastOrder = [...nextOrder, groupKey];
        toastGroups = { ...nextGroups, [groupKey]: newGroup };
      }

      return { history, toastOrder, toastGroups };
    }

    case "REMOVE_TOAST_GROUP": {
      const { [action.groupKey]: _drop, ...rest } = state.toastGroups;
      return {
        ...state,
        toastOrder: state.toastOrder.filter((k) => k !== action.groupKey),
        toastGroups: rest,
      };
    }

    case "CLEAR_TOASTS":
      return { ...state, toastOrder: [], toastGroups: {} };

    case "SET_GROUP_TIMING": {
      const g = state.toastGroups[action.groupKey];
      if (!g) return state;
      return {
        ...state,
        toastGroups: {
          ...state.toastGroups,
          [action.groupKey]: {
            ...g,
            expiresAt: action.expiresAt,
            durationMs: action.durationMs,
            paused: action.paused,
            remainingMs: action.remainingMs,
          },
        },
      };
    }

    case "MARK_UNDONE":
      return {
        ...state,
        history: state.history.map((n) => (n.id === action.id ? { ...n, undone: true } : n)),
      };

    case "MARK_READ":
      return {
        ...state,
        history: state.history.map((n) => (n.id === action.id ? { ...n, read: true } : n)),
      };

    case "MARK_ALL_READ":
      return { ...state, history: state.history.map((n) => ({ ...n, read: true })) };

    case "CLEAR_HISTORY":
      return { ...state, history: [] };

    case "REMOVE_HISTORY_ITEM":
      return { ...state, history: state.history.filter((n) => n.id !== action.id) };

    default:
      return state;
  }
}

// ─── Engine hook ──────────────────────────────────────────────────────────────

export function useNotificationEngine(configProp: NotificationConfig = {}): NotificationContextValue {
  const config: Required<NotificationConfig> = { ...DEFAULT_CONFIG, ...configProp };

  const [state, dispatch] = React.useReducer(reducer, {
    history: [],
    toastOrder: [],
    toastGroups: {},
  });

  // Timers live outside React state — they're an implementation detail of the engine.
  const timers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(new Map());

  const clearTimer = React.useCallback((groupKey: string) => {
    const t = timers.current.get(groupKey);
    if (t) {
      clearTimeout(t);
      timers.current.delete(groupKey);
    }
  }, []);

  const scheduleTimer = React.useCallback(
    (groupKey: string, ms: number) => {
      clearTimer(groupKey);
      const handle = setTimeout(() => {
        dispatch({ type: "REMOVE_TOAST_GROUP", groupKey });
        timers.current.delete(groupKey);
      }, ms);
      timers.current.set(groupKey, handle);
    },
    [clearTimer],
  );

  React.useEffect(() => {
    const map = timers.current;
    return () => {
      map.forEach((t) => clearTimeout(t));
      map.clear();
    };
  }, []);

  const notify = React.useCallback(
    (input: NotificationInput): string => {
      const id = uid();
      const priority = input.priority ?? "normal";
      const ttl = input.ttl === undefined ? config.defaultTtl : input.ttl;

      const notification: Notification = {
        ...input,
        id,
        priority,
        ttl,
        createdAt: Date.now(),
        read: false,
      };

      const groupKey =
        config.groupBy === "none"
          ? id
          : config.groupBy === "type"
          ? input.type
          : input.groupKey ?? input.type;

      dispatch({
        type: "ADD",
        notification,
        groupKey,
        maxVisibleToasts: config.maxVisibleToasts,
        maxHistory: config.maxHistory,
      });

      if (ttl !== null) {
        scheduleTimer(groupKey, ttl);
        dispatch({
          type: "SET_GROUP_TIMING",
          groupKey,
          expiresAt: Date.now() + ttl,
          durationMs: ttl,
          paused: false,
          remainingMs: null,
        });
      } else {
        clearTimer(groupKey);
        dispatch({
          type: "SET_GROUP_TIMING",
          groupKey,
          expiresAt: null,
          durationMs: null,
          paused: false,
          remainingMs: null,
        });
      }

      return id;
    },
    [config.defaultTtl, config.groupBy, config.maxHistory, config.maxVisibleToasts, scheduleTimer, clearTimer],
  );

  const dismissToast = React.useCallback(
    (groupKey: string) => {
      clearTimer(groupKey);
      dispatch({ type: "REMOVE_TOAST_GROUP", groupKey });
    },
    [clearTimer],
  );

  const dismissAllToasts = React.useCallback(() => {
    timers.current.forEach((t) => clearTimeout(t));
    timers.current.clear();
    dispatch({ type: "CLEAR_TOASTS" });
  }, []);

  const undo = React.useCallback(
    (id: string) => {
      const notification = state.history.find((n) => n.id === id);
      notification?.undo?.();
      dispatch({ type: "MARK_UNDONE", id });

      // Remove the id's group from the active toast surface if it's the sole/last member.
      for (const [groupKey, group] of Object.entries(state.toastGroups)) {
        if (group.ids.includes(id)) {
          clearTimer(groupKey);
          dispatch({ type: "REMOVE_TOAST_GROUP", groupKey });
          break;
        }
      }
    },
    [state.history, state.toastGroups, clearTimer],
  );

  const pauseToast = React.useCallback(
    (groupKey: string) => {
      const g = state.toastGroups[groupKey];
      if (!g || g.paused || g.expiresAt === null) return;
      clearTimer(groupKey);
      const remainingMs = Math.max(0, g.expiresAt - Date.now());
      dispatch({
        type: "SET_GROUP_TIMING",
        groupKey,
        expiresAt: null,
        durationMs: g.durationMs,
        paused: true,
        remainingMs,
      });
    },
    [state.toastGroups, clearTimer],
  );

  const resumeToast = React.useCallback(
    (groupKey: string) => {
      const g = state.toastGroups[groupKey];
      if (!g || !g.paused || g.remainingMs === null) return;
      scheduleTimer(groupKey, g.remainingMs);
      dispatch({
        type: "SET_GROUP_TIMING",
        groupKey,
        expiresAt: Date.now() + g.remainingMs,
        durationMs: g.remainingMs,
        paused: false,
        remainingMs: null,
      });
    },
    [state.toastGroups, scheduleTimer],
  );

  const markRead = React.useCallback((id: string) => dispatch({ type: "MARK_READ", id }), []);
  const markAllRead = React.useCallback(() => dispatch({ type: "MARK_ALL_READ" }), []);
  const clearHistory = React.useCallback(() => dispatch({ type: "CLEAR_HISTORY" }), []);
  const removeFromHistory = React.useCallback(
    (id: string) => dispatch({ type: "REMOVE_HISTORY_ITEM", id }),
    [],
  );

  const unreadCount = React.useMemo(
    () => state.history.reduce((n, item) => n + (item.read ? 0 : 1), 0),
    [state.history],
  );

  return {
    history: state.history,
    toastOrder: state.toastOrder,
    toastGroups: state.toastGroups,
    unreadCount,
    config,
    notify,
    dismissToast,
    dismissAllToasts,
    undo,
    pauseToast,
    resumeToast,
    markRead,
    markAllRead,
    clearHistory,
    removeFromHistory,
  };
}

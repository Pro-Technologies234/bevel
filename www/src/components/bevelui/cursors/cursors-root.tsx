"use client";

import * as React from "react";
import { CursorsCtx } from "./cursors-context";
import {
  colorFromUserId,
  resolveLabels,
  type LabelLayout,
} from "./cursor-utils";
import type {
  CursorsConfig,
  CursorsContextValue,
  CursorMeta,
  LocalUser,
  NormalizedPosition,
  RemoteCursor,
} from "./cursors-types";

export interface CursorsRootProps {
  /** The local user's identity. */
  localUser: LocalUser;
  config?: CursorsConfig;
  /**
   * Called whenever the local cursor moves inside the canvas.
   * Wire this to your transport (WebSocket, Supabase, Partykit, etc.).
   */
  onMove?: (position: NormalizedPosition) => void;
  children: React.ReactNode;
}

export function CursorsRoot({
  localUser,
  config = {},
  onMove,
  children,
}: CursorsRootProps) {
  // ── React state: only cursor identity/presence, not positions ───────────────
  const [cursors, setCursors] = React.useState<Map<string, CursorMeta>>(
    new Map(),
  );

  // ── Refs: hot-path data, never triggers re-renders ──────────────────────────
  const containerRef = React.useRef<HTMLDivElement | null>(null);
  const positionsRef = React.useRef<Map<string, NormalizedPosition>>(new Map());
  const cursorElsRef = React.useRef<Map<string, HTMLDivElement>>(new Map());
  const labelElsRef = React.useRef<Map<string, HTMLDivElement>>(new Map());
  const rafRef = React.useRef<number | null>(null);

  // Idle / remove timers per userId
  const idleTimers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );
  const removeTimers = React.useRef<Map<string, ReturnType<typeof setTimeout>>>(
    new Map(),
  );

  // Stable ref so idle timer callbacks can call removeCursor without stale closure
  const removeCursorRef = React.useRef<(userId: string) => void>(() => {});

  // ── Label overlap resolver (batched per RAF) ─────────────────────────────────
  const scheduleOverlap = React.useCallback(() => {
    if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    rafRef.current = requestAnimationFrame(() => {
      rafRef.current = null;
      const container = containerRef.current;
      if (!container) return;
      const W = container.offsetWidth;
      const H = container.offsetHeight;

      const layouts: LabelLayout[] = [];
      positionsRef.current.forEach((pos, userId) => {
        const labelEl = labelElsRef.current.get(userId);
        if (!labelEl) return;
        layouts.push({
          id: userId,
          cursorX: pos.x * W,
          cursorY: pos.y * H,
          labelW: labelEl.offsetWidth || 72,
          labelH: labelEl.offsetHeight || 22,
        });
      });

      if (layouts.length === 0) return;

      const offsets = resolveLabels(layouts, W, H);
      offsets.forEach(({ dx, dy }, userId) => {
        const labelEl = labelElsRef.current.get(userId);
        if (labelEl) {
          labelEl.style.transform = `translate(${Math.round(dx)}px, ${Math.round(dy)}px)`;
        }
      });
    });
  }, []);

  // ── removeCursor ─────────────────────────────────────────────────────────────
  const removeCursor = React.useCallback((userId: string) => {
    positionsRef.current.delete(userId);

    setCursors((prev) => {
      if (!prev.has(userId)) return prev;
      const next = new Map(prev);
      next.delete(userId);
      return next;
    });

    const it = idleTimers.current.get(userId);
    if (it !== undefined) {
      clearTimeout(it);
      idleTimers.current.delete(userId);
    }
    const rt = removeTimers.current.get(userId);
    if (rt !== undefined) {
      clearTimeout(rt);
      removeTimers.current.delete(userId);
    }
  }, []);

  React.useEffect(() => {
    removeCursorRef.current = removeCursor;
  }, [removeCursor]);

  // ── updateCursor — the hot path ───────────────────────────────────────────────
  // Called by the consumer's transport wiring on every incoming cursor event.
  // Position update is direct DOM — no React re-render on every mouse move.
  const updateCursor = React.useCallback(
    (remote: RemoteCursor) => {
      const { userId, userName, position } = remote;

      // 1. Store target position
      positionsRef.current.set(userId, position);

      // 2. Direct DOM: translate the cursor wrapper
      const cursorEl = cursorElsRef.current.get(userId);
      const container = containerRef.current;
      if (cursorEl && container) {
        const x = Math.round(position.x * container.offsetWidth);
        const y = Math.round(position.y * container.offsetHeight);
        cursorEl.style.transform = `translate(${x}px, ${y}px)`;
      }

      // 3. Batch label overlap resolution
      scheduleOverlap();

      // 4. React state — only on structural changes (new cursor, un-idle)
      setCursors((prev) => {
        const existing = prev.get(userId);
        if (existing && !existing.isIdle && existing.userName === userName)
          return prev;
        const next = new Map(prev);
        next.set(userId, {
          userId,
          userName,
          color: colorFromUserId(userId),
          isIdle: false,
        });
        return next;
      });

      // 5. Reset idle / remove timers
      const existingIdle = idleTimers.current.get(userId);
      if (existingIdle !== undefined) clearTimeout(existingIdle);
      const existingRemove = removeTimers.current.get(userId);
      if (existingRemove !== undefined) clearTimeout(existingRemove);

      const idleMs = (config.idleAfter ?? 3) * 1000;
      const removeMs = (config.removeAfter ?? 10) * 1000;

      idleTimers.current.set(
        userId,
        setTimeout(() => {
          // Fade to idle
          setCursors((prev) => {
            const c = prev.get(userId);
            if (!c || c.isIdle) return prev;
            const next = new Map(prev);
            next.set(userId, { ...c, isIdle: true });
            return next;
          });
          // Schedule removal after remaining time
          removeTimers.current.set(
            userId,
            setTimeout(
              () => removeCursorRef.current(userId),
              removeMs - idleMs,
            ),
          );
        }, idleMs),
      );
    },
    [config.idleAfter, config.removeAfter, scheduleOverlap],
  );

  // ── Cleanup on unmount ────────────────────────────────────────────────────────
  React.useEffect(() => {
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      idleTimers.current.forEach(clearTimeout);
      removeTimers.current.forEach(clearTimeout);
    };
  }, []);

  const ctx: CursorsContextValue = {
    localUser,
    cursors,
    config,
    onMove,
    containerRef,
    positionsRef,
    cursorElsRef,
    labelElsRef,
    scheduleOverlap,
    updateCursor,
    removeCursor,
  };

  return <CursorsCtx.Provider value={ctx}>{children}</CursorsCtx.Provider>;
}

CursorsRoot.displayName = "CursorsRoot";

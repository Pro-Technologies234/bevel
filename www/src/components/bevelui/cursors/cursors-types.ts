import type * as React from "react";

export interface NormalizedPosition {
  /** 0–1 fraction of container width */
  x: number;
  /** 0–1 fraction of container height */
  y: number;
}

export interface RemoteCursor {
  userId: string;
  userName: string;
  position: NormalizedPosition;
}

export interface LocalUser {
  userId: string;
  userName: string;
  /** Override the auto-assigned color for this user. */
  color?: string;
}

export interface CursorsConfig {
  /** Render an overlay cursor for the local user too. Default false — OS cursor is already visible. */
  showSelf?: boolean;
  /** Seconds of inactivity before cursor fades. Default 3. */
  idleAfter?: number;
  /** Seconds before an idle cursor is removed entirely. Default 10. */
  removeAfter?: number;
  /** Minimum ms between onMove broadcasts. Default 50. */
  throttleMs?: number;
}

export interface CursorMeta {
  userId: string;
  userName: string;
  color: string;
  isIdle: boolean;
}

export interface CursorsContextValue {
  localUser: LocalUser;
  cursors: Map<string, CursorMeta>;
  config: CursorsConfig;
  onMove?: (position: NormalizedPosition) => void;
  // Refs shared between Root (update logic) and Canvas (DOM elements)
  containerRef: React.MutableRefObject<HTMLDivElement | null>;
  positionsRef: React.MutableRefObject<Map<string, NormalizedPosition>>;
  cursorElsRef: React.MutableRefObject<Map<string, HTMLDivElement>>;
  labelElsRef: React.MutableRefObject<Map<string, HTMLDivElement>>;
  scheduleOverlap: () => void;
  // Public imperative API — consumer wires these to their transport
  updateCursor: (cursor: RemoteCursor) => void;
  removeCursor: (userId: string) => void;
}

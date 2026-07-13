export type SortableBaseItem = { id: string };

export interface SortableConfig {
  handle?: boolean;
  /**
   * "list" (default) — vertical strategy + axis lock.
   * "grid" — rect strategy, free-form drag in both axes.
   */
  layout?: "list" | "grid";
}

export interface SortableContextValue {
  activeId: string | null;
  config: SortableConfig;
}

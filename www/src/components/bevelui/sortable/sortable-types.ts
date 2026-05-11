export type SortableBaseItem = { id: string };

export interface SortableConfig {
  /** When true, only <SortableHandle> triggers drag. Default false (whole item drags). */
  handle?: boolean;
}

export interface SortableContextValue {
  activeId: string | null;
  config: SortableConfig;
}
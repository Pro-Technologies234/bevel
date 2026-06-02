export interface ResizablePanelConfig {
  minSize?: number; // percentage, default 10
  maxSize?: number; // percentage, default 90
  collapsible?: boolean;
  collapsedSize?: number; // percentage when collapsed, default 0
  defaultCollapsed?: boolean;
}

export interface ResizableContextValue {
  sizes: number[];
  collapsed: boolean[];
  direction: "horizontal" | "vertical";
  containerRef: React.RefObject<HTMLDivElement | null>;
  // Imperative resize — called by handle during drag (direct DOM write)
  setSizeDirect: (index: number, size: number) => void;
  // Called on drag end — commits to React state
  commitSizes: (sizes: number[]) => void;
  toggleCollapse: (panelIndex: number) => void;
  panelConfigs: ResizablePanelConfig[];
}

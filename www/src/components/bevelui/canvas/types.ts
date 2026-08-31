export interface CanvasNode {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  zIndex?: number;
  locked?: boolean;
  /** Arbitrary consumer payload — the engine never inspects this. */
  data?: unknown;
}

export interface CanvasViewport {
  x: number;
  y: number;
  zoom: number;
}

export interface CanvasConfig {
  minZoom?: number; // default 0.1
  maxZoom?: number; // default 4
  /** Snap dragged node positions to this grid size (px). 0 disables snapping. */
  gridSnap?: number; // default 0
  /** Which pointer interaction pans the canvas. Default "drag" (empty-space drag). */
  panTrigger?: "drag" | "space-drag" | "middle-mouse";
}

export type CanvasDragState =
  | { type: "none" }
  | { type: "pan"; startClientX: number; startClientY: number; startViewport: CanvasViewport }
  | { type: "node-drag"; ids: string[]; startPositions: Record<string, { x: number; y: number }>; startClientX: number; startClientY: number }
  | { type: "select-box"; startX: number; startY: number; currentX: number; currentY: number };

export interface CanvasEngine {
  getViewport: () => CanvasViewport;
  getNodes: () => CanvasNode[];
  getSelection: () => Set<string>;
  getDragState: () => CanvasDragState;

  // DOM attachment — engine writes transforms directly to these for perf.
  attachViewportElement: (el: HTMLElement | null) => void;
  attachWorldElement: (el: HTMLElement | null) => void;
  registerNodeElement: (id: string, el: HTMLElement | null) => void;

  // Viewport
  panStart: (clientX: number, clientY: number) => void;
  panMove: (clientX: number, clientY: number) => void; // writes DOM directly, no re-render
  panEnd: () => void; // syncs React snapshot
  zoomTo: (zoom: number, originClient?: { x: number; y: number }) => void;
  zoomToFit: (padding?: number) => void;
  centerOn: (nodeId: string) => void;

  // Selection
  select: (ids: string[], mode?: "replace" | "add" | "toggle") => void;
  clearSelection: () => void;
  startSelectBox: (clientX: number, clientY: number) => void;
  updateSelectBox: (clientX: number, clientY: number) => void;
  endSelectBox: (mode?: "replace" | "add") => void;

  // Node drag
  startNodeDrag: (ids: string[], clientX: number, clientY: number) => void;
  updateNodeDrag: (clientX: number, clientY: number) => void; // writes DOM directly, no re-render
  endNodeDrag: () => void; // commits final positions, syncs React snapshot

  // Nodes (immutable — returns new arrays, matches Sortable/Palette convention)
  addNode: (node: CanvasNode) => void;
  removeNode: (id: string) => void;
  updateNode: (id: string, patch: Partial<Omit<CanvasNode, "id">>) => void;
  moveNodes: (ids: string[], dx: number, dy: number) => void;

  // Coordinate conversion — screen (client) px <-> canvas (world) px
  screenToCanvas: (clientX: number, clientY: number) => { x: number; y: number };
  canvasToScreen: (x: number, y: number) => { x: number; y: number };

  // Lifecycle
  subscribe: (listener: () => void) => () => void; // for React to re-render on relevant changes
  destroy: () => void;
}

export interface CanvasContextValue {
  engine: CanvasEngine;
  config: Required<CanvasConfig>;
  // React-visible snapshot — updated via engine.subscribe, NOT on every pointer-move
  nodes: CanvasNode[];
  viewport: CanvasViewport;
  selection: Set<string>;
  dragState: CanvasDragState;
}

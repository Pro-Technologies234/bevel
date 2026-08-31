import type {
  CanvasConfig,
  CanvasDragState,
  CanvasEngine,
  CanvasNode,
  CanvasViewport,
} from "./types";

const DEFAULT_CONFIG: Required<CanvasConfig> = {
  minZoom: 0.1,
  maxZoom: 4,
  gridSnap: 0,
  panTrigger: "drag",
};

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

function snap(v: number, grid: number) {
  return grid > 0 ? Math.round(v / grid) * grid : v;
}

export function createCanvasEngine(
  initialNodes: CanvasNode[],
  initialViewport: CanvasViewport,
  configInput: CanvasConfig = {},
  onChange?: (nodes: CanvasNode[]) => void,
): CanvasEngine {
  const config: Required<CanvasConfig> = { ...DEFAULT_CONFIG, ...configInput };

  let nodes = initialNodes;
  let viewport = initialViewport;
  let selection = new Set<string>();
  let dragState: CanvasDragState = { type: "none" };

  let viewportEl: HTMLElement | null = null;
  let worldEl: HTMLElement | null = null;
  const nodeElements = new Map<string, HTMLElement>();

  const listeners = new Set<() => void>();
  function notify() {
    listeners.forEach((l) => l());
  }

  function applyViewportTransform() {
    if (!worldEl) return;
    worldEl.style.transform = `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`;
    worldEl.style.transformOrigin = "0 0";
  }

  function viewportRect() {
    return viewportEl?.getBoundingClientRect() ?? { left: 0, top: 0, width: 0, height: 0 };
  }

  function screenToCanvas(clientX: number, clientY: number) {
    const rect = viewportRect();
    const localX = clientX - rect.left;
    const localY = clientY - rect.top;
    return {
      x: (localX - viewport.x) / viewport.zoom,
      y: (localY - viewport.y) / viewport.zoom,
    };
  }

  function canvasToScreen(x: number, y: number) {
    const rect = viewportRect();
    return {
      x: rect.left + x * viewport.zoom + viewport.x,
      y: rect.top + y * viewport.zoom + viewport.y,
    };
  }

  // ─── Pan ────────────────────────────────────────────────────────────────────
  // panMove writes the transform directly and skips notify() — pan happens on
  // every pointermove, so re-rendering React for it would defeat the point.
  // panEnd() fires notify() once so anything reading viewport (zoom controls,
  // minimap, etc.) catches up to the final position.

  let panOrigin = { clientX: 0, clientY: 0, viewport: { x: 0, y: 0, zoom: 1 } };

  function panStart(clientX: number, clientY: number) {
    dragState = { type: "pan", startClientX: clientX, startClientY: clientY, startViewport: viewport };
    panOrigin = { clientX, clientY, viewport };
  }

  function panMove(clientX: number, clientY: number) {
    if (dragState.type !== "pan") return;
    const dx = clientX - panOrigin.clientX;
    const dy = clientY - panOrigin.clientY;
    viewport = { ...panOrigin.viewport, x: panOrigin.viewport.x + dx, y: panOrigin.viewport.y + dy };
    applyViewportTransform();
  }

  function panEnd() {
    dragState = { type: "none" };
    notify();
  }

  // ─── Zoom ───────────────────────────────────────────────────────────────────

  function zoomTo(zoom: number, originClient?: { x: number; y: number }) {
    const clamped = clamp(zoom, config.minZoom, config.maxZoom);

    if (originClient) {
      const before = screenToCanvas(originClient.x, originClient.y);
      const rect = viewportRect();
      const localX = originClient.x - rect.left;
      const localY = originClient.y - rect.top;
      viewport = {
        x: localX - before.x * clamped,
        y: localY - before.y * clamped,
        zoom: clamped,
      };
    } else {
      viewport = { ...viewport, zoom: clamped };
    }

    applyViewportTransform();
    notify();
  }

  function nodeBounds() {
    if (nodes.length === 0) return null;
    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;
    for (const n of nodes) {
      minX = Math.min(minX, n.x);
      minY = Math.min(minY, n.y);
      maxX = Math.max(maxX, n.x + n.width);
      maxY = Math.max(maxY, n.y + n.height);
    }
    return { minX, minY, maxX, maxY, width: maxX - minX, height: maxY - minY };
  }

  function zoomToFit(padding = 40) {
    const bounds = nodeBounds();
    const rect = viewportRect();
    if (!bounds || rect.width === 0 || rect.height === 0) return;

    const scaleX = (rect.width - padding * 2) / (bounds.width || 1);
    const scaleY = (rect.height - padding * 2) / (bounds.height || 1);
    const zoom = clamp(Math.min(scaleX, scaleY), config.minZoom, config.maxZoom);

    viewport = {
      x: (rect.width - bounds.width * zoom) / 2 - bounds.minX * zoom,
      y: (rect.height - bounds.height * zoom) / 2 - bounds.minY * zoom,
      zoom,
    };

    applyViewportTransform();
    notify();
  }

  function centerOn(nodeId: string) {
    const node = nodes.find((n) => n.id === nodeId);
    const rect = viewportRect();
    if (!node || rect.width === 0) return;

    const cx = node.x + node.width / 2;
    const cy = node.y + node.height / 2;

    viewport = {
      ...viewport,
      x: rect.width / 2 - cx * viewport.zoom,
      y: rect.height / 2 - cy * viewport.zoom,
    };

    applyViewportTransform();
    notify();
  }

  // ─── Selection ──────────────────────────────────────────────────────────────

  function select(ids: string[], mode: "replace" | "add" | "toggle" = "replace") {
    if (mode === "replace") {
      selection = new Set(ids);
    } else if (mode === "add") {
      selection = new Set(selection);
      ids.forEach((id) => selection.add(id));
    } else {
      selection = new Set(selection);
      ids.forEach((id) => (selection.has(id) ? selection.delete(id) : selection.add(id)));
    }
    notify();
  }

  function clearSelection() {
    selection = new Set();
    notify();
  }

  // Selection box is rendered by React (it's a thin overlay div, not a perf-critical
  // surface like node/pan dragging), so unlike pan/node-drag this DOES notify on every
  // move — the tradeoff is acceptable since it's a short-lived, low-frequency-enough gesture.
  function startSelectBox(clientX: number, clientY: number) {
    const p = screenToCanvas(clientX, clientY);
    dragState = { type: "select-box", startX: p.x, startY: p.y, currentX: p.x, currentY: p.y };
    notify();
  }

  function updateSelectBox(clientX: number, clientY: number) {
    if (dragState.type !== "select-box") return;
    const p = screenToCanvas(clientX, clientY);
    dragState = { ...dragState, currentX: p.x, currentY: p.y };
    notify();
  }

  function endSelectBox(mode: "replace" | "add" = "replace") {
    if (dragState.type !== "select-box") return;
    const { startX, startY, currentX, currentY } = dragState;
    const minX = Math.min(startX, currentX);
    const maxX = Math.max(startX, currentX);
    const minY = Math.min(startY, currentY);
    const maxY = Math.max(startY, currentY);

    const hitIds = nodes
      .filter((n) => n.x < maxX && n.x + n.width > minX && n.y < maxY && n.y + n.height > minY)
      .map((n) => n.id);

    dragState = { type: "none" };
    select(hitIds, mode);
  }

  // ─── Node drag ──────────────────────────────────────────────────────────────
  // updateNodeDrag writes a translate() directly to each dragged node's element
  // and skips notify() — same rationale as pan. endNodeDrag commits the final
  // delta into node state (immutably) in one shot and clears the inline transform.

  function startNodeDrag(ids: string[], clientX: number, clientY: number) {
    const startPositions: Record<string, { x: number; y: number }> = {};
    ids.forEach((id) => {
      const n = nodes.find((node) => node.id === id);
      if (n) startPositions[id] = { x: n.x, y: n.y };
    });
    dragState = { type: "node-drag", ids, startPositions, startClientX: clientX, startClientY: clientY };
  }

  function updateNodeDrag(clientX: number, clientY: number) {
    if (dragState.type !== "node-drag") return;
    const rawDx = (clientX - dragState.startClientX) / viewport.zoom;
    const rawDy = (clientY - dragState.startClientY) / viewport.zoom;

    dragState.ids.forEach((id) => {
      const el = nodeElements.get(id);
      if (el) el.style.transform = `translate(${rawDx}px, ${rawDy}px)`;
    });
  }

  function endNodeDrag() {
    if (dragState.type !== "node-drag") return;
    const { ids } = dragState;

    // Read the last-applied transform off the first dragged element to get the final delta.
    const sampleId = ids[0];
    const el = sampleId ? nodeElements.get(sampleId) : null;
    let dx = 0;
    let dy = 0;
    if (el) {
      const match = /translate\(([-\d.]+)px,\s*([-\d.]+)px\)/.exec(el.style.transform);
      if (match) {
        dx = snap(parseFloat(match[1]), config.gridSnap);
        dy = snap(parseFloat(match[2]), config.gridSnap);
      }
    }

    ids.forEach((id) => {
      const elm = nodeElements.get(id);
      if (elm) elm.style.transform = "";
    });

    dragState = { type: "none" };
    if (dx !== 0 || dy !== 0) {
      moveNodes(ids, dx, dy);
    } else {
      notify();
    }
  }

  // ─── Nodes ──────────────────────────────────────────────────────────────────

  function addNode(node: CanvasNode) {
    nodes = [...nodes, node];
    onChange?.(nodes);
    notify();
  }

  function removeNode(id: string) {
    nodes = nodes.filter((n) => n.id !== id);
    if (selection.has(id)) {
      selection = new Set(selection);
      selection.delete(id);
    }
    onChange?.(nodes);
    notify();
  }

  function updateNode(id: string, patch: Partial<Omit<CanvasNode, "id">>) {
    nodes = nodes.map((n) => (n.id === id ? { ...n, ...patch } : n));
    onChange?.(nodes);
    notify();
  }

  function moveNodes(ids: string[], dx: number, dy: number) {
    const idSet = new Set(ids);
    nodes = nodes.map((n) => (idSet.has(n.id) ? { ...n, x: n.x + dx, y: n.y + dy } : n));
    onChange?.(nodes);
    notify();
  }

  return {
    getViewport: () => viewport,
    getNodes: () => nodes,
    getSelection: () => selection,
    getDragState: () => dragState,

    attachViewportElement: (el) => {
      viewportEl = el;
    },
    attachWorldElement: (el) => {
      worldEl = el;
      applyViewportTransform();
    },
    registerNodeElement: (id, el) => {
      if (el) nodeElements.set(id, el);
      else nodeElements.delete(id);
    },

    panStart,
    panMove,
    panEnd,
    zoomTo,
    zoomToFit,
    centerOn,

    select,
    clearSelection,
    startSelectBox,
    updateSelectBox,
    endSelectBox,

    startNodeDrag,
    updateNodeDrag,
    endNodeDrag,

    addNode,
    removeNode,
    updateNode,
    moveNodes,

    screenToCanvas,
    canvasToScreen,

    subscribe: (listener) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
    destroy: () => {
      listeners.clear();
      nodeElements.clear();
    },
  };
}

import { useCanvasCtx } from "./canvas-context";

/**
 * Call from anywhere under <CanvasRoot> for programmatic control — zoomToFit,
 * centerOn, addNode, etc. — plus read access to nodes/viewport/selection.
 */
export function useCanvas() {
  const ctx = useCanvasCtx();
  return {
    nodes: ctx.nodes,
    viewport: ctx.viewport,
    selection: ctx.selection,
    dragState: ctx.dragState,
    zoomTo: ctx.engine.zoomTo,
    zoomToFit: ctx.engine.zoomToFit,
    centerOn: ctx.engine.centerOn,
    select: ctx.engine.select,
    clearSelection: ctx.engine.clearSelection,
    addNode: ctx.engine.addNode,
    removeNode: ctx.engine.removeNode,
    updateNode: ctx.engine.updateNode,
    moveNodes: ctx.engine.moveNodes,
    screenToCanvas: ctx.engine.screenToCanvas,
    canvasToScreen: ctx.engine.canvasToScreen,
  };
}

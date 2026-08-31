"use client";

import { AudioVisualizerDemo } from "./audio-visualizer-demo";
import { CanvasDemo } from "./canvas-demo";
import { ChecklistDemo } from "./checklist-demo";
import { CommandPaletteDemo } from "./command-palette-demo";
import { CropperDemo, CropperCustomLayoutDemo } from "./cropper-demo";
import { CursorsDemo, CursorsTransportDemo } from "./cursors-demo";
import { DiffViewerDemo } from "./diff-viewer-demo";
import { FileUploadDemo } from "./file-upload-demo";
import { FormEngineDemo, FormEngineShowcase } from "./form-engine-demo";
import { GalleryDemo, GalleryMinimalDemo } from "./gallery-demo";
import { KanbanDemo } from "./kanban-demo";
import { NotificationCenterDemo } from "./notification-center-demo";
import { PaletteEditorDemo } from "./palette-editor-demo";
import { PropertiesPanelDemo } from "./properties-panel-demo";
import { ResizableDemo } from "./resizable-demo";
import { SortableDemo } from "./sortable-demo";
import { SpotlightDemo } from "./spotlight-demo";
import { TourDemo } from "./tour-demo";
import { TreeDemo } from "./tree-demo";

/**
 * Flat registry of every demo component keyed by the name referenced from
 * a doc page's `{ "type": "demo", "component": "..." }` block. Shared by
 * every /docs/components/[slug] page via DocPageRenderer.
 */
export const DEMO_REGISTRY: Record<string, React.ComponentType> = {
  AudioVisualizerDemo,
  CanvasDemo,
  ChecklistDemo,
  CommandPaletteDemo,
  CropperDemo,
  CropperCustomLayoutDemo,
  CursorsDemo,
  CursorsTransportDemo,
  DiffViewerDemo,
  FileUploadDemo,
  FormEngineDemo,
  FormEngineShowcase,
  GalleryDemo,
  GalleryMinimalDemo,
  KanbanDemo,
  NotificationCenterDemo,
  PaletteEditorDemo,
  PropertiesPanelDemo,
  ResizableDemo,
  SortableDemo,
  SpotlightDemo,
  TourDemo,
  TreeDemo,
};

"use client";
import { TourDemo } from "./tour";
import { CommandPaletteDemo } from "./command-palette";
import { FileUploadDemo } from "./file-upload";
import { FormEngineDemo } from "./form-engine";
import { SortableDemo } from "./sortable";
import { TreeDemo } from "./tree";
import { PropertiesPanelDemo } from "./properties-panel";
import { PaletteEditorDemo } from "./palette-editor";
import { GalleryDemo } from "./gallery";
import { SpotlightDemo } from "./spotlight";
// import { ChecklistDemo } from "./checklist";
import { KanbanDemo } from "./kanban";

export const DEMO_REGISTRY: Record<string, React.ComponentType> = {
  tour: TourDemo,
  "command-palette": CommandPaletteDemo,
  "file-upload": FileUploadDemo,
  "form-engine": FormEngineDemo,
  sortable: SortableDemo,
  "palette-editor": PaletteEditorDemo,
  "properties-panel": PropertiesPanelDemo,
  tree: TreeDemo,
  gallery: GalleryDemo,
  spotlight: SpotlightDemo,
  // checklist: ChecklistDemo,
  kanban: KanbanDemo,
};

"use client";

import { DocPageRenderer } from "./doc-page-renderer";
import { DEMO_REGISTRY } from "@/components/demo";
import type { DocPage } from "@/content/docs/doc-schema";

import productTourPage from "@/content/docs/product-tour.json";
import commandPalettePage from "@/content/docs/command-palette.json";
import spotlightPage from "@/content/docs/spotlight.json";
import formEnginePage from "@/content/docs/form-engine.json";
import fileUploadPage from "@/content/docs/file-upload.json";
import sortablePage from "@/content/docs/sortable.json";
import kanbanPage from "@/content/docs/kanban.json";
import propertiesPanelPage from "@/content/docs/properties-panel.json";
import resizablePage from "@/content/docs/resizable.json";
import treePage from "@/content/docs/tree.json";
import galleryPage from "@/content/docs/gallery.json";
import cropperPage from "@/content/docs/cropper.json";
import palettePage from "@/content/docs/palette.json";
import cursorsPage from "@/content/docs/cursors.json";
import checklistPage from "@/content/docs/checklist.json";
import audioVisualizerPage from "@/content/docs/audio-visualizer.json";
import canvasPage from "@/content/docs/canvas.json";
import diffViewerPage from "@/content/docs/diff-viewer.json";
import notificationCenterPage from "@/content/docs/notification-center.json";

/** Every system's doc page data, keyed by its manifest `route` slug. */
const DOC_PAGES: Record<string, DocPage> = {
  "product-tour": productTourPage as DocPage,
  "command-palette": commandPalettePage as DocPage,
  spotlight: spotlightPage as DocPage,
  "form-engine": formEnginePage as DocPage,
  "file-upload": fileUploadPage as DocPage,
  sortable: sortablePage as DocPage,
  kanban: kanbanPage as DocPage,
  "properties-panel": propertiesPanelPage as DocPage,
  resizable: resizablePage as DocPage,
  tree: treePage as DocPage,
  gallery: galleryPage as DocPage,
  cropper: cropperPage as DocPage,
  palette: palettePage as DocPage,
  cursors: cursorsPage as DocPage,
  checklist: checklistPage as DocPage,
  "audio-visualizer": audioVisualizerPage as DocPage,
  canvas: canvasPage as DocPage,
  "diff-viewer": diffViewerPage as DocPage,
  "notification-center": notificationCenterPage as DocPage,
};

export function getDocSystemPage(slug: string): DocPage | undefined {
  return DOC_PAGES[slug];
}

/** Single renderer for every /docs/components/[slug] page. */
export function DocSystemPage({ slug }: { slug: string }) {
  const page = DOC_PAGES[slug];
  if (!page) return null;
  return <DocPageRenderer page={page} demoRegistry={DEMO_REGISTRY} />;
}

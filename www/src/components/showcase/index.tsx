"use client";

import { MediaLibrary } from "@/components/showcase/media-library";
import { FormEngineShowcase } from "@/components/demo/form-engine-demo";

import { TourDemo } from "@/components/demo/tour-demo";
import { CommandPaletteDemo } from "@/components/demo/command-palette-demo";
import { SortableDemo } from "@/components/demo/sortable-demo";
import { PaletteEditorDemo } from "@/components/demo/palette-editor-demo";
import { PropertiesPanelDemo } from "@/components/demo/properties-panel-demo";
import { TreeDemo } from "@/components/demo/tree-demo";
import { GalleryDemo } from "@/components/demo/gallery-demo";
import { SpotlightDemo } from "../demo/spotlight-demo";
import { ChecklistDemo } from "../demo/checklist-demo";

export const SYSTEMS = [
  {
    id: "product-tour",
    title: "Product Tour",

    painRemoved:
      "No more positioning logic, overlay masking, scroll handling, or skip state.",
    what: "A guided tour that works. Floating cards anchored to any element, keyboard navigation, media per step, SVG overlay masking — all pre-wired.",
    href: "/docs/components/product-tour",
    accent: "#c2f13c",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/tour.json",
    demo: <TourDemo />,
  },
  {
    id: "command-palette",
    title: "Command Palette",
    painRemoved:
      "No more building fuzzy search, keyboard navigation, or grouped results from scratch.",
    what: "⌘K that actually works. Fuzzy search with zero dependencies, source and filter tabs, grouped results with avatars, accessible keyboard flow.",
    href: "/docs/components/command-palette",
    accent: "#818cf8",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/command-palette.json",
    demo: <CommandPaletteDemo />,
  },
  {
    id: "file-upload",
    title: "File Upload",
    painRemoved:
      "No more abort controllers, retry logic, per-file error handling, or progress tracking.",
    what: "Drag-and-drop with per-file progress, cancel, retry, grid and list views. You bring one function — the upload handler. The system handles everything else.",
    href: "/docs/components/file-upload",
    accent: "#f97316",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/file-upload.json",
    demo: <MediaLibrary />,
  },
  {
    id: "form-engine",
    title: "Form Engine",
    painRemoved:
      "No more multi-step state machines, per-step validation, or back/forward navigation bugs.",
    what: "Form orchestration with a plugin architecture. react-hook-form + zod, conditional fields, custom layouts. The engine owns the steps. Your fields and logic stay yours.",
    href: "/docs/components/form-engine",
    accent: "#e879f9",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/form-engine.json",
    demo: <FormEngineShowcase />,
  },
  {
    id: "sortable",
    title: "Sortable",
    painRemoved:
      "No more drag-and-drop edge cases — reordering, nesting, keyboard support, or auto-scrolling.",
    what: "A drag-and-drop system that just works. Reorder flat lists or nested trees with mouse or keyboard. Auto-scrolling, drop indicators, and a11y best practices baked in.",
    href: "/docs/components/sortable",
    accent: "#e879f9",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/sortable.json",
    demo: <SortableDemo />,
  },
  {
    id: "palette-editor",
    title: "Palette Editor",
    painRemoved:
      "No more building custom color pickers or managing complex palette states.",
    what: "A flexible palette editor with real-time preview, import/export functionality, and a clean UI. Customize your color schemes without writing any CSS.",
    href: "/docs/components/palette",
    date: "2025-02-04",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/palette.json",
    demo: <PaletteEditorDemo />,
  },
  {
    id: "properties-panel",
    title: "Properties Panel",
    painRemoved:
      "No more building custom property editors or managing complex state.",
    what: "A flexible properties panel with real-time preview, import/export functionality, and a clean UI. Customize your component properties without writing any CSS.",
    href: "/docs/components/properties-panel",
    accent: "#c2f13c",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/properties-panel.json",
    demo: <PropertiesPanelDemo />,
  },
  {
    id: "tree",
    title: "Tree View",
    painRemoved:
      "No more building custom tree views or managing complex nested state.",
    what: "A flexible tree view with real-time preview, import/export functionality, and a clean UI. Customize your component properties without writing any CSS.",
    href: "/docs/components/tree",
    accent: "#f97316",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/tree.json",
    demo: <TreeDemo />,
  },
  {
    id: "gallery",
    title: "Gallery",
    painRemoved:
      "No more building custom galleries or managing complex media states.",
    what: "A flexible gallery with real-time preview, import/export functionality, and a clean UI. Customize your media display without writing any CSS.",
    href: "/docs/components/gallery",
    accent: "#e879f9",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/gallery.json",
    demo: <GalleryDemo />,
  },
  {
    id: "spotlight",
    title: "Spotlight Search",
    painRemoved:
      "No more building custom spotlight search or managing complex state.",
    what: "A flexible spotlight search with real-time preview, import/export functionality, and a clean UI. Customize your search display without writing any CSS.",
    href: "/docs/components/spotlight",
    accent: "#818cf8",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/spotlight.json",
    demo: <SpotlightDemo />,
  },
  {
    id: "checklist",
    title: "Onboarding Checklist",
    painRemoved:
      "No more building custom onboarding checklists or managing complex state.",
    what: "A flexible onboarding checklist with real-time preview, import/export functionality, and a clean UI. Customize your onboarding experience without writing any CSS.",
    href: "/docs/components/checklist",
    accent: "#818cf8",
    cmd: "npx shadcn@latest add https://bevelui.vercel.app/r/checklist.json",
    demo: <ChecklistDemo />,
  },
];

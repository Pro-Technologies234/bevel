import type { Metadata } from "next";
import {
  IconChecklist,
  IconCrop,
  IconCursorOff,
  IconDragDrop,
  IconFileUploadFilled,
  IconForms,
  IconLayoutKanban,
  IconLayoutSidebarRightInactive,
  IconListSearch,
  IconListTree,
  IconPaletteFilled,
  IconPhotoFilled,
  IconPointer,
  IconRoute,
  IconWorldSearch,
} from "@tabler/icons-react";
import type { SidebarSection } from "@/components/shared/sidebar";

// ─── Types ────────────────────────────────────────────────────────────────────

export type DocsCategoryId =
  | "navigation-search"
  | "forms-input"
  | "drag-drop"
  | "layout-panels"
  | "media-color"
  | "collaboration";

export type DocsTier = "free" | "pro" | "beta" | "new" | "updated";

export type DocsManifestItem = {
  /** Registry item name used in install command */
  registryName: string;
  /** Display title */
  title: string;
  /** One-line description for cards and headers */
  description: string;
  /** App Router path segment under /docs/components/ */
  route: string;
  category: DocsCategoryId;
  tier: DocsTier;
  useCases: string[];
  builtWith: string[];
  /** Key in DEMO_REGISTRY, if a live preview exists */
  demoKey?: string;
  /** Tabler icon for sidebar */
  icon?: React.ComponentType<{
    size?: number;
    strokeWidth?: number;
    className?: string;
  }>;
  /** Related system routes for "More like this" */
  related?: string[];
  keywords?: string[];
};

export type DocsCategory = {
  id: DocsCategoryId;
  label: string;
  description: string;
};

// ─── Categories ───────────────────────────────────────────────────────────────

export const DOCS_CATEGORIES: DocsCategory[] = [
  {
    id: "navigation-search",
    label: "Navigation & Search",
    description: "Command menus, search overlays, and guided tours.",
  },
  {
    id: "forms-input",
    label: "Forms & Input",
    description: "Multi-step forms, uploads, and field controls.",
  },
  {
    id: "drag-drop",
    label: "Drag & Drop",
    description: "Reorder lists and multi-column boards.",
  },
  {
    id: "layout-panels",
    label: "Layout & Panels",
    description: "Split panes, property inspectors, and tree views.",
  },
  {
    id: "media-color",
    label: "Media & Color",
    description: "Galleries, croppers, and palette tools.",
  },
  {
    id: "collaboration",
    label: "Collaboration",
    description: "Presence, cursors, and onboarding widgets.",
  },
];

const REGISTRY_BASE = "https://bevelui.vercel.app/r";

// ─── Systems manifest ─────────────────────────────────────────────────────────

export const DOCS_SYSTEMS: DocsManifestItem[] = [
  {
    registryName: "tour",
    title: "Product Tour",
    description:
      "Guide users through your app with an animated overlay, smart-positioned tooltip cards, media support, and keyboard navigation.",
    route: "product-tour",
    category: "navigation-search",
    tier: "free",
    useCases: ["Onboarding", "SaaS", "Feature discovery"],
    builtWith: ["Motion", "@floating-ui/react", "Tailwind CSS"],
    demoKey: "tour",
    icon: IconRoute,
    related: ["command-palette", "checklist"],
    keywords: ["tour", "onboarding", "walkthrough"],
  },
  {
    registryName: "command-palette",
    title: "Command Palette",
    description:
      "⌘K command menu with fuzzy search, two-tier tab filtering, grouped results, avatar support, and zero external dependencies.",
    route: "command-palette",
    category: "navigation-search",
    tier: "new",
    useCases: ["Dashboard", "Productivity app", "Admin panel"],
    builtWith: ["Motion", "Tailwind CSS"],
    demoKey: "command-palette",
    icon: IconListSearch,
    related: ["spotlight", "product-tour"],
    keywords: ["command", "palette", "keyboard", "search"],
  },
  {
    registryName: "spotlight",
    title: "Spotlight Search",
    description:
      "Async content search with category tabs, recent history, and rich result cards. Triggered by / — distinct from Command Palette.",
    route: "spotlight",
    category: "navigation-search",
    tier: "free",
    useCases: ["Docs site", "Knowledge base", "CMS"],
    builtWith: ["Motion", "Tailwind CSS"],
    demoKey: "spotlight",
    icon: IconWorldSearch,
    related: ["command-palette", "tree"],
    keywords: ["spotlight", "search", "async"],
  },
  {
    registryName: "form-engine",
    title: "Form Engine",
    description:
      "Multi-step or single-step form orchestration. Plugin system, react-hook-form + zod integration, conditional fields, custom layouts.",
    route: "form-engine",
    category: "forms-input",
    tier: "beta",
    useCases: ["Onboarding flow", "Settings", "Checkout"],
    builtWith: ["react-hook-form", "zod", "Tailwind CSS"],
    demoKey: "form-engine",
    icon: IconForms,
    related: ["file-upload", "checklist"],
    keywords: ["form", "multi-step", "validation"],
  },
  {
    registryName: "file-upload",
    title: "File Upload",
    description:
      "Drag-and-drop file upload with per-file progress, cancel, retry, grid/list views, and a modal mode. Bring your own upload function.",
    route: "file-upload",
    category: "forms-input",
    tier: "free",
    useCases: ["CMS", "Profile settings", "Asset manager"],
    builtWith: ["Motion", "Tailwind CSS"],
    demoKey: "file-upload",
    icon: IconFileUploadFilled,
    related: ["form-engine", "gallery"],
    keywords: ["upload", "drag-and-drop", "files"],
  },
  {
    registryName: "sortable",
    title: "Sortable",
    description:
      "Headless drag-to-reorder system. Wrap any list, mark rows, optionally restrict drag to a handle. useSortableList manages the array.",
    route: "sortable",
    category: "drag-drop",
    tier: "free",
    useCases: ["Task list", "Playlist", "Menu editor"],
    builtWith: ["Motion", "Tailwind CSS"],
    demoKey: "sortable",
    icon: IconDragDrop,
    related: ["kanban", "tree"],
    keywords: ["sortable", "drag", "reorder"],
  },
  {
    registryName: "kanban",
    title: "Kanban",
    description:
      "Multi-container drag-and-drop board with virtual state machine. Drag cards between columns, reorder columns, live placeholders during drag.",
    route: "kanban",
    category: "drag-drop",
    tier: "free",
    useCases: ["Project board", "CRM pipeline", "Sprint planning"],
    builtWith: ["Motion", "Tailwind CSS"],
    demoKey: "kanban",
    icon: IconLayoutKanban,
    related: ["sortable", "checklist"],
    keywords: ["kanban", "board", "columns"],
  },
  {
    registryName: "properties-panel",
    title: "Properties Panel",
    description:
      "Figma-style properties panel with collapsible sections, typed control rows, and a data-driven or headless API.",
    route: "properties-panel",
    category: "layout-panels",
    tier: "free",
    useCases: ["Design tool", "Builder", "Admin config"],
    builtWith: ["Tailwind CSS"],
    demoKey: "properties-panel",
    icon: IconLayoutSidebarRightInactive,
    related: ["palette", "tree"],
    keywords: ["properties", "panel", "inspector"],
  },
  {
    registryName: "resizable",
    title: "Resizable Panels",
    description:
      "Split-pane layouts with smooth drag-to-resize, min/max constraints, and collapsible panels. Zero re-renders during drag.",
    route: "resizable",
    category: "layout-panels",
    tier: "free",
    useCases: ["IDE layout", "Email client", "Dashboard split"],
    builtWith: ["Tailwind CSS"],
    icon: IconLayoutSidebarRightInactive,
    related: ["properties-panel", "tree"],
    keywords: ["resizable", "split", "panels"],
  },
  {
    registryName: "tree",
    title: "Tree View",
    description:
      "Recursive hierarchical data with expand/collapse, multi-select, full keyboard navigation, and optional connecting lines.",
    route: "tree",
    category: "layout-panels",
    tier: "updated",
    useCases: ["File explorer", "Org chart", "Sidebar nav"],
    builtWith: ["Tailwind CSS"],
    demoKey: "tree",
    icon: IconListTree,
    related: ["sortable", "properties-panel"],
    keywords: ["tree", "hierarchy", "nested"],
  },
  {
    registryName: "gallery",
    title: "Media Gallery",
    description:
      "A selectable media grid for images, video, audio, and documents. Multi-select, type filtering, keyboard-navigable lightbox, and drag-to-reorder.",
    route: "gallery",
    category: "media-color",
    tier: "free",
    useCases: ["Asset library", "Photo picker", "CMS media"],
    builtWith: ["Motion", "Tailwind CSS"],
    demoKey: "gallery",
    icon: IconPhotoFilled,
    related: ["file-upload", "cropper"],
    keywords: ["gallery", "media", "lightbox"],
  },
  {
    registryName: "cropper",
    title: "Image Cropper",
    description:
      "Dual coordinate spaces, eight-handle drag with aspect ratio enforcement, rule-of-thirds overlay, and offscreen canvas export at full image resolution.",
    route: "cropper",
    category: "media-color",
    tier: "pro",
    useCases: ["Avatar upload", "Social app", "Print editor"],
    builtWith: ["Canvas API", "Tailwind CSS"],
    demoKey: "cropper",
    icon: IconCrop,
    related: ["file-upload", "gallery"],
    keywords: ["cropper", "image", "canvas"],
  },
  {
    registryName: "palette",
    title: "Palette Editor",
    description:
      "Visual color palette editor with a 2D HSV picker, sortable swatches, and one-click export to hex, CSS vars, Tailwind config, or HSL.",
    route: "palette",
    category: "media-color",
    tier: "free",
    useCases: ["Design system", "Theme builder", "Brand kit"],
    builtWith: ["Tailwind CSS"],
    demoKey: "palette-editor",
    icon: IconPaletteFilled,
    related: ["properties-panel", "form-engine"],
    keywords: ["palette", "color", "picker"],
  },
  {
    registryName: "cursors",
    title: "Collaborative Cursors",
    description:
      "Real-time presence overlay with conflict-free position sync, idle detection, and a label overlap resolver that prevents names from stacking.",
    route: "cursors",
    category: "collaboration",
    tier: "pro",
    useCases: ["Multiplayer app", "Whiteboard", "Live editing"],
    builtWith: ["Motion", "Tailwind CSS"],
    demoKey: "cursors",
    icon: IconPointer,
    related: ["checklist", "kanban"],
    keywords: ["cursors", "presence", "collaboration"],
  },
  {
    registryName: "checklist",
    title: "Onboarding Checklist",
    description:
      "A floating checklist widget with step dependencies, localStorage persistence, and animated expand/collapse.",
    route: "checklist",
    category: "collaboration",
    tier: "free",
    useCases: ["SaaS onboarding", "Setup wizard", "Activation"],
    builtWith: ["Motion", "Tailwind CSS"],
    icon: IconChecklist,
    related: ["product-tour", "form-engine"],
    keywords: ["checklist", "onboarding", "widget"],
  },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

export function getSystemHref(route: string) {
  return `/docs/components/${route}`;
}

export function getInstallCommand(registryName: string) {
  return `npx shadcn@latest add ${REGISTRY_BASE}/${registryName}.json`;
}

export function getSystemByRoute(route: string) {
  return DOCS_SYSTEMS.find((s) => s.route === route);
}

export function getSystemsByCategory(categoryId: DocsCategoryId) {
  return DOCS_SYSTEMS.filter((s) => s.category === categoryId);
}

export function getRelatedSystems(route: string) {
  const system = getSystemByRoute(route);
  if (!system?.related) return [];
  return system.related
    .map((r) => getSystemByRoute(r))
    .filter(Boolean) as DocsManifestItem[];
}

export function getTierBadge(tier: DocsTier): {
  label: string;
  variant: "new" | "red" | "primary" | "green" | "pro" | "amber" | "indigo";
} | null {
  switch (tier) {
    case "pro":
      return { label: "Pro", variant: "pro" };
    case "beta":
      return { label: "Beta", variant: "red" };
    case "new":
      return { label: "New", variant: "new" };
    case "updated":
      return { label: "Updated", variant: "primary" };
    default:
      return null;
  }
}

export function getCategoryLabel(categoryId: DocsCategoryId) {
  return DOCS_CATEGORIES.find((c) => c.id === categoryId)?.label ?? categoryId;
}

/** Build sidebar sections from manifest — single source of truth */
export function buildDocsSidebarSections(): SidebarSection[] {
  const categorySections: SidebarSection[] = DOCS_CATEGORIES.map((cat) => ({
    label: cat.label,
    collapsible: true,
    defaultOpen: true,
    actions: [
      ...getSystemsByCategory(cat.id).map((system) => {
        const badge = getTierBadge(system.tier);
        return {
          label: system.title,
          href: getSystemHref(system.route),
          icon: system.icon,
          badge: badge?.label,
          badgeVariant: badge?.variant,
        };
      }),
    ],
  })).filter((section) => section.actions.length > 0);

  return [
    {
      label: "Getting Started",
      icon: IconRoute,
      collapsible: true,
      defaultOpen: true,
      actions: [
        { label: "Introduction", href: "/docs/introduction" },
        { label: "Installation", href: "/docs/installation" },
        { label: "All Systems", href: "/docs/components" },
      ],
    },
    ...categorySections,
  ];
}

// ─── Metadata Generators & Constants — Single Source of Truth ────────────────

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";

export function getSystemMetadata(route: string): Metadata {
  const system = getSystemByRoute(route);
  if (!system) {
    return {
      title: "Component — Bevel UI",
      description: "Fully-engineered UI system for React.",
    };
  }

  const title = `${system.title} — Bevel UI`;
  const description = system.description;
  const canonicalUrl = `${SITE_URL}/docs/components/${system.route}`;
  const ogType = system.demoKey || system.registryName || "docs";
  const ogImageUrl = `${SITE_URL}/og?type=${ogType}`;

  return {
    title,
    description,
    keywords: system.keywords ?? [
      system.title,
      system.category,
      ...system.builtWith,
      "bevel ui",
    ],
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: "website",
      url: canonicalUrl,
      title,
      description,
      siteName: "Bevel UI",
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: `${system.title} — Bevel UI`,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImageUrl],
    },
  };
}

export const docsRootMetadata: Metadata = {
  title: "Documentation",
  description:
    "Full documentation for all Bevel UI systems. Installation, API reference, live demos, and code examples for Product Tour, Command Palette, File Upload, Form Engine, Kanban, and more.",
  alternates: { canonical: `${SITE_URL}/docs` },
  openGraph: {
    url: `${SITE_URL}/docs`,
    title: "Documentation — Bevel UI",
    description:
      "Installation, API reference, live demos, and code examples for all Bevel UI systems.",
    images: [
      {
        url: `${SITE_URL}/og?type=docs`,
        width: 1200,
        height: 630,
        alt: "Bevel UI Documentation",
      },
    ],
  },
  twitter: {
    title: "Documentation — Bevel UI",
    description:
      "Full docs for all Bevel UI systems with live interactive demos.",
    images: [`${SITE_URL}/og?type=docs`],
  },
};

export const docsIntroductionMetadata: Metadata = {
  title: "Introduction",
  description:
    "Learn what Bevel UI is, how it's different from a component library, and the philosophy behind the copy-to-own model.",
  alternates: { canonical: `${SITE_URL}/docs/introduction` },
  openGraph: {
    url: `${SITE_URL}/docs/introduction`,
    title: "Introduction — Bevel UI Docs",
    description:
      "What Bevel UI is and why it exists. Not a component library — a system.",
    images: [
      {
        url: `${SITE_URL}/og?type=docs`,
        width: 1200,
        height: 630,
        alt: "Bevel UI Introduction",
      },
    ],
  },
};

export const docsInstallationMetadata: Metadata = {
  title: "Installation",
  description:
    "Install any Bevel UI system with a single shadcn CLI command. Files copy directly into your project — no npm package, no external dependency.",
  alternates: { canonical: `${SITE_URL}/docs/installation` },
  openGraph: {
    url: `${SITE_URL}/docs/installation`,
    title: "Installation — Bevel UI Docs",
    description:
      "One CLI command. Files land in components/bevelui/. You own them forever.",
    images: [
      {
        url: `${SITE_URL}/og?type=docs`,
        width: 1200,
        height: 630,
        alt: "Bevel UI Installation",
      },
    ],
  },
};

export const docsComponentsMetadata: Metadata = {
  title: "Systems",
  description:
    "All available Bevel UI systems — Product Tour, Command Palette, File Upload, Form Engine, Kanban, Cropper, and more. Copy to own.",
  alternates: { canonical: `${SITE_URL}/docs/components` },
  openGraph: {
    url: `${SITE_URL}/docs/components`,
    title: "Systems — Bevel UI Docs",
    description: "All Bevel UI systems. Install any one with the shadcn CLI.",
    images: [
      {
        url: `${SITE_URL}/og?type=docs`,
        width: 1200,
        height: 630,
        alt: "Bevel UI Systems",
      },
    ],
  },
};

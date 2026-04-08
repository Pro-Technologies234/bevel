/**
 * Content schema for Bevel UI documentation pages.
 *
 * Each doc page is described by a DocPage object.
 * These are stored as JSON and rendered by the page component.
 *
 * When you add a backend/CMS later, you can:
 *   1. Keep this schema as the data contract
 *   2. Replace the local JSON imports with API fetch calls
 *   3. The page components don't need to change
 */

export type DocPageMeta = {
  title: string;
  description: string;
  badge?: string;
  slug: string;
  prev?: { label: string; href: string };
  next?: { label: string; href: string };
};

export type DocTOCItem = {
  id: string;
  label: string;
  depth?: 1 | 2 | 3;
};

// ─── Content block types ──────────────────────────────────────────────────────

export type DocBlockText = {
  type: "text";
  content: string;
};

export type DocBlockCode = {
  type: "code";
  code: string;
  language?: string;
  filename?: string;
  highlightLines?: number[];
  showLineNumbers?: boolean;
};

export type DocBlockCallout = {
  type: "callout";
  variant: "info" | "warning" | "tip" | "danger";
  title?: string;
  content: string;
};

export type DocBlockPropsTable = {
  type: "props-table";
  rows: {
    prop: string;
    type: string;
    default?: string;
    required?: boolean;
    description: string;
  }[];
};

export type DocBlockSteps = {
  type: "steps";
  steps: {
    title: string;
    description?: string;
    code?: string;
    codeLanguage?: string;
    codeFilename?: string;
  }[];
};

export type DocBlockFileTree = {
  type: "file-tree";
  nodes: FileTreeNode[];
};

export type FileTreeNode = {
  name: string;
  type: "file" | "folder";
  highlight?: boolean;
  comment?: string;
  children?: FileTreeNode[];
};

/**
 * "demo" blocks reference a component by name.
 * The page renders a <React.Suspense> wrapper around a dynamic import.
 * This keeps JSON serialisable while still supporting live demos.
 */
export type DocBlockDemo = {
  type: "demo";
  /** Must match a key in the page's demoRegistry */
  component: string;
  label?: string;
  code?: string;
  codeFilename?: string;
};

export type DocBlock =
  | DocBlockText
  | DocBlockCode
  | DocBlockCallout
  | DocBlockPropsTable
  | DocBlockSteps
  | DocBlockFileTree
  | DocBlockDemo;

// ─── Section ──────────────────────────────────────────────────────────────────

export type DocSection = {
  id: string;
  title?: string;
  blocks: DocBlock[];
};

// ─── Full page ────────────────────────────────────────────────────────────────

export type DocPage = {
  meta: DocPageMeta;
  tocs: DocTOCItem[];
  sections: DocSection[];
};

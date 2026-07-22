/**
 * Content schema for Bevel UI documentation pages.
 *
 * Each doc page is described by a DocPage object.
 * These are stored as JSON and rendered by the page component.
 */

export type DocPageMeta = {
  title: string;
  description: string;
  badge?: string;
  slug: string;
  category?: string;
  useCases?: string[];
  tier?: "free" | "pro" | "beta";
  builtWith?: string[];
  related?: string[];
  registryName?: string;
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

export type DocBlockDemo = {
  type: "demo";
  component: string;
  label?: string;
  code?: string;
  codeFilename?: string;
  preview?: string;
};

export type DocBlockInstall = {
  type: "install";
  registryName: string;
  optionalSteps?: {
    title: string;
    code?: string;
    note?: string;
  }[];
};

export type DocBlockFaq = {
  type: "faq";
  items: {
    q: string;
    a: string;
  }[];
};

export type DocBlockRelated = {
  type: "related";
  currentRoute: string;
};

export type DocBlockBuiltWith = {
  type: "built-with";
  techs: string[];
};

export type DocBlock =
  | DocBlockText
  | DocBlockCode
  | DocBlockCallout
  | DocBlockPropsTable
  | DocBlockSteps
  | DocBlockFileTree
  | DocBlockDemo
  | DocBlockInstall
  | DocBlockFaq
  | DocBlockRelated
  | DocBlockBuiltWith;

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

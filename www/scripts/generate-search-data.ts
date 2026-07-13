// scripts/generate-search-data.ts
import fs from "fs";
import path from "path";

const DOCS_DIR = path.join(process.cwd(), "src/content/docs");
const OUTPUT_PATH = path.join(
  process.cwd(),
  "src/content/docs-search-data.json",
);

function generateSearchData() {
  const sections: any[] = [];

  // 1. Add "Getting Started" pages manually (Introduction, Installation)
  sections.push({
    id: "getting-started",
    title: "Getting Started",
    items: [
      {
        id: "intro-what",
        title: "What is Bevel UI?",
        description:
          "Fully-engineered UI systems for React. Not a component library.",
        href: "/docs/introduction",
        category: "getting-started",
        keywords: ["introduction", "overview", "about", "bevel", "what is"],
      },
      {
        id: "intro-how",
        title: "How it works",
        description:
          "Install with shadcn CLI, copy source files, own it forever.",
        href: "/docs/introduction#how-it-works",
        category: "getting-started",
        keywords: ["shadcn", "cli", "install", "copy", "source"],
      },
      {
        id: "intro-philosophy",
        title: "Philosophy — No installs, no lock-in",
        description: "The principles behind every Bevel system.",
        href: "/docs/introduction#philosophy",
        category: "getting-started",
        keywords: [
          "philosophy",
          "no lock-in",
          "no installs",
          "shadcn compatible",
        ],
      },
      {
        id: "installation-prereqs",
        title: "Prerequisites",
        description: "What you need before installing Bevel systems.",
        href: "/docs/installation#prerequisites",
        category: "getting-started",
        keywords: [
          "prerequisites",
          "next.js",
          "react",
          "tailwind",
          "shadcn setup",
        ],
      },
      {
        id: "installation-cli",
        title: "Install a system",
        description:
          "npx shadcn@latest add https://bevelui.vercel.app/r/tour.json",
        href: "/docs/installation#install-system",
        category: "getting-started",
        keywords: ["install", "npx", "shadcn", "add", "cli command"],
      },
      {
        id: "installation-paths",
        title: "Import paths",
        description: "How to import Bevel systems after installation.",
        href: "/docs/installation#import-paths",
        category: "getting-started",
        keywords: ["import", "paths", "components/bevelui", "alias"],
      },
      {
        id: "installation-structure",
        title: "Folder structure",
        description:
          "Where files are placed after install: components/bevelui/",
        href: "/docs/installation#folder-structure",
        category: "getting-started",
        keywords: ["folder", "structure", "bevelui", "components", "directory"],
      },
    ],
  });

  // 2. Read all component doc files
  const files = fs.readdirSync(DOCS_DIR).filter((f) => f.endsWith(".json"));

  for (const file of files) {
    const doc = JSON.parse(fs.readFileSync(path.join(DOCS_DIR, file), "utf-8"));
    const slug = doc.meta.slug;

    // Top-level entry
    const items = [
      {
        id: `${slug}-overview`,
        title: doc.meta.title,
        description: doc.meta.description,
        href: `/docs/components/${slug}`,
        category: slug,
        keywords: [slug, ...(doc.meta.keywords || [])],
      },
    ];

    // TOC section entries
    for (const toc of doc.tocs) {
      const label = toc.label;
      const id = toc.id;
      // Skip if it's the overview (already have top-level)
      if (id === "overview") continue;

      items.push({
        id: `${slug}-${id}`,
        title: `${doc.meta.title} — ${label}`,
        description: `Learn about ${label} in the ${doc.meta.title} system.`,
        href: `/docs/components/${slug}#${id}`,
        category: slug,
        keywords: [slug, id, label.toLowerCase(), ...(toc.keywords || [])],
      });
    }

    sections.push({
      id: slug,
      title: doc.meta.title,
      items,
    });
  }

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify({ sections }, null, 2));
}

generateSearchData();

import { NextResponse } from "next/server";
import { DOCS_SYSTEMS } from "@/content/docs/manifest";
import fs from "fs";
import path from "path";

export const revalidate = 86400; // Cache for 24 hours

export async function GET() {
  const SITE_URL =
    process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";

  let content = `# Bevel UI — Complete Documentation Corpus\n\n`;
  content += `> Fully-engineered UI systems for React. Copy the code into your project and own it forever. shadcn compatible. No npm package. No lock-in.\n\n`;
  content += `Site URL: ${SITE_URL}\n`;
  content += `Generated: ${new Date().toISOString()}\n\n`;
  content += `=`.repeat(80) + `\n\n`;

  const docsDir = path.join(process.cwd(), "src", "content", "docs");

  // Add Introduction & Installation
  const corePages = ["introduction.json", "installation.json"];
  for (const file of corePages) {
    const filePath = path.join(docsDir, file);
    if (fs.existsSync(filePath)) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        content += `# DOCUMENTATION: ${json.meta?.title?.toUpperCase()}\n\n`;
        if (json.meta?.description) {
          content += `${json.meta.description}\n\n`;
        }
        if (json.sections) {
          for (const section of json.sections) {
            content += `## ${section.title || section.id}\n\n`;
            for (const block of section.blocks || []) {
              if (block.type === "text") {
                content += `${block.content}\n\n`;
              } else if (block.type === "code") {
                content += `\`\`\`${block.language || ""}${block.filename ? ` filename="${block.filename}"` : ""}\n${block.code}\n\`\`\`\n\n`;
              } else if (block.type === "callout") {
                content += `> **${block.title || "Note"}**: ${block.content}\n\n`;
              } else if (block.type === "steps") {
                for (const step of block.steps || []) {
                  content += `### Step: ${step.title}\n`;
                  if (step.description) content += `${step.description}\n`;
                  if (step.code) {
                    content += `\`\`\`${step.codeLanguage || "bash"}\n${step.code}\n\`\`\`\n`;
                  }
                  content += `\n`;
                }
              }
            }
          }
        }
        content += `=`.repeat(80) + `\n\n`;
      } catch {
        // Skip unparseable files
      }
    }
  }

  // Add all systems documentation
  for (const system of DOCS_SYSTEMS) {
    const filePath = path.join(docsDir, `${system.route}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const json = JSON.parse(fs.readFileSync(filePath, "utf-8"));
        content += `# SYSTEM: ${system.title.toUpperCase()}\n`;
        content += `Route: ${SITE_URL}/docs/components/${system.route}\n`;
        content += `Category: ${system.category}\n`;
        content += `Tier: ${system.tier}\n`;
        content += `Install Command: npx shadcn@latest add https://bevelui.vercel.app/r/${system.registryName}.json\n`;
        content += `Description: ${system.description}\n\n`;

        if (json.sections) {
          for (const section of json.sections) {
            content += `## ${section.title || section.id}\n\n`;
            for (const block of section.blocks || []) {
              if (block.type === "text") {
                content += `${block.content}\n\n`;
              } else if (block.type === "code") {
                content += `\`\`\`${block.language || ""}${block.filename ? ` filename="${block.filename}"` : ""}\n${block.code}\n\`\`\`\n\n`;
              } else if (block.type === "callout") {
                content += `> **${block.title || "Note"}**: ${block.content}\n\n`;
              } else if (block.type === "props-table") {
                content += `### Props API Reference\n\n`;
                for (const row of block.rows || []) {
                  content += `- **\`${row.prop}\`** (\`${row.type}\`): ${row.description}${row.default ? ` (Default: \`${row.default}\`)` : ""}\n`;
                }
                content += `\n`;
              } else if (block.type === "steps") {
                for (const step of block.steps || []) {
                  content += `### Step: ${step.title}\n`;
                  if (step.description) content += `${step.description}\n`;
                  if (step.code) {
                    content += `\`\`\`${step.codeLanguage || "bash"}\n${step.code}\n\`\`\`\n`;
                  }
                  content += `\n`;
                }
              } else if (block.type === "file-tree") {
                content += `### System File Structure\n\n`;
                const formatNodes = (nodes: any[], depth = 0) => {
                  for (const node of nodes) {
                    content += `${"  ".repeat(depth)}- ${node.name}${node.comment ? ` (${node.comment})` : ""}\n`;
                    if (node.children) formatNodes(node.children, depth + 1);
                  }
                };
                formatNodes(block.nodes || []);
                content += `\n`;
              }
            }
          }
        }
        content += `=`.repeat(80) + `\n\n`;
      } catch {
        // Skip unparseable files
      }
    }
  }

  return new NextResponse(content, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}

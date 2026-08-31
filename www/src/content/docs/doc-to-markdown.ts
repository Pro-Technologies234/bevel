import type { DocPage, DocBlock } from "./doc-schema";

function blockToMarkdown(block: DocBlock): string {
  switch (block.type) {
    case "text":
      return block.content;

    case "code":
      return `\`\`\`${block.language ?? ""}${block.filename ? ` title="${block.filename}"` : ""}\n${block.code}\n\`\`\``;

    case "callout":
      return `> **${block.variant === "tip" ? "Tip" : block.variant === "warning" ? "Warning" : block.variant === "danger" ? "Warning" : "Note"}${block.title ? `: ${block.title}` : ""}**\n> ${block.content}`;

    case "props-table": {
      const header = "| Prop | Type | Default | Description |\n|---|---|---|---|";
      const rows = block.rows
        .map(
          (r) =>
            `| \`${r.prop}\`${r.required ? " *" : ""} | \`${r.type}\` | ${r.default ? `\`${r.default}\`` : "—"} | ${r.description} |`,
        )
        .join("\n");
      return `${header}\n${rows}`;
    }

    case "steps":
      return block.steps
        .map((s, i) => {
          const lines = [`${i + 1}. **${s.title}**`];
          if (s.description) lines.push(`   ${s.description}`);
          if (s.code) lines.push(`   \`\`\`${s.codeLanguage ?? ""}\n   ${s.code.replace(/\n/g, "\n   ")}\n   \`\`\``);
          return lines.join("\n");
        })
        .join("\n\n");

    case "file-tree": {
      const lines: string[] = [];
      const walk = (nodes: typeof block.nodes, depth: number) => {
        for (const node of nodes) {
          const comment = node.comment ? `  # ${node.comment}` : "";
          lines.push(`${"  ".repeat(depth)}- ${node.name}${comment}`);
          if (node.children) walk(node.children, depth + 1);
        }
      };
      walk(block.nodes, 0);
      return lines.join("\n");
    }

    case "demo":
      return block.code
        ? `\`\`\`tsx\n${block.code}\n\`\`\``
        : `_Live demo: ${block.label ?? block.component}_`;

    case "install": {
      const lines = [`\`\`\`bash\nnpx shadcn@latest add https://bevelui.vercel.app/r/${block.registryName}.json\n\`\`\``];
      block.optionalSteps?.forEach((step) => {
        lines.push(`**${step.title}**${step.note ? ` — ${step.note}` : ""}`);
        if (step.code) lines.push(`\`\`\`bash\n${step.code}\n\`\`\``);
      });
      return lines.join("\n\n");
    }

    case "faq":
      return block.items.map((item) => `**${item.q}**\n${item.a}`).join("\n\n");

    case "built-with":
      return block.techs.map((t) => `\`${t}\``).join(", ");

    case "related":
      return ""; // Link graph doesn't serialize meaningfully to flat markdown.

    default:
      return "";
  }
}

/** Converts a full DocPage into clean, portable Markdown — used for the
 *  "Copy page" feature so the content is immediately usable in an LLM
 *  chat, a PR description, or anywhere else outside the docs site. */
export function docPageToMarkdown(page: DocPage): string {
  const parts: string[] = [`# ${page.meta.title}`, page.meta.description];

  for (const section of page.sections) {
    if (section.title) parts.push(`## ${section.title}`);
    for (const block of section.blocks) {
      const md = blockToMarkdown(block);
      if (md) parts.push(md);
    }
  }

  return parts.join("\n\n");
}

import * as React from "react";
import type { DocPage, DocBlock, DocSection } from "@/content/docs/doc-schema";
import { DocsCanvas } from "@/components/bevelui/docs/docs-canvas";
import { DocsContent } from "@/components/bevelui/docs/docs-content";
import { DocsSection } from "@/components/bevelui/docs/docs-section";
import { DocsNavigation } from "@/components/bevelui/docs/docs-navigation";
import { DocsPageHeader } from "@/components/bevelui/docs/docs-page-header";
import { DocsCodeBlock } from "@/components/bevelui/docs/docs-code-block";
import { DocsPropsTable } from "@/components/bevelui/docs/docs-props-table";
import { DocsCallout } from "@/components/bevelui/docs/docs-callout";
import { DocsSteps } from "@/components/bevelui/docs/docs-steps";
import { DocsFileTree } from "@/components/bevelui/docs/docs-file-tree";
import { DocsTypography } from "@/components/bevelui/docs/docs-typography";
import { IconWindowMaximize } from "@tabler/icons-react";
import { DocsDemo } from "./docs-demo";

// ─── Types ────────────────────────────────────────────────────────────────────

/**
 * Register live demo components here.
 * When the JSON contains a "demo" block with component: "ProductTourDemo",
 * this registry maps it to the actual React component.
 *
 * This keeps the JSON serialisable while still supporting live demos.
 * When you add a backend later, just keep this registry on the frontend.
 */
export type DocsDemoRegistry = Record<string, React.ComponentType>;

// ─── Block renderer ───────────────────────────────────────────────────────────

function renderBlock(
  block: DocBlock,
  index: number,
  demoRegistry?: DocsDemoRegistry,
): React.ReactNode {
  switch (block.type) {
    case "text":
      return (
        <DocsTypography key={index} as="p">
          {block.content}
        </DocsTypography>
      );

    case "code":
      return (
        <DocsCodeBlock
          key={index}
          code={block.code}
          language={block.language}
          filename={block.filename}
          highlightLines={block.highlightLines}
          showLineNumbers={block.showLineNumbers}
        />
      );

    case "callout":
      return (
        <DocsCallout key={index} variant={block.variant} title={block.title}>
          {block.content}
        </DocsCallout>
      );

    case "props-table":
      return <DocsPropsTable key={index} rows={block.rows} />;

    case "steps":
      return (
        <DocsSteps
          key={index}
          steps={block.steps.map((s) => ({
            title: s.title,
            description: s.description,
            children: s.code ? (
              <DocsCodeBlock
                code={s.code}
                language={s.codeLanguage ?? "bash"}
                filename={s.codeFilename}
              />
            ) : undefined,
          }))}
        />
      );

    case "file-tree":
      return <DocsFileTree key={index} nodes={block.nodes} />;

    case "demo": {
      const DemoComponent = demoRegistry?.[block.component];
      if (!DemoComponent) {
        return (
          <div
            key={index}
            className="rounded-xl border border-dashed border-border bg-muted/70 p-8 text-center text-sm text-muted-foreground"
          >
            Demo: <code className="font-mono">{block.component}</code>
            <br />
            <span className="text-xs opacity-60">
              Register this component in the demoRegistry prop.
            </span>
          </div>
        );
      }
      return (
        <>
          <DocsDemo
            key={index}
            code={block.code}
            language="tsx"
            label={block.label}
          >
            <DemoComponent />
          </DocsDemo>
          {block.preview && (
            <a
              href={`/preview/${block.preview}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View fullscreen"
              className="w-fit flex items-center flex-wrap text-yellow-200 bg-yellow-500/20 rounded-sm px-2 py-1 text-xs mt-6"
            >
              The examples are best viewed in full screen.
              <span className="whitespace-nowrap ml-1">
                Click here to open in new tab.
                <IconWindowMaximize className="ml-1 size-4 inline-flex items-center" />
              </span>
            </a>
          )}
        </>
      );
    }

    default:
      return null;
  }
}

// ─── Section renderer ─────────────────────────────────────────────────────────

function renderSection(
  section: DocSection,
  demoRegistry?: DocsDemoRegistry,
): React.ReactNode {
  return (
    <DocsSection key={section.id} id={section.id}>
      {section.title && (
        <DocsTypography as="h2">{section.title}</DocsTypography>
      )}
      {section.blocks.map((block, i) => renderBlock(block, i, demoRegistry))}
    </DocsSection>
  );
}

// ─── DocPageRenderer ──────────────────────────────────────────────────────────

export interface DocPageRendererProps {
  page: DocPage;
  /**
   * Map of component names to React components.
   * Used to render "demo" blocks from the JSON.
   *
   * @example
   * demoRegistry={{
   *   ProductTourDemo: () => <MyTourDemo />,
   *   FileUploadDemo: () => <MyFileUploadDemo />,
   * }}
   */
  demoRegistry?: DocsDemoRegistry;
}

/**
 * DocPageRenderer — renders a full documentation page from a DocPage JSON object.
 *
 * Usage:
 *   import pageData from "@/content/docs/product-tour.json";
 *
 *   export default function ProductTourPage() {
 *     return (
 *       <DocPageRenderer
 *         page={pageData}
 *         demoRegistry={{ ProductTourDemo: ProductTourDemo }}
 *       />
 *     );
 *   }
 */
export function DocPageRenderer({ page, demoRegistry }: DocPageRendererProps) {
  const { meta, tocs, sections } = page;

  return (
    <DocsCanvas tocs={tocs}>
      <DocsContent>
        {/* Page header */}

        <DocsPageHeader
          title={meta.title}
          description={meta.description}
          badge={meta.badge}
          features={(meta as any).features} // or type DocPageMeta properly
        />
        {/* Sections */}
        {sections.map((section) => renderSection(section, demoRegistry))}

        {/* Prev / Next navigation */}
        <DocsNavigation prev={meta.prev} next={meta.next} />
      </DocsContent>
    </DocsCanvas>
  );
}

DocPageRenderer.displayName = "DocPageRenderer";

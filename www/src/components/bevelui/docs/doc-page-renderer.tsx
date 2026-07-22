// ─── Server Component ─────────────────────────────────────────────────────────
// "use client" has been intentionally removed so all static doc content
// (text, code blocks, props tables, callouts, steps, file trees) is
// server-rendered and visible to crawlers without JavaScript.
//
// Interactive islands (copy buttons, feedback, live demos) are extracted into
// their own "use client" boundary files:
//   • anchor-heading.tsx  — clipboard copy on section headings
//   • feedback-widget.tsx — "Was this helpful?" feedback
//   • docs-code-block.tsx — syntax-highlighted code with copy button
//   • docs-demo.tsx       — live interactive component previews
//   • docs-install-block.tsx — animated install command
// ─────────────────────────────────────────────────────────────────────────────

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
import { DocsInstallBlock } from "./docs-install-block";
import { DocsFAQ } from "./docs-faq";
import { DocsRelated } from "./docs-related";
import { DocsBuiltWith } from "./docs-built-with";
import { getCategoryLabel } from "@/content/docs/manifest";
import { FeedbackWidget } from "./feedback-widget";
import { AnchorHeading } from "./anchor-heading";

export type DocsDemoRegistry = Record<string, React.ComponentType>;

function renderBlock(
  block: DocBlock,
  index: number,
  demoRegistry?: DocsDemoRegistry,
  currentSlug?: string,
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

    case "install":
      return (
        <DocsInstallBlock
          key={index}
          registryName={block.registryName}
          optionalSteps={block.optionalSteps}
        />
      );

    case "faq":
      return <DocsFAQ key={index} items={block.items} />;

    case "related":
      return (
        <DocsRelated
          key={index}
          currentRoute={block.currentRoute || currentSlug || ""}
        />
      );

    case "built-with":
      return <DocsBuiltWith key={index} techs={block.techs} />;

    case "demo": {
      const DemoComponent = demoRegistry?.[block.component];
      if (!DemoComponent) {
        return (
          <div
            key={index}
            className="rounded-xl border border-dashed border-border bg-muted/70 p-8 text-center text-sm text-muted-foreground my-6"
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
        <React.Fragment key={index}>
          <DocsDemo code={block.code} language="tsx" label={block.label}>
            <DemoComponent />
          </DocsDemo>
          {block.preview && (
            <a
              href={`/preview/${block.preview}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View fullscreen"
              className="w-fit flex items-center flex-wrap text-yellow-200 bg-yellow-500/20 rounded-md px-2.5 py-1 text-xs mt-3 border border-yellow-500/30 font-medium"
            >
              The examples are best viewed in full screen.
              <span className="whitespace-nowrap ml-1">
                Click here to open in new tab.
                <IconWindowMaximize className="ml-1 size-3.5 inline-flex items-center" />
              </span>
            </a>
          )}
        </React.Fragment>
      );
    }

    default:
      return null;
  }
}

function renderSection(
  section: DocSection,
  demoRegistry?: DocsDemoRegistry,
  currentSlug?: string,
): React.ReactNode {
  return (
    <DocsSection key={section.id} id={section.id}>
      {/* AnchorHeading is a client island — the <a href="#id"> is
          crawlable; the clipboard copy behaviour is progressive enhancement */}
      {section.title && (
        <AnchorHeading id={section.id} title={section.title} />
      )}
      {section.blocks.map((block, i) =>
        renderBlock(block, i, demoRegistry, currentSlug),
      )}
    </DocsSection>
  );
}

export interface DocPageRendererProps {
  page: DocPage;
  demoRegistry?: DocsDemoRegistry;
}

export function DocPageRenderer({ page, demoRegistry }: DocPageRendererProps) {
  const { meta, tocs, sections } = page;
  const categoryLabel = meta.category
    ? getCategoryLabel(meta.category as any)
    : undefined;

  return (
    <DocsCanvas tocs={tocs}>
      <DocsContent>
        {/* Page header */}
        <DocsPageHeader
          title={meta.title}
          description={meta.description}
          badge={meta.badge}
          category={categoryLabel}
          useCases={meta.useCases}
          tier={meta.tier}
          features={(meta as any).features}
          registryName={(meta as any).registryName}
        />

        {/* Built With Tech Stack Pills */}
        {meta.builtWith && meta.builtWith.length > 0 && (
          <DocsBuiltWith techs={meta.builtWith} />
        )}

        {/* Sections — server-rendered, crawlable */}
        {sections.map((section) =>
          renderSection(section, demoRegistry, meta.slug),
        )}

        {/* Related Systems */}
        {meta.slug && <DocsRelated currentRoute={meta.slug} />}

        {/* Prev / Next navigation */}
        <DocsNavigation prev={meta.prev} next={meta.next} />

        {/* Feedback Widget (client island) */}
        <FeedbackWidget />
      </DocsContent>
    </DocsCanvas>
  );
}

DocPageRenderer.displayName = "DocPageRenderer";

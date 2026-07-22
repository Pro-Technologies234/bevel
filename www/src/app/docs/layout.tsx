import * as React from "react";
import { docsRootMetadata } from "@/content/docs/manifest";
import { DocsLayoutContent } from "@/components/docs";
import { DocsSidebar } from "@/components/docs/shared/docs-sidebar";
export const metadata = docsRootMetadata;

const SITE_URL =
  process.env.NEXT_PUBLIC_APP_URL ?? "https://bevelui.vercel.app";

const NAVBAR_HEIGHT = "0rem";

// JSON-LD for the entire docs section — tells AI crawlers this is
// technical documentation for a software product.
const docsJsonLd = {
  "@context": "https://schema.org",
  "@type": "TechArticle",
  name: "Bevel UI Documentation",
  description:
    "Full documentation for all Bevel UI systems — Product Tour, Command Palette, File Upload, Form Engine, Kanban, Sortable, Tree View, and more.",
  url: `${SITE_URL}/docs`,
  about: {
    "@type": "SoftwareApplication",
    name: "Bevel UI",
    applicationCategory: "DeveloperApplication",
    operatingSystem: "Web",
    url: SITE_URL,
    description:
      "Fully-engineered UI systems for React. Copy the source into your project and own it forever. No npm package. No lock-in. shadcn/ui compatible.",
  },
};

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(docsJsonLd) }}
      />
      <div className="flex flex-col min-h-screen dark:bg-black">
        <div className="flex-1 flex min-h-0 ">
          <div className="flex-1 flex min-w-0">
            {/* ── Desktop sidebar ── */}
            <aside
              className="hidden md:flex sticky shrink-0 overflow-y-auto"
              style={{
                top: NAVBAR_HEIGHT,
                height: `calc(100vh - ${NAVBAR_HEIGHT})`,
                width: "17rem",
              }}
            >
              <DocsSidebar />
            </aside>

            <DocsLayoutContent NAVBAR_HEIGHT={NAVBAR_HEIGHT}>
              {children}
            </DocsLayoutContent>
          </div>
        </div>
      </div>
    </>
  );
}


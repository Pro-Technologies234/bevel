import * as React from "react";
import { docsMetadata } from "@/lib/metadata";
import { DocsLayoutContent } from "@/components/docs";
import { DocsSidebar } from "@/components/docs/shared/docs-sidebar";
export const metadata = docsMetadata;

const NAVBAR_HEIGHT = "0rem"; // 56px — matches py-3 + content height

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen dark:bg-black">
      <div className="flex-1 flex min-h-0 ">
        <div className="flex-1 flex min-w-0">
          {/* ── Desktop sidebar ── */}
          <aside
            className="hidden md:flex sticky shrink-0 overflow-y-auto"
            style={{
              top: NAVBAR_HEIGHT,
              height: `calc(100vh - ${NAVBAR_HEIGHT})`,
              width: "17rem", // 224px
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
  );
}

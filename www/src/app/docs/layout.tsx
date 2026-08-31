import type { Metadata } from "next";
import { DocsChromeProvider } from "@/components/shared/docs-chrome-context";
import { DocsLayoutShell } from "@/components/shared/docs-layout-shell";
import { docsRootMetadata } from "@/content/docs/manifest";

export const metadata: Metadata = docsRootMetadata;

// Server component — stays lightweight so metadata export works normally.
// All the client state (sidebar/TOC/breadcrumb chrome) lives in
// DocsChromeProvider + DocsLayoutShell, which are themselves client
// components, so this boundary doesn't force the whole docs tree client-side
// any more than it already was (every page here is "use client" already).
export default function DocsLayout({ children }: { children: React.ReactNode }) {
  return (
    <DocsChromeProvider>
      <DocsLayoutShell>{children}</DocsLayoutShell>
    </DocsChromeProvider>
  );
}

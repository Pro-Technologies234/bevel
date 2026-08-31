import { DocsLandingPage } from "@/components/bevelui/docs-landing/docs-landing-page";
import { docsComponentsMetadata } from "@/content/docs/manifest";

export const metadata = docsComponentsMetadata;

export default function ComponentsPage() {
  return <DocsLandingPage />;
}

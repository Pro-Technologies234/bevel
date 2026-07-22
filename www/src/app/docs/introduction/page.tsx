import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import pageData from "@/content/docs/introduction.json";
import { docsIntroductionMetadata } from "@/content/docs/manifest";
export const metadata = docsIntroductionMetadata;

export default function IntroductionPage() {
  return <DocPageRenderer page={pageData as any} />;
}

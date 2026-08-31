import { IntroductionContent } from "@/components/bevelui/docs/introduction-content";
import { docsIntroductionMetadata } from "@/content/docs/manifest";

export const metadata = docsIntroductionMetadata;

export default function IntroductionPage() {
  return <IntroductionContent />;
}

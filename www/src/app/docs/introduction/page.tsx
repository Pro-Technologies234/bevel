import { DocPageRenderer } from "@/components/bevelui/docs/doc-page-renderer";
import pageData from "@/content/docs/introduction.json";

export const metadata = {
  title: "Introduction — Bevel UI",
  description:
    "Bevel UI ships fully-engineered UI systems for React. Not a component library — a collection of complete, production-ready solutions to hard UI engineering problems.",
};

export default function IntroductionPage() {
  return <DocPageRenderer page={pageData as any} />;
}

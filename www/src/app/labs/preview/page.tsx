import { labPreviewMetadata } from "@/lib/metadata";
import PreviewClient from "./PreviewClient";

// 1. Metadata works here because this is a Server Component
export const metadata = labPreviewMetadata;

// 2. Static params works here for build-time optimization
export function generateStaticParams() {
  const names = ["vault", "onboard", "launchpad", "intake", "ici", "compass"];
  return names.map((name) => ({ name }));
}

export default function PreviewPage({ params }: { params: { name: string } }) {
  return <PreviewClient name={params.name} />;
}

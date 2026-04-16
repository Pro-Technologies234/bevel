// app/preview/[name]/page.tsx
import { DEMO_REGISTRY } from "../_registry";
import { notFound } from "next/navigation";

export default async function PreviewPage({
  params,
}: {
  params: Promise<{ name: string }>;
}) {
  const Demo = DEMO_REGISTRY[(await params).name];
  if (!Demo) notFound();

  return (
    // Full viewport, no navbar, no sidebar
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-8">
      <Demo />
    </div>
  );
}

// Tell Next.js which slugs are valid at build time
export function generateStaticParams() {
  return Object.keys(DEMO_REGISTRY).map((name) => ({ name }));
}

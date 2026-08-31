import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { DOCS_SYSTEMS, getSystemMetadata } from "@/content/docs/manifest";
import { DocSystemPage } from "@/components/bevelui/docs/doc-system-page";

export function generateStaticParams() {
  return DOCS_SYSTEMS.map((system) => ({ slug: system.route }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  return getSystemMetadata(slug);
}

export default async function ComponentSystemPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  if (!DOCS_SYSTEMS.some((system) => system.route === slug)) {
    notFound();
  }

  return <DocSystemPage slug={slug} />;
}

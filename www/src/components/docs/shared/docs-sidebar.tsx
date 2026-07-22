"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import { buildDocsSidebarSections } from "@/content/docs/manifest";

export function DocsSidebar() {
  const sections = buildDocsSidebarSections();
  return <BevelSidebar className="w-full" sections={sections} />;
}

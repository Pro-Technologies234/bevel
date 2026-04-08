"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import { IconRocket, IconComponents, IconPalette } from "@tabler/icons-react";
import { usePathname, useRouter } from "next/navigation";

export function DocsSidebar() {
  const router = useRouter();
  return (
    <BevelSidebar
      sections={[
        {
          label: "Getting Started",
          actions: [
            {
              label: "Introduction",
              onClick() {
                router.push("/docs/introduction");
              },
              href: "/docs/introduction",
            },
            {
              label: "Components",
              onClick() {
                router.push("/docs/components");
              },
              href: "/docs/components",
            },
            {
              label: "Installation",
              onClick() {
                router.push("/docs/installation");
              },
              href: "/docs/installation",
            },
          ],
        },
        {
          label: "Component Systems",
          actions: [
            {
              label: "Product Tour",
              badge: "New",
              onClick() {
                router.push("/docs/components/product-tour");
              },
              href: "/docs/components/product-tour",
            },
            {
              label: "Command Palette",
              badge: "New",
              onClick() {
                router.push("/docs/components/command-palette");
              },
              href: "/docs/components/command-palette",
            },
            {
              label: "File Upload",
              badge: "New",
              onClick() {
                router.push("/docs/components/file-upload");
              },
              href: "/docs/components/file-upload",
            },
            {
              label: "Form Engine",
              badge: "New",
              onClick() {
                router.push("/docs/components/form-engine");
              },
              href: "/docs/components/form-engine",
            },
          ],
        },
      ]}
    />
  );
}

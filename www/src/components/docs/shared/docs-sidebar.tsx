"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import { IconRocket, IconComponents, IconPalette } from "@tabler/icons-react";
import { useRouter } from "next/navigation";

export function DocsSidebar() {
  const router = useRouter();
  return (
    <BevelSidebar
      sections={[
        {
          label: "Getting Started",
          actions: [
            { label: "Introduction" },
            { label: "Installation" },
            { label: "Quick start" },
            { label: "Changelog", badge: "New" },
          ],
        },
        {
          label: "Systems",
          actions: [
            {
              label: "Product Tour",
              badge: "New",
              onClick() {
                router.push("/docs/components/tour");
              },
              href: "/docs/components/tour"
            },
            {
              label: "Command Palette",
              badge: "New",
              onClick() {
                router.push("/docs/components/command-palette");
              },
              href: "/docs/components/command-palette"
            },
            {
              label: "File Upload",
              badge: "New",
              onClick() {
                router.push("/docs/components/file-upload");
              },
              href: "/docs/components/file-upload"
            },
            {
              label: "Form Engine",
              badge: "New",
              onClick() {
                router.push("/docs/components/form-engine");
              },
              href: "/docs/components/form-engine",
            },
            { label: "Onboarding Checklist", badge: "Soon" },
            { label: "Notification Center", disabled: true },
          ],
        },
        {
          label: "Theming",
          actions: [
            { label: "Colors" },
            { label: "Typography" },
            { label: "Dark mode" },
          ],
        },
      ]}
    />
  );
}



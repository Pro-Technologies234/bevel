"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import {
  IconRocket,
  IconComponents,
  IconRoute,
  IconSearch,
  IconUpload,
  IconForms,
} from "@tabler/icons-react";

export function DocsSidebar() {
  return (
    <BevelSidebar
      sections={[
        {
          label: "Getting Started",
          icon: IconRocket,
          collapsible: true,
          defaultOpen: true,
          actions: [
            {
              label: "Introduction",
              href: "/docs/introduction",
            },
            {
              label: "Installation",
              href: "/docs/installation",
            },
          ],
        },
        {
          label: "Systems",
          icon: IconComponents,
          collapsible: true,
          defaultOpen: true,
          actions: [
            {
              label: "All Systems",
              href: "/docs/components",
            },
            {
              label: "Product Tour",
              href: "/docs/components/product-tour",
              icon: IconRoute,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "Command Palette",
              href: "/docs/components/command-palette",
              icon: IconSearch,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "File Upload",
              href: "/docs/components/file-upload",
              icon: IconUpload,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "Form Engine",
              href: "/docs/components/form-engine",
              icon: IconForms,
              badge: "New",
              badgeVariant: "new",
            },
          ],
        },
      ]}
    />
  );
}

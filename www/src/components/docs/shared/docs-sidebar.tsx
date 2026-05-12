"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import {
  IconRocket,
  IconComponents,
  IconRoute,
  IconSearch,
  IconUpload,
  IconForms,
  IconListSearch,
  IconFileUploadFilled,
  IconColorSwatch,
  IconDragDrop,
  IconLayoutSidebarRight,
  IconPaletteFilled,
  IconLayoutSidebarRightInactive,
  IconAiAgent,
} from "@tabler/icons-react";

export function DocsSidebar() {
  return (
    <BevelSidebar
      className=" w-full"
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
              icon: IconListSearch,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "File Upload",
              href: "/docs/components/file-upload",
              icon: IconFileUploadFilled,
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
            {
              label: "Palette Editor",
              href: "/docs/components/palette-editor",
              icon: IconPaletteFilled,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "Sortable",
              href: "/docs/components/sortable",
              icon: IconDragDrop,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "Properties Panel",
              href: "/docs/components/properties-panel",
              icon: IconLayoutSidebarRightInactive,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "AI Chat Interface System",
              href: "/docs/components/ai-chat",
              icon: IconAiAgent,
              badge: "New",
              badgeVariant: "new",
            },
          ],
        },
      ]}
    />
  );
}

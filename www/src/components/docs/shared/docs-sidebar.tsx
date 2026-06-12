"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import {
  IconRocket,
  IconComponents,
  IconRoute,
  IconForms,
  IconListSearch,
  IconFileUploadFilled,
  IconDragDrop,
  IconPaletteFilled,
  IconLayoutSidebarRightInactive,
  IconChecklist,
  IconListTree,
  IconPhotoFilled,
  IconWorldSearch,
  IconLayoutKanban,
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
              // badge: "New",
              // badgeVariant: "new",
            },
            {
              label: "Command Palette",
              href: "/docs/components/command-palette",
              icon: IconListSearch,
              // badge: "New",
              // badgeVariant: "new",
            },
            {
              label: "File Upload",
              href: "/docs/components/file-upload",
              icon: IconFileUploadFilled,
              // badge: "New",
              // badgeVariant: "new",
            },
            {
              label: "Form Engine",
              href: "/docs/components/form-engine",
              icon: IconForms,
              badge: "Beta",
              badgeVariant: "red",
            },
            {
              label: "Sortable",
              href: "/docs/components/sortable",
              icon: IconDragDrop,
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
              label: "Properties Panel",
              href: "/docs/components/properties-panel",
              icon: IconLayoutSidebarRightInactive,
              badge: "New",
              badgeVariant: "new",
            },
            // {
            //   label: "Onboarding Checklist",
            //   href: "/docs/components/onboarding-checklist",
            //   icon: IconChecklist,
            //   badge: "New",
            //   badgeVariant: "new",
            // },
            {
              label: "Tree View",
              href: "/docs/components/tree-view",
              icon: IconListTree,
              badge: "New",
              badgeVariant: "new",
            },
            // {
            //   label: "Resizable Panels",
            //   href: "/docs/components/resizable",
            //   icon: IconLayoutSidebarRightInactive,
            //   badge: "New",
            //   badgeVariant: "new",
            // },
            {
              label: "Media Gallery",
              href: "/docs/components/media-gallery",
              icon: IconPhotoFilled,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "Spotlight Search",
              href: "/docs/components/spotlight",
              icon: IconWorldSearch,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "Onboarding Checklist",
              href: "/docs/components/onboarding-checklist",
              icon: IconChecklist,
              badge: "New",
              badgeVariant: "new",
            },
            {
              label: "Kanban",
              href: "/docs/components/kanban",
              icon: IconLayoutKanban,
              badge: "New",
              badgeVariant: "new",
            },
          ],
        },
      ]}
    />
  );
}

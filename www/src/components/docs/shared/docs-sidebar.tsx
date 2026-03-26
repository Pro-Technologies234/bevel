"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import {
  IconRocket,
  IconComponents,
  IconPalette,
  IconBolt,
  IconNews,
} from "@tabler/icons-react";

export function DocsSidebar() {
  return (
    <BevelSidebar
      sections={[
        {
          label: "Getting Started",
          collapsible: true,
          defaultOpen: true,
          icon: IconRocket,
          actions: [
            { label: "Introduction" },
            { label: "Installation" },
            { label: "Quick start" },
            { label: "Changelog", badge: "New" },
          ],
        },
        {
          label: "Systems",
          collapsible: true,
          defaultOpen: true,
          icon: IconComponents,
          actions: [
            { label: "Product Tour", badge: "Soon" },
            { label: "Multi-step Form", badge: "Soon" },
            { label: "Onboarding Checklist", badge: "Soon" },
            { label: "Command Palette", disabled: true },
            { label: "Notification Center", disabled: true },
            { label: "File Upload", disabled: true },
          ],
        },
        {
          label: "Theming",
          collapsible: true,
          defaultOpen: false,
          icon: IconPalette,
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
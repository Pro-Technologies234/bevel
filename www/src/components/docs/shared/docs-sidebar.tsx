"use client";

import { BevelSidebar } from "@/components/shared/sidebar";
import { IconRocket, IconComponents, IconPalette } from "@tabler/icons-react";

export function DocsSidebar() {
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

"use client";

import { CardSelect, CardSelectOption } from "@/registry/controls/card-select";
import { IconLockPlus, IconShieldCheck } from "@tabler/icons-react";

const KITCHEN_SINK_OPTIONS: CardSelectOption[] = [
  {
    // USES GENERIC T: Passing an object instead of just a string
    value: "ULTRA_001",

    // STRING: Primary title
    label: "Enterprise Ultra Plan",

    // STRING: Supporting subtext
    description:
      "Comprehensive security and performance package for global organizations.",

    // REACTNODE: Using a component for the icon slot
    icon: IconShieldCheck,

    // STRING: Using a direct URL string for the preview (shows your component handles strings vs nodes)
    preview: "https://images.unsplash.com",

    // STRING: Visual status indicator
    badge: "Most Popular",

    // BOOLEAN: Interaction state
    disabled: false,
  },
  {
    // Demonstrating the 'disabled' state for the docs
    value: "LEGACY_001",
    label: "$214.99",
    description: "Billin.",
    // icon: IconLockPlus,
    badge: "Archived",
    disabled: true, // PROPS: Disabled state
    isActive: true,
  },
];

export default function DocsExample() {
  return (
    <section className=" flex  justify-center items-center h-screen font-sans">
      <div className="  grid grid-cols-2 gap-4 ">
        <CardSelect options={KITCHEN_SINK_OPTIONS} />
      </div>
    </section>
  );
}

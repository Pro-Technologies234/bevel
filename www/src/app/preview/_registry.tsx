"use client";
import { CommandPaletteDemo } from "@/components/bevelui/docs/command-palette-content";
import { FileUploadShowcase } from "@/components/bevelui/docs/file-upload-content";
import { FormEngineShowcase } from "@/components/bevelui/docs/form-engine-content";
import OnboardApp from "@/components/labs/onboard/OnboardApp";
import LaunchpadApp from "@/components/labs/launchpad/LaunchpadApp";
import IntakeApp from "@/components/labs/intake/IntakeApp";
import BriefcaseApp from "@/components/labs/briefcase/BriefcaseApp";
import CompassApp from "@/components/labs/compass/CompassApp";
import VaultApp from "@/components/labs/vault/VaultApp";
import { ProductTourDemo } from "@/components/docs/product-tour/product-tour-demo";
import { AIChatDemo } from "@/components/docs/ai-chat/ai-chat-demo";

export const DEMO_REGISTRY: Record<string, React.ComponentType> = {
  "product-tour": ProductTourDemo,
  "command-palette": CommandPaletteDemo,
  "file-upload": FileUploadShowcase,
  "form-engine": FormEngineShowcase,
  "ai-chat": AIChatDemo,
  vault: VaultApp,
  onboard: OnboardApp,
  launchpad: LaunchpadApp,
  intake: IntakeApp,
  ici: BriefcaseApp,
  compass: CompassApp,
};

import React from "react";
import { TourProvider } from "./tour-context";
import { TourOverlay } from "./tour-overlay";
import { TourCard } from "./tour-card";
import type { TourStepDef } from "./types";

interface TourRootProps {
  children: React.ReactNode;
  steps: TourStepDef[];
  defaultOpen?: boolean;
  showOverlay?: boolean;
  onComplete?: () => void;
  onSkip?: () => void;
}

/**
 * TourRoot — drop this around any subtree you want to tour.
 * It composes Provider + Overlay + Card so you only need one import.
 *
 * @example
 * <TourRoot steps={tourSteps} defaultOpen>
 *   <MyPage />
 * </TourRoot>
 */
export function TourRoot({
  children,
  steps,
  defaultOpen = false,
  showOverlay = true,
  onComplete,
  onSkip,
}: TourRootProps) {
  return (
    <TourProvider
      steps={steps}
      defaultOpen={defaultOpen}
      onComplete={onComplete}
      onSkip={onSkip}
      showOverlay={showOverlay}
    >
      {children}
      <TourOverlay />
      <TourCard />
    </TourProvider>
  );
}

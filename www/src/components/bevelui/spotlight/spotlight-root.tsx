import * as React from "react";
import { SpotlightProvider, SpotlightProviderProps } from "./spotlight-context";
import { SpotlightModal } from "./spotlight-modal";

export interface SpotlightRootProps extends SpotlightProviderProps {
  children: React.ReactNode;
}

export function SpotlightRoot({
  children,
  ...providerProps
}: SpotlightRootProps) {
  return (
    <SpotlightProvider {...providerProps}>
      {children}
      <SpotlightModal />
    </SpotlightProvider>
  );
}

SpotlightRoot.displayName = "SpotlightRoot";

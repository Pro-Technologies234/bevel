import * as React from "react";
import { GalleryProvider, GalleryProviderProps } from "./gallery-context";
import { GalleryGrid } from "./gallery-grid";
import { GalleryToolbar } from "./gallery-toolbar";
import { GalleryLightbox } from "./gallery-lightbox";
import { cn } from "@/lib/utils";

export interface GalleryRootProps extends GalleryProviderProps {
  children?: React.ReactNode;
}

export function GalleryRoot({ children, ...providerProps }: GalleryRootProps) {
  return (
    <GalleryProvider {...providerProps}>
      {children ?? (
        <div className={cn("flex flex-col gap-3", providerProps.className)}>
          <GalleryToolbar />
          <GalleryGrid />
          <GalleryLightbox />
        </div>
      )}
    </GalleryProvider>
  );
}

GalleryRoot.displayName = "GalleryRoot";

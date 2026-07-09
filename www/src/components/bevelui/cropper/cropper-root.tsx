"use client";

import * as React from "react";
import { CropperCtx } from "./cropper-context";
import { CropperCanvas } from "./cropper-canvas";
import { CropperToolbar } from "./cropper-toolbar";
import { CropperPreview } from "./cropper-preview";
import { defaultRegion, parseAspectRatio, generateCrop } from "./crop-engine";
import type {
  CropperConfig, CropperContextValue, CropRegion, ImageSize, AspectRatioPreset,
} from "./types";
import { cn } from "@/lib/utils";

export interface CropperRootProps {
  /** Image URL. Must have CORS headers if the origin differs. */
  src: string;
  config?: CropperConfig;
  /** Called after crop() resolves. */
  onCrop?: (blob: Blob) => void;
  /** Replace the default layout entirely. */
  children?: React.ReactNode;
  className?: string;
}

export function CropperRoot({
  src,
  config = {},
  onCrop,
  children,
  className,
}: CropperRootProps) {
  const [imageSize, setImageSizeState] = React.useState<ImageSize | null>(null);
  const [region, setRegion] = React.useState<CropRegion | null>(null);
  const [aspectRatioPreset, setPresetState] = React.useState<AspectRatioPreset>(
    config.defaultAspectRatio ?? "free",
  );

  const aspectRatio = parseAspectRatio(aspectRatioPreset);

  function setImageSize(size: ImageSize) {
    setImageSizeState(size);
    setRegion(defaultRegion(size.width, size.height, aspectRatio));
  }

  function setAspectRatioPreset(preset: AspectRatioPreset) {
    setPresetState(preset);
    if (!imageSize) return;
    setRegion(defaultRegion(imageSize.width, imageSize.height, parseAspectRatio(preset)));
  }

  async function crop(): Promise<Blob> {
    if (!region) throw new Error("No crop region");
    const blob = await generateCrop(
      src, region,
      config.outputFormat ?? "image/png",
      config.quality ?? 0.92,
    );
    onCrop?.(blob);
    return blob;
  }

  function reset() {
    if (!imageSize) return;
    setRegion(defaultRegion(imageSize.width, imageSize.height, aspectRatio));
  }

  const ctx: CropperContextValue = {
    src, imageSize, region,
    aspectRatioPreset, aspectRatio, config,
    setImageSize, setRegion, setAspectRatioPreset, crop, reset,
  };

  return (
    <CropperCtx.Provider value={ctx}>
      {children ?? (
        <div className={cn("flex flex-col gap-3", className)}>
          <CropperToolbar />
          <div className="flex gap-4 items-start">
            <CropperCanvas className="flex-1" />
            <CropperPreview />
          </div>
        </div>
      )}
    </CropperCtx.Provider>
  );
}

CropperRoot.displayName = "CropperRoot";
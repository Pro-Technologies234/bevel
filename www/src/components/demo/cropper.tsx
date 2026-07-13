// components/bevelui/docs/demos/cropper-demo.tsx
"use client";

import * as React from "react";
import { CropperRoot, CropperCanvas, CropperToolbar, CropperPreview } from "@/components/bevelui/cropper";

const SRC = "https://picsum.photos/seed/bevel/1200/800";

export function CropperDemo() {
  const [result, setResult] = React.useState<string | null>(null);

  function handleCrop(blob: Blob) {
    if (result) URL.revokeObjectURL(result);
    setResult(URL.createObjectURL(blob));
  }

  return (
    <div className="flex flex-col gap-6">
      <CropperRoot
        src={SRC}
        config={{ showGrid: true }}
        onCrop={handleCrop}
      />

      {result && (
        <div className="flex flex-col gap-2">
          <span className="text-[11px] font-mono text-muted-foreground/50 uppercase tracking-wider">
            Result
          </span>
          <img
            src={result}
            alt="Cropped"
            className="rounded-xl border border-border max-w-full"
          />
        </div>
      )}
    </div>
  );
}

// Controlled layout demo
export function CropperCustomLayoutDemo() {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);

  return (
    <CropperRoot
      src={SRC}
      config={{ defaultAspectRatio: "16:9", outputFormat: "image/jpeg", quality: 0.88 }}
      onCrop={(blob) => setBlobUrl(URL.createObjectURL(blob))}
    >
      {/* custom layout */}
      <div className="flex flex-col gap-3">
        <CropperToolbar />
        <div className="flex gap-4 items-start">
          <CropperCanvas className="flex-1" />
          <CropperPreview maxSize={180} />
        </div>
        {blobUrl && <img src={blobUrl} className="rounded-xl border border-border" alt="Crop result" />}
      </div>
    </CropperRoot>
  );
}
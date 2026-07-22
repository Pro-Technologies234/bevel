"use client";

import * as React from "react";
import {
  CropperRoot,
  CropperCanvas,
  CropperToolbar,
  CropperPreview,
} from "@/components/bevelui/cropper";
import { cn } from "@/lib/utils";
import { IconPhoto, IconCheck } from "@tabler/icons-react";

const SRC = "https://picsum.photos/seed/bevel/1200/800";

type Ratio = "Free" | "1:1" | "16:9" | "4:3" | "3:2";

const RATIOS: { label: Ratio; value: string | undefined }[] = [
  { label: "Free",  value: undefined },
  { label: "1:1",   value: "1:1"  },
  { label: "16:9",  value: "16:9" },
  { label: "4:3",   value: "4:3"  },
  { label: "3:2",   value: "3:2"  },
];

export function CropperDemo() {
  const [ratio, setRatio] = React.useState<Ratio>("Free");
  const [result, setResult] = React.useState<string | null>(null);
  const [justCropped, setJustCropped] = React.useState(false);

  const currentRatio = RATIOS.find((r) => r.label === ratio)!;

  function handleCrop(blob: Blob) {
    if (result) URL.revokeObjectURL(result);
    setResult(URL.createObjectURL(blob));
    setJustCropped(true);
    setTimeout(() => setJustCropped(false), 2000);
  }

  return (
    <div className="w-full max-w-3xl flex flex-col gap-4">
      {/* Aspect ratio preset strip */}
      <div className="flex items-center gap-2 flex-wrap">
        <span className="text-[11px] text-muted-foreground/60 font-mono shrink-0">Aspect ratio:</span>
        <div className="flex gap-1.5 flex-wrap">
          {RATIOS.map((r) => (
            <button
              key={r.label}
              onClick={() => setRatio(r.label)}
              className={cn(
                "px-3 py-1 rounded-md border text-[11px] font-mono transition-colors",
                ratio === r.label
                  ? "bg-primary text-black border-primary font-semibold"
                  : "bg-muted/30 text-muted-foreground border-border hover:border-muted-foreground hover:text-foreground"
              )}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Cropper + live preview side by side */}
      <CropperRoot
        key={ratio}
        src={SRC}
        config={{
          showGrid: true,
          defaultAspectRatio: currentRatio.value as any,
          outputFormat: "image/jpeg",
          quality: 0.92,
        }}
        onCrop={handleCrop}
      >
        <div className="flex flex-col sm:flex-row gap-4 items-start">
          <div className="flex flex-col gap-2 flex-1 min-w-0">
            <CropperToolbar />
            <CropperCanvas className="w-full" />
          </div>

          <div className="flex flex-col gap-2 sm:w-44 shrink-0">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
              Live preview
            </span>
            <CropperPreview maxSize={176} className="w-full rounded-lg border border-border overflow-hidden" />

            {/* Cropped result */}
            {result && (
              <div className="flex flex-col gap-1.5 mt-2">
                <div className="flex items-center gap-1.5">
                  {justCropped && <IconCheck size={11} className="text-emerald-400" />}
                  <span className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground/50">
                    {justCropped ? "Cropped!" : "Result"}
                  </span>
                </div>
                <img
                  src={result}
                  alt="Cropped result"
                  className="w-full rounded-lg border border-border"
                />
              </div>
            )}
          </div>
        </div>
      </CropperRoot>

      {/* Hint */}
      <p className="text-[11px] text-muted-foreground/40 font-mono text-center">
        Drag the crop box · scroll to zoom · click &quot;Crop&quot; to export
      </p>
    </div>
  );
}

// ─── Custom layout demo ─────────────────────────────────────────────────────────

export function CropperCustomLayoutDemo() {
  const [blobUrl, setBlobUrl] = React.useState<string | null>(null);

  return (
    <CropperRoot
      src={SRC}
      config={{ defaultAspectRatio: "16:9", outputFormat: "image/jpeg", quality: 0.88 }}
      onCrop={(blob) => setBlobUrl(URL.createObjectURL(blob))}
    >
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
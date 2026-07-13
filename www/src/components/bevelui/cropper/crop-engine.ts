import type { CropRegion, CanvasTransform, AspectRatioPreset } from "./types";

export type HandleId = "n" | "ne" | "e" | "se" | "s" | "sw" | "w" | "nw" | "move";

// ─── Transform ────────────────────────────────────────────────────────────────

export function computeTransform(
  canvasW: number,
  canvasH: number,
  imgW: number,
  imgH: number,
): CanvasTransform {
  const scale = Math.min(canvasW / imgW, canvasH / imgH);
  return {
    scale,
    offsetX: (canvasW - imgW * scale) / 2,
    offsetY: (canvasH - imgH * scale) / 2,
  };
}

// ─── Aspect ratio ─────────────────────────────────────────────────────────────

export function parseAspectRatio(preset: AspectRatioPreset): number | null {
  const map: Record<AspectRatioPreset, number | null> = {
    free: null,
    "1:1": 1,
    "4:3": 4 / 3,
    "16:9": 16 / 9,
    "3:2": 3 / 2,
    "9:16": 9 / 16,
  };
  return map[preset];
}

// ─── Default region ───────────────────────────────────────────────────────────

export function defaultRegion(
  imgW: number,
  imgH: number,
  aspectRatio: number | null,
): CropRegion {
  const pad = 0.1;
  let w = imgW * (1 - pad * 2);
  let h = imgH * (1 - pad * 2);
  if (aspectRatio !== null) {
    if (w / h > aspectRatio) w = h * aspectRatio;
    else h = w / aspectRatio;
  }
  return { x: (imgW - w) / 2, y: (imgH - h) / 2, width: w, height: h };
}

// ─── Handle drag ──────────────────────────────────────────────────────────────

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

export function applyHandleDrag(
  region: CropRegion,
  handle: HandleId,
  dx: number,        // delta in image px
  dy: number,
  imgW: number,
  imgH: number,
  aspectRatio: number | null,
  minSize = 20,
): CropRegion {
  if (handle === "move") {
    return {
      ...region,
      x: clamp(region.x + dx, 0, imgW - region.width),
      y: clamp(region.y + dy, 0, imgH - region.height),
    };
  }

  const isN = handle.includes("n");
  const isS = handle.includes("s");
  const isW = handle.includes("w");
  const isE = handle.includes("e");

  let left = region.x;
  let top = region.y;
  let right = region.x + region.width;
  let bottom = region.y + region.height;

  if (isN) top = clamp(top + dy, 0, bottom - minSize);
  if (isS) bottom = clamp(bottom + dy, top + minSize, imgH);
  if (isW) left = clamp(left + dx, 0, right - minSize);
  if (isE) right = clamp(right + dx, left + minSize, imgW);

  let width = right - left;
  let height = bottom - top;

  if (aspectRatio !== null) {
    const pureH = (isE || isW) && !isN && !isS;
    const pureV = (isN || isS) && !isE && !isW;

    if (pureH) {
      height = width / aspectRatio;
      const cy = (top + bottom) / 2;
      top = cy - height / 2;
      bottom = cy + height / 2;
    } else if (pureV) {
      width = height * aspectRatio;
      const cx = (left + right) / 2;
      left = cx - width / 2;
      right = cx + width / 2;
    } else {
      // Corner: width-primary
      height = width / aspectRatio;
      if (isN) top = bottom - height;
      else bottom = top + height;
    }

    // Re-clamp after AR adjustment
    if (left < 0) { right -= left; left = 0; }
    if (top < 0) { bottom -= top; top = 0; }
    if (right > imgW) { left -= right - imgW; right = imgW; }
    if (bottom > imgH) { top -= bottom - imgH; bottom = imgH; }
  }

  return { x: left, y: top, width: right - left, height: bottom - top };
}

// ─── Hit test ─────────────────────────────────────────────────────────────────

interface CropBox { x: number; y: number; w: number; h: number }

export function getHandlePositions(cb: CropBox) {
  return [
    { id: "nw" as HandleId, x: cb.x,            y: cb.y            },
    { id: "n"  as HandleId, x: cb.x + cb.w / 2, y: cb.y            },
    { id: "ne" as HandleId, x: cb.x + cb.w,     y: cb.y            },
    { id: "e"  as HandleId, x: cb.x + cb.w,     y: cb.y + cb.h / 2 },
    { id: "se" as HandleId, x: cb.x + cb.w,     y: cb.y + cb.h     },
    { id: "s"  as HandleId, x: cb.x + cb.w / 2, y: cb.y + cb.h     },
    { id: "sw" as HandleId, x: cb.x,            y: cb.y + cb.h     },
    { id: "w"  as HandleId, x: cb.x,            y: cb.y + cb.h / 2 },
  ];
}

export function hitTest(
  px: number,
  py: number,
  cb: CropBox,
  hitRadius = 8,
): HandleId | null {
  for (const { id, x, y } of getHandlePositions(cb)) {
    if (Math.abs(px - x) <= hitRadius && Math.abs(py - y) <= hitRadius) return id;
  }
  if (px >= cb.x && px <= cb.x + cb.w && py >= cb.y && py <= cb.y + cb.h) {
    return "move";
  }
  return null;
}

// ─── Export ───────────────────────────────────────────────────────────────────

export async function generateCrop(
  src: string,
  region: CropRegion,
  format: OutputFormat = "image/png",
  quality = 0.92,
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const c = document.createElement("canvas");
      c.width = Math.round(region.width);
      c.height = Math.round(region.height);
      c.getContext("2d")!.drawImage(
        img,
        Math.round(region.x), Math.round(region.y),
        Math.round(region.width), Math.round(region.height),
        0, 0, c.width, c.height,
      );
      c.toBlob(
        (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
        format,
        quality,
      );
    };
    img.onerror = reject;
    img.src = src;
  });
}

type OutputFormat = "image/png" | "image/jpeg" | "image/webp";
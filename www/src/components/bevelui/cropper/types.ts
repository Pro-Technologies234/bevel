export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
}

export type AspectRatioPreset = "free" | "1:1" | "4:3" | "16:9" | "3:2" | "9:16";
export type OutputFormat = "image/png" | "image/jpeg" | "image/webp";

export interface CropperConfig {
  defaultAspectRatio?: AspectRatioPreset;
  outputFormat?: OutputFormat;
  quality?: number;
  /** Minimum crop dimension in image px. Default 20. */
  minSize?: number;
  /** Show rule-of-thirds grid. Default true. */
  showGrid?: boolean;
}

export interface ImageSize {
  width: number;
  height: number;
}

export interface CanvasTransform {
  scale: number;
  offsetX: number;
  offsetY: number;
}

export interface CropperContextValue {
  src: string;
  imageSize: ImageSize | null;
  region: CropRegion | null;
  aspectRatioPreset: AspectRatioPreset;
  aspectRatio: number | null;
  config: CropperConfig;
  setImageSize: (size: ImageSize) => void;
  setRegion: (region: CropRegion) => void;
  setAspectRatioPreset: (preset: AspectRatioPreset) => void;
  crop: () => Promise<Blob>;
  reset: () => void;
}
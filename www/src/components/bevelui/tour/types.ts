export type TourSide = "top" | "right" | "bottom" | "left";

export interface TourMedia {
  type: "video" | "gif" | "image";
  src: string;
  poster?: string; // video thumbnail
  alt?: string;
}

export interface TourStepDef {
  /** 1-based step index */
  id?: string;
  step: number;
  title: string;
  description: string;
  /** Which side the card appears on — auto-flips if it hits screen edge */
  side?: TourSide;
  /** Optional offset from the anchor in px */
  sideOffset?: number;
  /** Optional media — shown above the title like Photoshop tooltips */
  media?: TourMedia;
  /** Padding around the anchor highlight in px */
  highlightPadding?: number;
}

export interface TourContextValue {
  steps: TourStepDef[];
  currentStep: number;
  totalSteps: number;
  isOpen: boolean;
  showOverlay?: boolean;
  currentStepDef: TourStepDef | undefined;
  start: () => void;
  stop: () => void;
  next: () => void;
  prev: () => void;
  goTo: (step: number) => void;
  skip: () => void;
}

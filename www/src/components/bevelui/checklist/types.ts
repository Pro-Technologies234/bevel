export type ChecklistStepStatus = "idle" | "complete" | "skipped";

export interface ChecklistStep {
  id: string;
  title: string;
  description?: string;
  cta?: string; // action button label
  onAction?: () => void; // called when CTA is clicked
  href?: string; // navigate instead of onAction
  requires?: string[]; // ids that must be complete first
  optional?: boolean;
}

export interface ChecklistConfig {
  title?: string;
  subtitle?: string;
  storageKey?: string; // localStorage key for persistence
  position?: "bottom-right" | "bottom-left" | "inline";
}

export interface ChecklistContextValue {
  steps: ChecklistStep[];
  statuses: Record<string, ChecklistStepStatus>;
  isOpen: boolean;
  completedCount: number;
  requiredCount: number;
  progress: number; // 0–100
  isComplete: boolean;
  complete: (id: string) => void;
  skip: (id: string) => void;
  undo: (id: string) => void;
  open: () => void;
  close: () => void;
  toggle: () => void;
  canActivate: (id: string) => boolean;
}

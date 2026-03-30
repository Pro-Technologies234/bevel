// ─── Main components ──────────────────────────────────────────────────────────
export { FormEngine } from "./form-engine";
export { FormEngineRoot } from "./form-engine-root";

// ─── Composable pieces ────────────────────────────────────────────────────────
export { FormEngineProgress, FormEngineProgressPill } from "./form-engine-progress";
export { FormEngineStepMeta } from "./form-engine-step-meta";
export { FormEngineStepCanvas, FormEngineStepCanvasItem } from "./form-engine-step-canvas";
export { FormEngineActions } from "./form-engine-actions";
export { FormEngineNavigation } from "./form-engine-navigation";
export { FormEngineField, useFormEngineField } from "./form-engine-field";

// ─── Context ──────────────────────────────────────────────────────────────────
export { FormEngineContext, useFormEngineContext } from "./form-engine-context";

// ─── Plugin helpers ───────────────────────────────────────────────────────────
export {
  createZodPlugin,
  createLogPlugin,
  createAnalyticsPlugin,
} from "./form-engine-plugin";

// ─── Types ────────────────────────────────────────────────────────────────────
export type {
  FormEngineConfig,
  FormEngineStepDef,
  FormEngineFieldDef,
  FormEngineFieldVariant,
  FormEngineFieldState,
  FormEnginePlugin,
  FormEngineProps,
  FormEngineRootProps,
  FormEngineContextValue,
  FormEngineMode,
  FormEngineValidation,
} from "./form-engine-types";
export type { FormEngineActionsProps, FormEngineActionsLayout } from "./form-engine-actions";
export type { FormEngineProgressProps, FormEngineProgressVariant, FormEngineProgressState } from "./form-engine-progress";
export type { FormEngineNavigationProps } from "./form-engine-navigation";
export type { FormEngineStepMetaProps } from "./form-engine-step-meta";

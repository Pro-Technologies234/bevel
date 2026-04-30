import type { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import {
  IconArrowLeft,
  IconLoader2,
  IconChevronRight,
  IconCheck,
} from "@tabler/icons-react";
import { motion, AnimatePresence } from "motion/react";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "./form-engine-context";

/**
 * stack   — full-width next button, back centered below (card / modal forms)
 * split   — back left, next right (drawer / side-panel forms)
 * compact — back icon-only on mobile, next right (wizard / full-page forms)
 */
export type FormEngineNavigationLayout = "stack" | "split" | "compact";

const LAYOUT_CONFIG = {
  stack: {
    footer: "flex-col items-center gap-3",
    nextWrapper: "order-1 w-full",
    backWrapper: "order-2",
    nextFull: true,
    backIconOnly: false,
  },
  split: {
    footer: "flex-row items-center justify-between gap-4",
    nextWrapper: "order-2 min-w-[130px]",
    backWrapper: "order-1",
    nextFull: false,
    backIconOnly: false,
  },
  compact: {
    footer: "flex-row items-center justify-between gap-4",
    nextWrapper: "order-2 min-w-[160px]",
    backWrapper: "order-1",
    nextFull: false,
    backIconOnly: true,
  },
} as const satisfies Record<
  FormEngineNavigationLayout,
  {
    footer: string;
    nextWrapper: string;
    backWrapper: string;
    nextFull: boolean;
    backIconOnly: boolean;
  }
>;

export interface FormEngineNavigationProps {
  loading?: boolean;
  submitLabel?: string;
  nextLabel?: string;
  backLabel?: string;
  loadingLabel?: string;
  hideBackOnFirst?: boolean;
  layout?: FormEngineNavigationLayout;
  styles?: {
    container?: string;
    nextBtn?: string;
    backBtn?: string;
    nextIcon?: ReactNode;
    backIcon?: ReactNode;
    loadingIcon?: ReactNode;
    submitIcon?: ReactNode;
  };
}

export function FormEngineNavigation({
  loading,
  submitLabel = "Complete",
  nextLabel = "Continue",
  backLabel = "Go back",
  loadingLabel = "Processing...",
  layout = "stack",
  hideBackOnFirst = true,
  styles,
}: FormEngineNavigationProps) {
  const {
    isFirstStep,
    isLastStep,
    isSubmitting,
    isValidating,
    goBack,
    goNext,
  } = useFormEngineContext();

  const layoutCfg = LAYOUT_CONFIG[layout];
  const showBack = !isFirstStep || !hideBackOnFirst;
  const busy = isSubmitting || isValidating || !!loading;

  return (
    <footer
      className={cn(
        "w-full flex transition-all duration-300",
        layoutCfg.footer,
        styles?.container,
      )}
    >
      {/* Back */}
      <div className={cn("flex items-center", layoutCfg.backWrapper)}>
        <AnimatePresence mode="wait">
          {showBack && (
            <motion.button
              key="back"
              initial={{ opacity: 0, x: -8 }}
              animate={{ opacity: isFirstStep ? 0.35 : 1, x: 0 }}
              exit={{ opacity: 0, x: -8 }}
              transition={{ duration: 0.18 }}
              type="button"
              disabled={isFirstStep || busy}
              onClick={goBack}
              aria-label={backLabel}
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                "text-muted-foreground hover:text-foreground",
                "disabled:pointer-events-none disabled:opacity-35",
                layoutCfg.backIconOnly && "gap-0 sm:gap-1.5",
                styles?.backBtn,
              )}
            >
              {styles?.backIcon ?? <IconArrowLeft size={16} />}
              <span
                className={cn(layoutCfg.backIconOnly && "hidden sm:inline")}
              >
                {backLabel}
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>

      {/* Next / Submit */}
      <div
        className={cn(
          layoutCfg.nextWrapper,
          layoutCfg.nextFull ? "w-full" : "w-auto",
        )}
      >
        <Button
          size="lg"
          disabled={busy}
          onClick={goNext}
          type="button"
          className={cn(
            "relative text-base font-bold transition-all duration-200",
            "hover:scale-[1.02] active:scale-[0.98]",
            "disabled:pointer-events-none disabled:opacity-50",
            layoutCfg.nextFull ? "w-full" : "w-full sm:w-auto sm:px-8",
            styles?.nextBtn,
          )}
        >
          <AnimatePresence mode="wait">
            {busy ? (
              <motion.span
                key="loading"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {styles?.loadingIcon ?? (
                  <IconLoader2 className="animate-spin size-[18px]" />
                )}
                {loadingLabel}
              </motion.span>
            ) : isLastStep ? (
              <motion.span
                key="submit"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {submitLabel}
                {styles?.submitIcon ?? <IconCheck size={18} />}
              </motion.span>
            ) : (
              <motion.span
                key="next"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.15 }}
                className="flex items-center gap-2"
              >
                {nextLabel}
                {styles?.nextIcon ?? <IconChevronRight size={18} />}
              </motion.span>
            )}
          </AnimatePresence>
        </Button>
      </div>
    </footer>
  );
}

FormEngineNavigation.displayName = "FormEngineNavigation";

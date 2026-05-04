import { type ReactNode, type ComponentPropsWithoutRef } from "react";
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
 * stack   — full-width next, back centered below  (cards / modals)
 * split   — back left · next right                (drawers / panels)
 * compact — back icon-only on mobile · next right (wizards / full-page)
 */
export type FormEngineNavigationLayout = "stack" | "split" | "compact";

const LAYOUT_CLASS: Record<FormEngineNavigationLayout, string> = {
  stack: "flex-col items-center gap-3",
  split: "flex-row items-center justify-between gap-4",
  compact: "flex-row items-center justify-between gap-4",
};

export interface FormEngineNavigationProps {
  layout?: FormEngineNavigationLayout;
  className?: string;
  children?: ReactNode;
}

/**
 * Container. Accepts `layout` for the built-in back + next combo,
 * or `children` for full composition.
 *
 * @example built-in (zero config)
 * <FormEngineNavigation layout="split" />
 *
 * @example composed
 * <FormEngineNavigation layout="split">
 *   <FormEngineBackButton />
 *   <FormEngineNextButton submitLabel="Finish" />
 * </FormEngineNavigation>
 */
export function FormEngineNavigation({
  layout = "stack",
  className,
  children,
}: FormEngineNavigationProps) {
  const isStack = layout === "stack";
  const isSplit = layout === "split";

  return (
    <footer
      data-slot="form-engine-navigation"
      className={cn(
        "w-full flex transition-all duration-300",
        LAYOUT_CLASS[layout],
        className,
      )}
    >
      {children ?? (
        <>
          <FormEngineNextButton
            className={cn(
              isStack ? " w-full" : "order-2",
              isSplit && "ml-auto",
            )}
            fullWidth={isStack}
          />
          <FormEngineBackButton
            layout={layout}
            className={cn(isStack ? "w-full" : "order-1")}
            fullWidth={isStack}
          />
        </>
      )}
    </footer>
  );
}

FormEngineNavigation.displayName = "FormEngineNavigation";

// ─── Back Button ───────────────────────────────────────────────────────────────

export interface FormEngineBackButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "children"
> {
  label?: string;
  icon?: ReactNode;
  /** Collapse label to icon-only on mobile (compact layout) */
  iconOnly?: boolean;
  /** Hide when on the first step */
  hideOnFirst?: boolean;
  /** @internal used by FormEngineNavigation to set iconOnly per layout */
  layout?: FormEngineNavigationLayout;
  fullWidth?: boolean;
}

export function FormEngineBackButton({
  label = "Go back",
  icon,
  iconOnly,
  hideOnFirst = true,
  layout,
  fullWidth,
  className,
  ...props
}: FormEngineBackButtonProps) {
  const { isFirstStep, isSubmitting, isValidating, goBack } =
    useFormEngineContext();

  const busy = isSubmitting || isValidating;
  const hidden = isFirstStep && hideOnFirst;
  const collapseLabel = iconOnly ?? layout === "compact";

  return (
    <AnimatePresence mode="wait">
      {!hidden && (
        <motion.div
          key="back"
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -4 }}
          transition={{ duration: 0.15 }}
          data-slot="form-engine-back"
        >
          <Button
            size="lg"
            variant="secondary"
            type="button"
            disabled={isFirstStep || busy}
            onClick={goBack}
            aria-label={label}
            className={cn(
              "relative gap-2",
              fullWidth ? "w-full" : "w-full sm:w-auto sm:px-6",
              className,
            )}
            {...props}
          >
            {icon ?? <IconArrowLeft size={16} />}
            <span className={cn(collapseLabel && "hidden sm:inline")}>
              {label}
            </span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

FormEngineBackButton.displayName = "FormEngineBackButton";

export interface FormEngineNextButtonProps extends Omit<
  ComponentPropsWithoutRef<typeof Button>,
  "children"
> {
  nextLabel?: string;
  submitLabel?: string;
  loadingLabel?: string;
  nextIcon?: ReactNode;
  submitIcon?: ReactNode;
  loadingIcon?: ReactNode;
  loading?: boolean;
  /** Stretch to full container width */
  fullWidth?: boolean;
}

export function FormEngineNextButton({
  nextLabel = "Continue",
  submitLabel = "Complete",
  loadingLabel = "Processing...",
  nextIcon,
  submitIcon,
  loadingIcon,
  loading,
  fullWidth,
  className,
  ...props
}: FormEngineNextButtonProps) {
  const { isLastStep, isSubmitting, isValidating, goNext } =
    useFormEngineContext();

  const busy = isSubmitting || isValidating || !!loading;

  return (
    <Button
      data-slot="form-engine-next"
      size="lg"
      type="button"
      disabled={busy}
      onClick={goNext}
      className={cn(
        "relative gap-2",
        fullWidth ? "w-full" : "w-full sm:w-auto sm:px-6",
        className,
      )}
      {...props}
    >
      <AnimatePresence mode="wait">
        {busy ? (
          <motion.span
            key="loading"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {loadingIcon ?? <IconLoader2 size={16} className="animate-spin" />}
            {loadingLabel}
          </motion.span>
        ) : isLastStep ? (
          <motion.span
            key="submit"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {submitLabel}
            {submitIcon ?? <IconCheck size={16} />}
          </motion.span>
        ) : (
          <motion.span
            key="next"
            className="flex items-center gap-2"
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
          >
            {nextLabel}
            {nextIcon ?? <IconChevronRight size={16} />}
          </motion.span>
        )}
      </AnimatePresence>
    </Button>
  );
}

FormEngineNextButton.displayName = "FormEngineNextButton";

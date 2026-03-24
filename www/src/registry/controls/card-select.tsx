"use client";

import { cn } from "@/lib/utils";
import { useState, type ReactNode } from "react";
import { motion, AnimatePresence, spring } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { IconCheck } from "@tabler/icons-react";
import type { Icon } from "@tabler/icons-react";

// =============================================================================
// TYPES
// =============================================================================

type ColorVariant = "card" | "text";
type ColorState = "active" | "disabled" | "destructive";
export type ColorConfig = Record<ColorState, Record<ColorVariant, string>>;

export interface CardSelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  /** Accept either a Tabler Icon component or any ReactNode */
  icon?: Icon;
  preview?: string | ReactNode;
  badge?: string;
  disabled?: boolean;
  /** Force the card into its "active" color state without being selected */
  isActive?: boolean;
  /** Override the default color config for this specific card */
  colorConfig?: ColorConfig;
}

export interface SelectOption {
  label: string;
  value: string;
}

// =============================================================================
// TYPES — controlled / uncontrolled variants
// =============================================================================

interface CardSelectSharedProps<T = string> {
  layout?: "grid" | "list" | "scroll";
  columns?: 1 | 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  className?: string;
  renderCard?: (option: CardSelectOption<T>, isSelected: boolean) => ReactNode;
  options: CardSelectOption<T>[];
}

interface SingleControlled<T = string> {
  multiple?: false;
  value: T;
  defaultValue?: never;
  onChange: (value: T) => void;
}
interface SingleUncontrolled<T = string> {
  multiple?: false;
  value?: never;
  defaultValue?: T;
  onChange?: (value: T) => void;
}
interface MultiControlled<T = string> {
  multiple: true;
  value: T[];
  defaultValue?: never;
  onChange: (value: T[]) => void;
  max?: number;
}
interface MultiUncontrolled<T = string> {
  multiple: true;
  value?: never;
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  max?: number;
}

export type CardSelectProps<T = string> = CardSelectSharedProps<T> &
  (
    | SingleControlled<T>
    | SingleUncontrolled<T>
    | MultiControlled<T>
    | MultiUncontrolled<T>
  );

// =============================================================================
// CONSTANTS
// =============================================================================

const SIZE = {
  sm: {
    card: "rounded-xl",
    aspect: "aspect-[4/3]",
    label: "text-xs",
    badge: "h-4 w-4",
    check: 10,
  },
  md: {
    card: "rounded-2xl",
    aspect: "aspect-[4/3]",
    label: "text-sm",
    badge: "h-5 w-5",
    check: 12,
  },
  lg: {
    card: "rounded-2xl",
    aspect: "aspect-[3/2]",
    label: "text-base",
    badge: "h-6 w-6",
    check: 14,
  },
} as const;

const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

const DEFAULT_COLOR_CONFIG: ColorConfig = {
  active: {
    card: "border-primary/80 bg-white/5 shadow-2xl shadow-white/10",
    text: "text-foreground",
  },
  disabled: {
    card: "opacity-50 cursor-not-allowed border-white/10 bg-white/5",
    text: "text-muted-foreground",
  },
  destructive: {
    card: "border-destructive/60 bg-destructive/10",
    text: "text-destructive",
  },
} as const;

// =============================================================================
// HOOK — unified controlled / uncontrolled state
// =============================================================================

function useSelectState<T>(props: CardSelectProps<T>) {
  const isControlled = "value" in props && props.value !== undefined;

  const initialValue = (() => {
    if (props.multiple) {
      return (("defaultValue" in props ? props.defaultValue : undefined) ??
        []) as T[];
    }
    return ("defaultValue" in props ? props.defaultValue : undefined) as
      | T
      | undefined;
  })();

  const [internalValue, setInternalValue] = useState<T | T[] | undefined>(
    initialValue,
  );

  const currentValue = isControlled ? (props.value as T | T[]) : internalValue;

  function isSelected(val: T): boolean {
    if (props.multiple) {
      return ((currentValue as T[] | undefined) ?? []).some((v) => v === val);
    }
    return currentValue === val;
  }

  function handleSelect(val: T) {
    if (props.multiple) {
      const current = (currentValue as T[] | undefined) ?? [];
      let next: T[];
      if (current.some((v) => v === val)) {
        next = current.filter((v) => v !== val);
      } else {
        const max = (props as MultiControlled<T> | MultiUncontrolled<T>).max;
        if (max !== undefined && current.length >= max) return;
        next = [...current, val];
      }
      if (!isControlled) setInternalValue(next);
      (props as MultiControlled<T>).onChange?.(next);
    } else {
      if (!isControlled) setInternalValue(val);
      (props as SingleControlled<T>).onChange?.(val);
    }
  }

  return { currentValue, handleSelect, isSelected };
}

// =============================================================================
// HELPER — render icon accepting both Tabler Icon component and ReactNode
// =============================================================================

function RenderIcon({
  icon,
  size,
  className,
}: {
  icon: Icon;
  size: number;
  className?: string;
}) {
  const IconComp = icon as Icon;
  return <IconComp size={size} className={className} />;
}

// =============================================================================
// DEFAULT CARD — minimal doc-2 style + ColorConfig + isActive from doc-1
// =============================================================================

function DefaultCard<T>({
  option,
  isSelected,
  size = "md",
}: {
  option: CardSelectOption<T>;
  isSelected: boolean;
  size?: keyof typeof SIZE;
}) {
  const s = SIZE[size];
  const colorConfig = option.colorConfig ?? DEFAULT_COLOR_CONFIG;
  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  const cardCls = option.disabled
    ? colorConfig.disabled.card
    : isSelected || option.isActive
      ? colorConfig.active.card
      : "border-muted bg-white/5 opacity-80 hover:opacity-100";

  const textCls = option.disabled
    ? colorConfig.disabled.text
    : isSelected || option.isActive
      ? colorConfig.active.text
      : "text-foreground/40";

  return (
    <motion.div
      whileHover={option.disabled ? {} : { scale: 1.02 }}
      whileTap={option.disabled ? {} : { scale: 0.98 }}
      className={cn(
        "relative w-full overflow-hidden border transition-colors duration-300 flex flex-col gap-2 p-3",
        s.card,
        cardCls,
        (isSelected || option.isActive) && "ring-1 ring-primary/40",
      )}
    >
      {/* Top row — selection indicator + badge */}
      <div className="flex items-center justify-between pl-1">
        <div
          className={cn(
            "flex items-center justify-center rounded-full transition-all duration-150 shrink-0",
            s.badge,
            isSelected || option.isActive
              ? "bg-primary"
              : "bg-muted border border-border",
          )}
        >
          <AnimatePresence>
            {(isSelected || option.isActive) && (
              <motion.span
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0, opacity: 0 }}
              >
                <IconCheck
                  size={s.check}
                  strokeWidth={4}
                  className="text-primary-foreground"
                />
              </motion.span>
            )}
          </AnimatePresence>
        </div>

        {option.badge && (
          <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0 rounded-full">
            {option.badge}
          </Badge>
        )}
      </div>

      {/* Icon */}
      {option.icon && (
        <div className="bg-primary/20 w-fit p-1.5 rounded-lg">
          <RenderIcon
            icon={option.icon}
            size={iconSize}
            className={cn("text-primary", textCls)}
          />
        </div>
      )}

      {/* Label + description */}
      <div className="flex flex-col text-left  gap-0.5">
        <span
          className={cn(
            "font-medium leading-tight line-clamp-1 transition-colors duration-300",
            s.label,
            textCls,
          )}
        >
          {option.label}
        </span>
        {option.description && (
          <span className="text-xs text-muted-foreground leading-snug line-clamp-2">
            {option.description}
          </span>
        )}
      </div>

      {/* Selected shimmer overlay */}
      <AnimatePresence>
        {(isSelected || option.isActive) && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-white/5 ring-1 ring-inset ring-white/20 pointer-events-none"
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

// =============================================================================
// LIST CARD — doc-2 style + isActive + colorConfig + Tabler/ReactNode icons
// =============================================================================

function ListCard<T>({
  option,
  isSelected,
  size = "md",
}: {
  option: CardSelectOption<T>;
  isSelected: boolean;
  size?: keyof typeof SIZE;
}) {
  const s = SIZE[size];
  const colorConfig = option.colorConfig ?? DEFAULT_COLOR_CONFIG;
  const isHighlighted = isSelected || option.isActive;

  const cardCls = option.disabled
    ? cn("border-white/10 bg-white/5", colorConfig.disabled.card)
    : isHighlighted
      ? cn("border-primary/50 bg-white/5", colorConfig.active.card)
      : "border-white/10 bg-white/5 opacity-80 hover:opacity-100";

  const labelCls = option.disabled
    ? colorConfig.disabled.text
    : isHighlighted
      ? colorConfig.active.text
      : "text-foreground/70";

  const iconSize = size === "sm" ? 16 : size === "lg" ? 24 : 20;

  return (
    <div
      className={cn(
        "flex items-center gap-4 w-full px-4 py-3 rounded-xl border-2 transition-all duration-200",
        cardCls,
      )}
    >
      {/* Icon */}
      {option.icon && (
        <div
          className={cn(
            "shrink-0 transition-colors",
            isHighlighted ? "text-foreground" : "text-foreground/60",
          )}
        >
          <RenderIcon icon={option.icon} size={iconSize} />
        </div>
      )}

      {/* Image preview (string URL) */}
      {typeof option.preview === "string" && (
        <img
          src={option.preview}
          alt={option.label}
          className="h-10 w-10 rounded-lg object-cover shrink-0"
        />
      )}

      {/* Custom ReactNode preview */}
      {option.preview && typeof option.preview !== "string" && (
        <div className="h-10 w-10 shrink-0 overflow-hidden rounded-lg">
          {option.preview}
        </div>
      )}

      {/* Label + description */}
      <div className="flex-1 text-left min-w-0">
        <div className={cn("font-medium truncate", s.label, labelCls)}>
          {option.label}
        </div>
        {option.description && (
          <div className="text-xs text-muted-foreground mt-0.5 truncate">
            {option.description}
          </div>
        )}
      </div>

      {/* Badge */}
      {option.badge && (
        <Badge className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary shrink-0">
          {option.badge}
        </Badge>
      )}

      {/* Animated check circle */}
      <div
        className={cn(
          "shrink-0 flex items-center justify-center rounded-full border-2 transition-colors duration-200",
          s.badge,
          isHighlighted
            ? "border-primary bg-primary text-primary-foreground"
            : "border-white/20",
        )}
      >
        <AnimatePresence>
          {isHighlighted && (
            <motion.span
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0, opacity: 0 }}
            >
              <IconCheck size={s.check} strokeWidth={3} />
            </motion.span>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

// =============================================================================
// SCROLL CARD — same as DefaultCard but constrained width, no aspect ratio lock
// =============================================================================

function ScrollCard<T>({
  option,
  isSelected,
  size = "md",
}: {
  option: CardSelectOption<T>;
  isSelected: boolean;
  size?: keyof typeof SIZE;
}) {
  // Re-use DefaultCard — it handles both preview and icon layouts
  return <DefaultCard option={option} isSelected={isSelected} size={size} />;
}

// =============================================================================
// STAGGER VARIANTS
// =============================================================================

const containerVariants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
};

const itemVariants = {
  hidden: { y: 32, opacity: 0, scale: 0.88 },
  show: {
    y: 0,
    opacity: 1,
    scale: 1,
    transition: { type: spring, stiffness: 260, damping: 22 },
  },
};

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CardSelect<T = string>(props: CardSelectProps<T>) {
  const {
    options,
    layout = "grid",
    columns = 2,
    size = "md",
    className,
    renderCard: customRenderCard,
  } = props;

  const { handleSelect, isSelected } = useSelectState(props);

  const scrollWidth = { sm: "w-32", md: "w-44", lg: "w-56" }[size];

  const containerCls = cn(
    layout === "grid" && `grid ${COLS[columns]} gap-4`,
    layout === "list" && "flex flex-col gap-2",
    layout === "scroll" &&
      "flex flex-row gap-4 overflow-x-auto pb-2 snap-x snap-mandatory",
    className,
  );

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="show"
      className={containerCls}
    >
      {options.map((option, i) => {
        const selected = isSelected(option.value);

        const itemCls = cn(
          "relative outline-none focus-visible:ring-2 focus-visible:ring-primary",
          layout === "grid" &&
            "flex flex-col items-center gap-4 w-full rounded-2xl",
          layout === "list" && "w-full rounded-xl",
          layout === "scroll" &&
            cn(
              "flex flex-col items-center gap-3 shrink-0 snap-start rounded-2xl",
              scrollWidth,
            ),
          option.disabled && "cursor-not-allowed",
        );

        return (
          <motion.button
            key={String(option.value) + i}
            variants={itemVariants}
            type="button"
            disabled={option.disabled}
            onClick={() => !option.disabled && handleSelect(option.value)}
            aria-pressed={selected}
            className={itemCls}
          >
            {customRenderCard ? (
              customRenderCard(option, selected)
            ) : layout === "list" ? (
              <ListCard option={option} isSelected={selected} size={size} />
            ) : layout === "scroll" ? (
              <ScrollCard option={option} isSelected={selected} size={size} />
            ) : (
              <DefaultCard option={option} isSelected={selected} size={size} />
            )}
          </motion.button>
        );
      })}
    </motion.div>
  );
}

CardSelect.displayName = "CardSelect";

"use client";

import { cn } from "@/lib/utils";
import { ReactNode, useState } from "react";
import { motion, AnimatePresence, stagger } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { IconCheck } from "@tabler/icons-react";

// =============================================================================
// TYPES — shared, types
// =============================================================================

export interface CardSelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  preview?: string | ReactNode;
  badge?: string;
  disabled?: boolean;
}

export interface SelectOption {
  label: string;
  value: string;
}

// =============================================================================
// TYPES — self-contained, no shared types file
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

// =============================================================================
// DEFAULT CARD (grid + scroll layouts)
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
  const hasPreview = option.preview !== undefined;
  const iconOnly = !hasPreview && option.icon !== undefined;

  return (
    <>
      {option.badge && (
        <Badge className="absolute top-2 left-2 z-10 rounded-full bg-primary px-2 py-0.5 text-[10px] font-semibold text-primary-foreground">
          {option.badge}
        </Badge>
      )}
      <motion.div
        whileHover={option.disabled ? {} : { scale: 1.02 }}
        whileTap={option.disabled ? {} : { scale: 0.98 }}
        className={cn(
          "relative w-full overflow-hidden border transition-colors duration-300 outline-primary/40",
          s.card,
          iconOnly
            ? "flex items-center justify-center p-6 aspect-video"
            : s.aspect,
          isSelected
            ? "border-primary/80 bg-white/5 shadow-2xl shadow-white/10 outline-3"
            : "border-muted bg-white/5 opacity-80 hover:opacity-100",
        )}
      >
        {hasPreview && (
          <div className="h-full w-full">
            {typeof option.preview === "string" ? (
              <img
                src={option.preview}
                alt={option.label}
                className="h-full w-full object-cover"
              />
            ) : (
              option.preview
            )}
          </div>
        )}
        {iconOnly && (
          <div
            className={cn(
              "text-foreground/60 transition-colors",
              isSelected && "text-foreground",
            )}
          >
            {option.icon}
          </div>
        )}
        <AnimatePresence>
          {isSelected && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white/5 ring-1 ring-inset ring-white/20"
            />
          )}
        </AnimatePresence>
      </motion.div>

      <div className="flex flex-col items-center gap-2">
        <span
          className={cn(
            "font-medium transition-colors duration-300",
            s.label,
            isSelected ? "text-foreground" : "text-foreground/40",
          )}
        >
          {option.label}
        </span>
        {option.description && (
          <span className="text-xs text-muted-foreground text-center">
            {option.description}
          </span>
        )}
        <div className="h-1.5 w-1.5 rounded-full bg-foreground/10 overflow-hidden">
          <AnimatePresence>
            {isSelected && (
              <motion.div
                initial={{ y: 10 }}
                animate={{ y: 0 }}
                exit={{ y: 10 }}
                className="h-full w-full bg-foreground"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.5, opacity: 0 }}
            className={cn(
              "absolute top-2 right-2 z-10 flex items-center justify-center rounded-full bg-white text-black shadow-lg",
              s.badge,
            )}
          >
            <IconCheck size={s.check} strokeWidth={4} />
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

// =============================================================================
// LIST CARD
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
  return (
    <div
      className={cn(
        "flex items-center gap-4 w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 outline-primary/40",
        isSelected
          ? "border-primary/50 bg-white/5 outline-3"
          : "border-white/10 bg-white/5 opacity-80 hover:opacity-100",
      )}
    >
      {option.icon && (
        <div
          className={cn(
            "text-foreground/60 shrink-0 transition-colors",
            isSelected && "text-foreground",
          )}
        >
          {option.icon}
        </div>
      )}
      {typeof option.preview === "string" && (
        <img
          src={option.preview}
          alt={option.label}
          className="h-10 w-10 rounded-lg object-cover shrink-0"
        />
      )}
      <div className="flex-1 text-left">
        <div
          className={cn(
            "font-medium",
            s.label,
            isSelected ? "text-foreground" : "text-foreground/70",
          )}
        >
          {option.label}
        </div>
        {option.description && (
          <div className="text-xs text-green-400 dark:text-green-400 mt-0.5">
            {option.description}
          </div>
        )}
      </div>
      {option.badge && (
        <Badge className="rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-semibold text-primary">
          {option.badge}
        </Badge>
      )}
      <div
        className={cn(
          "shrink-0 flex items-center justify-center rounded-full border-2 transition-colors",
          s.badge,
          isSelected
            ? "border-primary bg-primary text-primary-foreground"
            : "border-white/20",
        )}
      >
        {isSelected && <IconCheck size={s.check} strokeWidth={3} />}
      </div>
    </div>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function CardSelect<T = string>({
  options,
  layout = "grid",
  columns = 2,
  size = "md",
  className,
  renderCard,
  multiple,
  ...props
}: CardSelectProps<T>) {
  const isControlled = "value" in props && props.value !== undefined;

  const [internalSingle, setInternalSingle] = useState<T | undefined>(
    !multiple && !isControlled
      ? (props as SingleUncontrolled<T>).defaultValue
      : undefined,
  );
  const [internalMulti, setInternalMulti] = useState<T[]>(
    multiple && !isControlled
      ? ((props as MultiUncontrolled<T>).defaultValue ?? [])
      : [],
  );

  const currentSingle = !multiple
    ? isControlled
      ? (props as SingleControlled<T>).value
      : internalSingle
    : undefined;
  const currentMulti = multiple
    ? isControlled
      ? (props as MultiControlled<T>).value
      : internalMulti
    : [];
  const max = multiple
    ? (props as MultiControlled<T> | MultiUncontrolled<T>).max
    : undefined;

  const isSelected = (val: T) =>
    multiple ? currentMulti.includes(val) : currentSingle === val;

  const handleSelect = (val: T) => {
    if (multiple) {
      const next = currentMulti.includes(val)
        ? currentMulti.filter((v) => v !== val)
        : max && currentMulti.length >= max
          ? currentMulti
          : [...currentMulti, val];
      if (!isControlled) setInternalMulti(next);
      (props as MultiControlled<T>).onChange?.(next);
    } else {
      if (!isControlled) setInternalSingle(val);
      (props as SingleControlled<T>).onChange?.(val);
    }
  };

  const scrollWidth = { sm: "w-32", md: "w-44", lg: "w-56" }[size];

  return (
    <motion.div
      variants={{
        show: {
          transition: {
            staggerChildren: 0.1,
          },
        },
        hidden: {},
      }}
      initial="hidden"
      animate="show"
      className={cn(
        layout === "grid" && `grid ${COLS[columns]} gap-4`,
        layout === "list" && "flex flex-col gap-2",
        layout === "scroll" &&
          "flex flex-row gap-4 overflow-x-auto pb-2 snap-x",
        className,
      )}
    >
      {options.map((option, i) => {
        const selected = isSelected(option.value);
        return (
          <motion.button
            variants={{
              hidden: { y: 50, opacity: 0, scale: 0.58 },
              show: { y: 0, opacity: 1, scale: 1 },
            }}
            key={String(option.value) + i}
            type="button"
            disabled={option.disabled}
            onClick={() => !option.disabled && handleSelect(option.value)}
            className={cn(
              "relative outline-none focus-visible:ring-2 focus-visible:ring-primary rounded-xl",
              layout === "grid" && "flex flex-col items-center gap-4 w-full",
              layout === "list" && "w-full",
              layout === "scroll" &&
                cn(
                  "flex flex-col items-center gap-3 shrink-0 snap-start",
                  scrollWidth,
                ),
              option.disabled && "cursor-not-allowed",
            )}
          >
            {renderCard ? (
              renderCard(option, selected)
            ) : layout === "list" ? (
              <ListCard option={option} isSelected={selected} size={size} />
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

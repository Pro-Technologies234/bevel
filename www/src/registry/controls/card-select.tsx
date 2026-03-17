"use client";

import { useState } from "react";
import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Icon } from "@tabler/icons-react";

// =============================================================================
// TYPES — shared, types
// =============================================================================

export interface CardSelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: Icon;
  preview?: string | ReactNode;
  badge?: string;
  disabled?: boolean;
  isActive?: boolean;
  colorConfig?: ColorConfig; // made optional — falls back to DEFAULT_COLOR_CONFIG
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

// Bug fix: "desctructive" → "destructive"
type ColorConfig = Record<ColorState, Record<ColorVariant, string>>;
type ColorVariant = "card" | "text";
type ColorState = "active" | "disabled" | "destructive";

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

// Bug fix: typo "desctructive" corrected to "destructive"
const DEFAULT_COLOR_CONFIG: ColorConfig = {
  active: {
    card: "bg-primary/10 border-primary/20 border",
    text: "text-foreground",
  },
  disabled: {
    card: "opacity-50 cursor-not-allowed",
    text: "text-muted-foreground",
  },
  destructive: {
    card: "bg-destructive/10 border-destructive/20 border",
    text: "text-destructive",
  },
} as const;

// =============================================================================
// HOOK — controlled/uncontrolled state (same pattern as chip-select)
// =============================================================================

function useSelectState<T>(props: CardSelectProps<T>): {
  currentValue: T | T[] | undefined;
  handleSelect: (val: T) => void;
  isSelected: (val: T) => boolean;
} {
  const isControlled = "value" in props && props.value !== undefined;

  const initialValue = (() => {
    if (props.multiple) {
      return ("defaultValue" in props ? props.defaultValue : undefined) ?? [];
    }
    return (
      ("defaultValue" in props ? props.defaultValue : undefined) ?? undefined
    );
  })();

  const [internalValue, setInternalValue] = useState<T | T[] | undefined>(
    initialValue as T | T[] | undefined,
  );

  const currentValue = isControlled ? (props.value as T | T[]) : internalValue;

  function isSelected(val: T): boolean {
    if (props.multiple) {
      const arr = (currentValue as T[] | undefined) ?? [];
      return arr.some((v) => v === val);
    }
    return currentValue === val;
  }

  function handleSelect(val: T) {
    if (props.multiple) {
      const current = (currentValue as T[] | undefined) ?? [];
      let next: T[];

      if (current.some((v) => v === val)) {
        // deselect
        next = current.filter((v) => v !== val);
      } else {
        // select — respect max
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
// COMPONENT
// =============================================================================

export function CardSelect<T = string>(props: CardSelectProps<T>) {
  const {
    options,
    layout = "grid",
    columns = 3,
    size = "md",
    className,
    renderCard: customRenderCard,
  } = props;

  const { handleSelect, isSelected } = useSelectState(props);
  const sz = SIZE[size];

  // ---- default card renderer ------------------------------------------------

  function defaultRenderCard(
    opt: CardSelectOption<T>,
    selected: boolean,
  ): ReactNode {
    const colorConfig = opt.colorConfig ?? DEFAULT_COLOR_CONFIG;

    // Resolve the color state: disabled > active/selected > default
    const colorState: ColorState = opt.disabled
      ? "disabled"
      : selected
        ? "active"
        : // fall back to an "inactive" look (reuse disabled text/card without the opacity trick)
          "disabled";

    // For unselected+enabled cards we want a neutral appearance, so we build a
    // small override rather than abusing the "disabled" slot.
    const cardCls = opt.disabled
      ? cn("border bg-card", colorConfig.disabled.card)
      : selected
        ? colorConfig.active.card
        : "border bg-card hover:bg-accent/50 transition-colors";

    const textCls = opt.disabled
      ? colorConfig.disabled.text
      : selected
        ? colorConfig.active.text
        : "text-foreground";

    const IconComp = opt.icon;

    return (
      <Card
        className={cn(
          "w-full transition-all duration-150",
          sz.card,
          cardCls,
          // ring on selected for extra clarity
          selected && "ring-1 ring-primary/40",
        )}
      >
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          {/* Selection indicator */}
          <div
            className={cn(
              "flex items-center justify-center rounded-full transition-all duration-150",
              sz.badge,
              selected ? "bg-primary" : "bg-muted border border-border",
            )}
          >
            {selected && <div className=" p-1 rounded-full bg-foreground" />}
          </div>

          {/* Optional badge */}
          {opt.badge && (
            <Badge className="bg-primary/20 text-primary text-[10px] px-1.5 py-0">
              {opt.badge}
            </Badge>
          )}
        </CardHeader>

        <CardContent className="flex flex-col gap-1 text-left pt-0">
          {/* Optional icon above label */}
          {IconComp && (
            <div className="bg-primary/20 w-fit p-1.5 rounded-lg">
              <IconComp
                size={size === "sm" ? 16 : size === "md" ? 20 : 24}
                className={cn(textCls, "text-primary")}
              />
            </div>
          )}

          <CardTitle
            className={cn("line-clamp-1 font-medium", sz.label, textCls)}
          >
            {opt.label}
          </CardTitle>

          {opt.description && (
            <CardDescription className="text-xs line-clamp-2 leading-snug">
              {opt.description}
            </CardDescription>
          )}
        </CardContent>
      </Card>
    );
  }

  // ---- layout wrapper -------------------------------------------------------

  const containerCls = (() => {
    if (layout === "list") return "flex flex-col gap-2";
    if (layout === "scroll")
      return "flex flex-row gap-3 overflow-x-auto pb-2 snap-x snap-mandatory";
    // grid
    return cn("grid gap-3", COLS[columns]);
  })();

  const itemCls =
    layout === "scroll"
      ? cn(
          "snap-start shrink-0",
          size === "sm" ? "w-36" : size === "lg" ? "w-56" : "w-44",
        )
      : undefined;

  // ---- render ---------------------------------------------------------------

  return (
    <div className={cn(containerCls, className)}>
      {options.map((opt, idx) => {
        const selected = isSelected(opt.value);
        const card = customRenderCard
          ? customRenderCard(opt, selected)
          : defaultRenderCard(opt, selected);

        return (
          <button
            key={idx}
            type="button"
            disabled={opt.disabled}
            onClick={() => {
              if (!opt.disabled) handleSelect(opt.value);
            }}
            className={cn(
              "text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-2xl",
              opt.disabled && "cursor-not-allowed",
              itemCls,
            )}
            aria-pressed={selected}
          >
            {card}
          </button>
        );
      })}
    </div>
  );
}

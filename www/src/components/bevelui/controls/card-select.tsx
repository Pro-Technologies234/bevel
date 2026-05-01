"use client";

import { cn } from "@/lib/utils";
import { type ReactNode, useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

// ─── Types ────────────────────────────────────────────────────────────────────
// (Kept original types for full functionality)
export interface CardSelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  preview?: string | ReactNode;
  badge?: string;
  disabled?: boolean;
}

type CardSelectSharedProps<T = string> = {
  layout?: "grid" | "list" | "scroll";
  columns?: 1 | 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  className?: string;
  renderCard?: (option: CardSelectOption<T>, isSelected: boolean) => ReactNode;
  options: CardSelectOption<T>[];
};

type SingleControlled<T = string> = {
  multiple?: false;
  value: T;
  defaultValue?: never;
  onChange: (value: T) => void;
};
type SingleUncontrolled<T = string> = {
  multiple?: false;
  value?: never;
  defaultValue?: T;
  onChange?: (value: T) => void;
};
type MultiControlled<T = string> = {
  multiple: true;
  value: T[];
  defaultValue?: never;
  onChange: (value: T[]) => void;
  max?: number;
};
type MultiUncontrolled<T = string> = {
  multiple: true;
  value?: never;
  defaultValue?: T[];
  onChange?: (value: T[]) => void;
  max?: number;
};

export type CardSelectProps<T = string> = CardSelectSharedProps<T> &
  (
    | SingleControlled<T>
    | SingleUncontrolled<T>
    | MultiControlled<T>
    | MultiUncontrolled<T>
  );

// ─── Constants ────────────────────────────────────────────────────────────────

const SIZE = {
  sm: {
    card: "rounded-lg",
    label: "text-sm",
    desc: "text-xs",
    indicator: "h-4 w-4",
  },
  md: {
    card: "rounded-xl",
    label: "text-base",
    desc: "text-sm",
    indicator: "h-5 w-5",
  },
  lg: {
    card: "rounded-2xl",
    label: "text-lg",
    desc: "text-base",
    indicator: "h-6 w-6",
  },
} as const;

const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

// ─── Redesigned List Card ─────────────────────────────────────────────────────

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
    <Card
      className={cn(
        "group relative flex flex-row items-start justify-between w-full p-4 text-left transition-all duration-200 border",
        s.card,
        isSelected
          ? "border-card bg-card shadow-sm"
          : "border-muted bg-transparent hover:bg-muted/50",
        option.disabled && "opacity-50",
      )}
    >
      <div className="flex flex-col gap-1 pr-8">
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "font-semibold tracking-tight transition-colors",
              s.label,
            )}
          >
            {option.label}
          </span>
          {option.badge && (
            <Badge
              variant="secondary"
              className="text-[10px] uppercase tracking-wider py-0 px-1.5"
            >
              {option.badge}
            </Badge>
          )}
        </div>

        {option.description && (
          <p className={cn("leading-relaxed transition-colors", s.desc)}>
            {option.description}
          </p>
        )}
      </div>

      {/* Radio Indicator */}
      <div
        className={cn(
          "shrink-0 flex items-center justify-center rounded-full border-2 transition-all duration-200 ",
          s.indicator,
          isSelected ? "border-border bg-muted" : "border-border",
        )}
      >
        {isSelected && (
          <div className="h-1.5 w-1.5 rounded-full bg-foreground" />
        )}
      </div>
    </Card>
  );
}

// ─── CardSelect Main Component ────────────────────────────────────────────────

export function CardSelect<T = string>({
  options,
  layout = "list", // Defaulted to list for this style
  columns = 1,
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

  return (
    <div
      className={cn(
        "grid gap-3",
        layout === "grid" && COLS[columns as keyof typeof COLS],
        className,
      )}
    >
      {options.map((option, i) => (
        <button
          key={String(option.value) + i}
          type="button"
          disabled={option.disabled}
          onClick={() => !option.disabled && handleSelect(option.value)}
          className="relative block w-full outline-none focus-visible:ring-2 focus-visible:ring-card rounded-xl"
        >
          <ListCard
            option={option}
            isSelected={isSelected(option.value)}
            size={size}
          />
        </button>
      ))}
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";
import { cva } from "class-variance-authority";
import { type ReactNode, useState } from "react";
import { Badge } from "@/components/ui/badge";
import { IconCheck } from "@tabler/icons-react";

export interface CardSelectOption<T = string> {
  value: T;
  label: string;
  description?: string;
  icon?: ReactNode;
  badge?: string;
  disabled?: boolean;
}

type CardSelectSharedProps<T = string> = {
  layout?: "grid" | "list" | "scroll";
  columns?: 1 | 2 | 3 | 4;
  size?: "sm" | "md" | "lg";
  className?: string;
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

const cardVariants = cva(
  [
    "group relative w-full rounded-lg border bg-transparent text-left",
    "transition-colors duration-150",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    "disabled:pointer-events-none disabled:opacity-50",
  ],
  {
    variants: {
      selected: {
        true: "border-primary bg-primary/5",
        false:
          "border-input hover:border-accent-foreground/20 hover:bg-accent/40",
      },
      size: {
        sm: "p-3 gap-2",
        md: "p-4 gap-3",
        lg: "p-5 gap-4",
      },
    },
    defaultVariants: {
      selected: false,
      size: "md",
    },
  },
);

const indicatorVariants = cva(
  "flex shrink-0 items-center justify-center border transition-colors duration-150",
  {
    variants: {
      selected: {
        true: "border-primary bg-primary text-primary-foreground",
        false: "border-input bg-transparent",
      },
      multiple: {
        true: "rounded-sm",
        false: "rounded-full",
      },
      size: {
        sm: "size-3.5",
        md: "size-4",
        lg: "size-[18px]",
      },
    },
    defaultVariants: {
      selected: false,
      multiple: false,
      size: "md",
    },
  },
);

const COLS = {
  1: "grid-cols-1",
  2: "grid-cols-2",
  3: "grid-cols-3",
  4: "grid-cols-4",
} as const;

function CardItem<T>({
  option,
  isSelected,
  isMultiple,
  size = "md",
}: {
  option: CardSelectOption<T>;
  isSelected: boolean;
  isMultiple: boolean;
  size?: "sm" | "md" | "lg";
}) {
  return (
    <div
      className={cn(
        cardVariants({ selected: isSelected, size }),
        "flex items-start",
      )}
    >
      {/* Indicator */}
      <div
        className={cn(
          indicatorVariants({
            selected: isSelected,
            multiple: isMultiple,
            size,
          }),
          "mt-0.5",
        )}
        aria-hidden
      >
        {isSelected && (
          <IconCheck
            className={cn(
              size === "sm" ? "size-2" : size === "lg" ? "size-3" : "size-2.5",
              "stroke-[2.5]",
            )}
          />
        )}
      </div>

      {/* Content */}
      <div className="ml-3 flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-2">
          {option.icon && (
            <span className="shrink-0 text-muted-foreground">
              {option.icon}
            </span>
          )}
          <span
            className={cn(
              "font-medium leading-snug",
              size === "sm"
                ? "text-sm"
                : size === "lg"
                  ? "text-base"
                  : "text-sm",
              isSelected ? "text-foreground" : "text-foreground",
            )}
          >
            {option.label}
          </span>
          {option.badge && (
            <Badge variant="secondary" className="ml-auto shrink-0 text-xs">
              {option.badge}
            </Badge>
          )}
        </div>

        {option.description && (
          <p
            className={cn(
              "leading-snug text-muted-foreground",
              size === "sm" ? "text-xs" : "text-sm",
            )}
          >
            {option.description}
          </p>
        )}
      </div>
    </div>
  );
}

export function CardSelect<T = string>({
  options,
  layout = "list",
  columns = 1,
  size = "md",
  className,
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
      role={multiple ? "group" : "radiogroup"}
      className={cn(
        "grid",
        layout === "grid" ? COLS[columns as keyof typeof COLS] : "grid-cols-1",
        layout === "scroll" && "overflow-x-auto",
        "gap-2",
        className,
      )}
    >
      {options.map((option, i) => (
        <button
          key={String(option.value) + i}
          type="button"
          role={multiple ? "checkbox" : "radio"}
          aria-checked={isSelected(option.value)}
          disabled={option.disabled}
          onClick={() => !option.disabled && handleSelect(option.value)}
          className={cn(
            "w-full rounded-lg outline-none",
            "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            option.disabled && "cursor-not-allowed",
          )}
        >
          <CardItem
            option={option}
            isSelected={isSelected(option.value)}
            isMultiple={!!multiple}
            size={size}
          />
        </button>
      ))}
    </div>
  );
}

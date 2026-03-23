"use client";

import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { Icon } from "@tabler/icons-react";
import { useState } from "react";

const SIZE = {
  sm: {
    chip: "h-7 px-3 text-xs gap-1.5",
    badge: "text-[9px] px-1.5 h-4",
    icon: "size-3",
  },
  md: {
    chip: "h-9 px-4 text-sm gap-2",
    badge: "text-[10px] px-1.5 h-5",
    icon: "size-4",
  },
  lg: {
    chip: "h-11 px-5 text-base gap-2.5",
    badge: "text-xs px-2 h-5",
    icon: "size-5",
  },
} as const;

function Chip({
  option,
  isActive,
  size = "md",
  activeClassName,
  onClick,
}: {
  option: ChipOption;
  isActive: boolean;
  size?: keyof typeof SIZE;
  activeClassName?: string;
  onClick: () => void;
}) {
  const s = SIZE[size];

  const chip = (
    <button
      type="button"
      disabled={option.disabled}
      onClick={onClick}
      style={
        isActive && option.color
          ? { backgroundColor: option.color, borderColor: option.color }
          : undefined
      }
      className={cn(
        // base
        "inline-flex items-center rounded-full border font-medium transition-all duration-200 shrink-0",
        "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary",
        s.chip,
        // inactive
        !isActive &&
          "border-border bg-card text-muted-foreground hover:border-primary/30 hover:text-foreground hover:bg-accent",
        // active (no custom color)
        isActive &&
          !option.color &&
          " bg-primary text-primary-foreground hover:bg-primary/90",
        // active (custom color — border + bg via inline style above)
        isActive && option.color && "text-white",
        // disabled
        option.disabled && "cursor-not-allowed opacity-40 pointer-events-none",
        isActive && activeClassName,
      )}
    >
      {option.icon && (
        <option.icon className={cn("shrink-0", s.icon)} />
      )}

      <span className="capitalize ">{option.label}</span>

      {option.badge !== undefined && (
        <span
          className={cn(
            "inline-flex items-center justify-center rounded-full font-semibold leading-none",
            s.badge,
            isActive
              ? "bg-white/20 text-inherit"
              : "bg-muted text-muted-foreground",
          )}
        >
          {option.badge}
        </span>
      )}
    </button>
  );

  if (!option.description) return chip;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{chip}</TooltipTrigger>
      <TooltipContent>{option.description}</TooltipContent>
    </Tooltip>
  );
}


function ChipSelect({
  options,
  isLoading,
  canWrap = true,
  size = "md",
  className,
  activeClassName,
  multiple,
  ...props
}: ChipSelectProps) {
  const isControlled = "value" in props && props.value !== undefined;

  const [internalSingle, setInternalSingle] = useState<string | undefined>(
    !multiple && !isControlled
      ? (props as SingleUncontrolled).defaultValue
      : undefined,
  );
  const [internalMulti, setInternalMulti] = useState<string[]>(
    multiple && !isControlled
      ? ((props as MultiUncontrolled).defaultValue ?? [])
      : [],
  );

  const currentSingle = !multiple
    ? isControlled
      ? (props as SingleControlled).value
      : internalSingle
    : undefined;

  const currentMulti = multiple
    ? isControlled
      ? (props as MultiControlled).value
      : internalMulti
    : [];

  const max = multiple
    ? (props as MultiControlled | MultiUncontrolled).max
    : undefined;

  const isActive = (val: string) =>
    multiple ? currentMulti.includes(val) : currentSingle === val;

  const handleClick = (val: string) => {
    if (multiple) {
      const next = currentMulti.includes(val)
        ? currentMulti.filter((v) => v !== val)
        : max && currentMulti.length >= max
          ? currentMulti
          : [...currentMulti, val];
      if (!isControlled) setInternalMulti(next);
      (props as MultiControlled).onChange?.(next);
    } else {
      if (!isControlled) setInternalSingle(val);
      (props as SingleControlled).onChange?.(val);
    }
  };

  return (
    <TooltipProvider delayDuration={300}>
      <div
        className={cn(
          "flex gap-2",
          canWrap
            ? "flex-wrap"
            : "overflow-x-auto pb-1 no-scrollbar flex-nowrap",
          className,
        )}
      >
        {isLoading
          ? Array.from({ length: 6 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-full" />
            ))
          : options.map((opt) => (
              <Chip
                key={opt.value}
                option={opt}
                isActive={isActive(opt.value)}
                size={size}
                activeClassName={activeClassName}
                onClick={() => !opt.disabled && handleClick(opt.value)}
              />
            ))}
      </div>
    </TooltipProvider>
  );
}

export interface ChipOption {
  value: string;
  label: string;
  icon?: Icon;
  description?: string; // shows in shadcn Tooltip on hover
  badge?: string | number;
  disabled?: boolean;
  color?: string; // overrides active bg color e.g. "#FF4560"
}

interface ChipSelectSharedProps {
  options: ChipOption[];
  isLoading?: boolean;
  canWrap?: boolean;
  size?: "sm" | "md" | "lg";
  className?: string;
  activeClassName?: string;
}

// Controlled single
interface SingleControlled {
  multiple?: false;
  value: string;
  defaultValue?: never;
  onChange: (value: string) => void;
}

// Uncontrolled single
interface SingleUncontrolled {
  multiple?: false;
  value?: never;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

// Controlled multi
interface MultiControlled {
  multiple: true;
  value: string[];
  defaultValue?: never;
  onChange: (value: string[]) => void;
  max?: number;
}

// Uncontrolled multi
interface MultiUncontrolled {
  multiple: true;
  value?: never;
  defaultValue?: string[];
  onChange?: (value: string[]) => void;
  max?: number;
}

export type ChipSelectProps = ChipSelectSharedProps &
  (SingleControlled | SingleUncontrolled | MultiControlled | MultiUncontrolled);

ChipSelect.displayName = "ChipSelect";

export { ChipSelect, Chip, };

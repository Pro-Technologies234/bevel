"use client";

import { motion } from "motion/react";
import { cn } from "@/lib/utils";
import type { Icon } from "@tabler/icons-react";
import { IconStar, IconStarFilled } from "@tabler/icons-react";
import { useId, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

type RatingFieldControlled = {
  value: number;
  defaultValue?: never;
  onChange: (stars: number) => void;
  onHover?: (rate: number) => void;
};

type RatingFieldUncontrolled = {
  value?: never;
  defaultValue?: number;
  onChange?: (stars: number) => void;
  onHover?: (rate: number) => void;
};

export type RatingFieldProps = {
  max?: number;
  icon?: Icon;
  emptyIcon?: Icon;
  size?: string | number;
  showValue?: boolean;
  single?: boolean;
  disabled?: boolean;
  accentColor?: string;
  allowDeselect?: boolean;
  levels?: { color?: string; icon?: Icon; emptyIcon?: Icon }[];
  className?: string;
} & (RatingFieldControlled | RatingFieldUncontrolled);

type RateProps = {
  layoutId?: string;
  icon?: Icon;
  emptyIcon?: Icon;
  rating: number;
  value: number;
  showValue?: boolean;
  allowDeselect?: boolean;
  className?: string;
  accentColor?: string;
  isActive: boolean;
  disabled?: boolean;
  size?: string | number;
  setRating: (rate: number) => void;
  setHover: (rate: number) => void;
};

// ─── Rate button ──────────────────────────────────────────────────────────────

function Rate({
  isActive,
  disabled,
  setRating,
  setHover,
  value,
  rating,
  icon = IconStarFilled,
  emptyIcon = IconStar,
  size = 40,
  layoutId,
  className,
  showValue,
  allowDeselect,
  accentColor = "#ffdf20",
}: RateProps) {
  const RateIcon = isActive ? icon : emptyIcon;
  const current = rating === value && !isActive;

  return (
    <motion.button
      disabled={disabled}
      whileHover={{ scale: disabled ? 1 : 1.2, rotate: disabled ? 0 : 5 }}
      whileTap={{ scale: 0.9 }}
      type="button"
      onClick={() => {
        if (!allowDeselect) { setRating(value); return; }
        if (rating === value) setRating(0);
        else setRating(value);
      }}
      onMouseEnter={() => setHover(value)}
      onMouseLeave={() => setHover(0)}
      className={cn("relative p-1.5 outline-none group cursor-pointer", className)}
    >
      <RateIcon
        size={size}
        strokeWidth={1.5}
        style={{
          ...(current
            ? { color: accentColor, opacity: 0.6 }
            : isActive ? { color: accentColor } : undefined),
        }}
        className={cn(
          "transition-all duration-300",
          isActive ? "drop-shadow-md" : "text-muted-foreground/30 group-hover:text-muted-foreground/50",
        )}
      />
      {showValue && <span>{value}</span>}
      {rating === value && (
        <motion.div
          layoutId={layoutId ?? "active-glow"}
          style={{ backgroundColor: accentColor, opacity: 0.2 }}
          className="absolute inset-0 rounded-full blur-lg -z-10"
        />
      )}
    </motion.button>
  );
}

// ─── RatingField ──────────────────────────────────────────────────────────────

export function RatingField({
  disabled,
  icon,
  max = 5,
  size,
  showValue,
  className,
  accentColor,
  emptyIcon,
  levels,
  single,
  allowDeselect,
  ...props
}: RatingFieldProps) {
  const uid = useId();
  const isControlled = "value" in props && props.value !== undefined;
  const [internalValue, setInternalValue] = useState<number | undefined>(
    !isControlled ? (props as RatingFieldUncontrolled).defaultValue : undefined,
  );
  const [hover, setHover] = useState(0);

  const currentDisplay = hover || (!isControlled ? internalValue : props.value) || 0;
  const currentValue = isControlled ? (props as RatingFieldControlled).value : internalValue || 0;

  const handleChange = (val: number) => {
    if (!isControlled) setInternalValue(val);
    props.onChange?.(val);
  };

  const handleHover = (val: number) => {
    setHover(val);
    props.onHover?.(val);
  };

  return (
    <div className={cn("flex", disabled && "opacity-70 cursor-not-allowed", className)}>
      {Array.from({ length: max }).map((_, index) => {
        const starValue = index + 1;
        const isActive = single ? starValue === currentDisplay : starValue <= currentDisplay;
        const level = levels?.[index];
        return (
          <Rate
            key={index}
            rating={currentValue}
            value={starValue}
            icon={level?.icon ?? icon}
            emptyIcon={level?.emptyIcon ?? emptyIcon}
            size={size}
            isActive={isActive}
            setHover={handleHover}
            disabled={disabled}
            showValue={showValue}
            accentColor={level?.color ?? accentColor}
            setRating={handleChange}
            layoutId={uid}
            allowDeselect={allowDeselect}
          />
        );
      })}
    </div>
  );
}

RatingField.displayName = "RatingField";

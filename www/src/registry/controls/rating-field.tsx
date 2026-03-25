import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Icon, IconStar, IconStarFilled } from "@tabler/icons-react";
import { useId, useState } from "react";

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
      onClick={() => {
        if (!allowDeselect) {
          setRating(value);
        }
        if (rating == value) {
          setRating(0);
        }
      }}
      onMouseEnter={() => setHover(value)}
      onMouseLeave={() => setHover(0)}
      className={cn(
        "relative p-1.5 outline-none group cursor-pointer",
        className,
      )}
    >
      <RateIcon
        size={size}
        strokeWidth={1.5}
        style={{
          ...(current
            ? { color: accentColor, opacity: 0.6 }
            : isActive
              ? { color: accentColor }
              : undefined),
        }}
        className={cn(
          `transition-all duration-300`,
          isActive
            ? cn(`drop-shadow-md `)
            : "text-muted-foreground/30 group-hover:text-muted-foreground/50",
        )}
      />
      {showValue && <span>{value}</span>}
      {rating === value && (
        <motion.div
          layoutId={layoutId || "active-glow"}
          style={{
            backgroundColor: accentColor,
            opacity: 0.2,
          }}
          className={`absolute inset-0  rounded-full blur-lg -z-10`}
        />
      )}
    </motion.button>
  );
}
function RatingField({
  disabled,
  icon,
  max = 5,
  size,
  value,
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
  const [hover, setHover] = useState<undefined | number>(undefined);
  const currentDisplay = hover || internalValue || 0;
  const currentValue = isControlled
    ? (props as RatingFieldControlled).value
    : internalValue || 0;
  const handleChange = (val: number) => {
    if (!isControlled) setInternalValue(val);
    props.onChange?.(val);
  };
  const handleHoverChange = (val: number) => {
    if (!isControlled) setHover(val);
    props.onHover?.(val);
  };

  return (
    <div
      className={cn(
        "flex ",
        className,
        disabled && "opacity-70 cursor-not-allowed ",
      )}
    >
      {[...Array(max)]?.map((_, index) => {
        const starValue = index + 1;
        const isActive = !single
          ? starValue <= currentDisplay
          : starValue == currentDisplay;
        const level = levels?.[index];
        return (
          <Rate
            rating={currentValue}
            value={starValue}
            icon={level?.icon || icon}
            emptyIcon={level?.emptyIcon || emptyIcon}
            key={index}
            size={size}
            isActive={isActive}
            setHover={handleHoverChange}
            disabled={disabled}
            showValue={showValue}
            accentColor={level?.color || accentColor}
            setRating={handleChange}
            layoutId={uid}
          />
        );
      })}
    </div>
  );
}

// Controlled
interface RatingFieldControlled {
  value: number;
  defaultValue?: never;
  onChange: (Stars: number) => void;
  onHover?: (rate: number) => void;
}

// Uncontrolled
interface RatingFieldUncontrolled {
  value?: never;
  defaultValue?: number;
  onChange?: (Stars: number) => void;
  onHover?: (rate: number) => void;
}

type RateProps = {
  layoutId?: string;
  icon?: Icon;
  emptyIcon?: Icon;
  rating: number;
  value: number;
  showValue?: boolean; // shows numeric value next to rating
  allowDeselect?: boolean; // allows deselection of rating which equals 0 (zero)
  className?: string;
  accentColor?: string;
  isActive: boolean;
  hasFill?: boolean;
  disabled?: boolean;
  size?: string | number;
  setRating: (rate: number) => void;
  setHover: (rate: number) => void;
};

export type RatingFieldProps = {
  max?: number; // default 5
  icon?: Icon; // default IconStar from tabler
  emptyIcon?: Icon; // default IconStar from tabler
  size?: string | number;
  showValue?: boolean; // shows numeric value next to rating
  single?: boolean;
  disabled?: boolean;
  accentColor?: string;
  allowDeselect?: boolean; // allows deselection of rating which equals 0 (zero)
  levels?: { color?: string; icon?: Icon; emptyIcon?: Icon }[];
  className?: string;
} & (RatingFieldControlled | RatingFieldUncontrolled);

RatingField.displayName = "RatingField";

export { RatingField, Rate };

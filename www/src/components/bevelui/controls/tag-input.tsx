"use client";

import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import {
  type KeyboardEvent,
  useCallback,
  useMemo,
  useRef,
  useState,
} from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { IconX } from "@tabler/icons-react";

const tagVariants = cva(
  "inline-flex items-center gap-1 rounded-md font-medium select-none",
  {
    variants: {
      size: {
        sm: "h-5 px-1.5 text-[11px]",
        md: "h-6 px-2 text-xs",
        lg: "h-7 px-2.5 text-sm",
      },
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary: "bg-secondary text-secondary-foreground",
        outline: "border border-border text-foreground",
        ghost: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "secondary",
    },
  },
);

interface TagInputControlled {
  value: string[];
  defaultValue?: never;
  onChange?: (tags: string[]) => void;
}

interface TagInputUncontrolled {
  value?: never;
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
}

export type TagInputProps = {
  max?: number;
  allowDuplicates?: boolean;
  delimiter?: string[];
  placeholder?: string;
  validate?: (val: string) => boolean;
  disabled?: boolean;
  isLoading?: boolean;
  className?: string;
  tagClassName?: string;
} & (TagInputControlled | TagInputUncontrolled) &
  VariantProps<typeof tagVariants>;

interface TagProps {
  id: string;
  value: string;
  size?: VariantProps<typeof tagVariants>["size"];
  variant?: VariantProps<typeof tagVariants>["variant"];
  className?: string;
  onRemove?: (id: string) => void;
}

function Tag({ id, value, size, variant, className, onRemove }: TagProps) {
  return (
    <span className={cn(tagVariants({ size, variant }), className)}>
      {value}
      {onRemove && (
        <button
          type="button"
          aria-label={`Remove ${value}`}
          onClick={() => onRemove(id)}
          className="ml-0.5 rounded-sm opacity-60 transition-opacity hover:opacity-100 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          <IconX className="size-3" />
        </button>
      )}
    </span>
  );
}

export function TagInput({
  variant = "secondary",
  size = "md",
  isLoading,
  disabled,
  max,
  value,
  placeholder = "Add tag…",
  delimiter = [",", "Enter"],
  allowDuplicates = false,
  validate,
  className,
  tagClassName,
  ...props
}: TagInputProps) {
  const isControlled = value !== undefined;

  const [internalValue, setInternalValue] = useState<string[]>(
    !isControlled ? ((props as TagInputUncontrolled).defaultValue ?? []) : [],
  );

  const tags = useMemo(
    () => (isControlled ? value : internalValue),
    [isControlled, value, internalValue],
  );

  const wrapperRef = useRef<HTMLDivElement>(null);

  const setTags = useCallback(
    (next: string[]) => {
      if (!isControlled) setInternalValue(next);
      props.onChange?.(next);
    },
    [isControlled, props],
  );

  const handleRemove = useCallback(
    (id: string) => {
      const next = (tags ?? []).filter((_, i) => String(i) !== id);
      setTags(next);
    },
    [tags, setTags],
  );

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;
      const raw = e.currentTarget.value;
      const trimmed = raw.trim();
      const current = tags ?? [];

      if (key === "Backspace" && raw === "") {
        setTags(current.slice(0, -1));
        return;
      }

      if (delimiter.includes(key) && trimmed) {
        if (key !== "Backspace") e.preventDefault();

        if (validate && !validate(trimmed)) return;

        if (!allowDuplicates && current.includes(trimmed)) return;

        if (max !== undefined && current.length >= max) return;

        setTags([...current, trimmed]);
        e.currentTarget.value = "";
      }
    },
    [tags, setTags, delimiter, allowDuplicates, validate, max],
  );

  const focusInput = () => {
    wrapperRef.current?.querySelector("input")?.focus();
  };

  return (
    <div
      ref={wrapperRef}
      onClick={focusInput}
      aria-disabled={disabled}
      className={cn(
        "flex min-h-9 w-full flex-wrap items-center gap-1.5 rounded-md border border-input bg-transparent px-3 py-1.5 text-sm shadow-xs",
        "transition-[color,box-shadow]",
        "focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50",
        "aria-[invalid=true]:border-destructive aria-[invalid=true]:ring-3 aria-[invalid=true]:ring-destructive/20",
        "dark:bg-input/30",
        disabled && "pointer-events-none cursor-not-allowed opacity-50",
        className,
      )}
    >
      {isLoading
        ? Array.from({ length: max ?? 3 }).map((_, i) => (
            <Skeleton
              key={i}
              className={cn(tagVariants({ size }), "w-16 bg-muted")}
              style={{ width: `${3 + i * 1.2}rem` }}
            />
          ))
        : tags?.map((v, i) => (
            <Tag
              key={`${v}-${i}`}
              id={String(i)}
              value={v}
              size={size}
              variant={variant}
              className={tagClassName}
              onRemove={!disabled ? handleRemove : undefined}
            />
          ))}

      {!isLoading && (
        <input
          disabled={disabled}
          placeholder={tags?.length ? undefined : placeholder}
          onKeyDown={handleKeyDown}
          className={cn(
            "min-w-[6rem] flex-1 bg-transparent outline-none placeholder:text-muted-foreground",
            "disabled:cursor-not-allowed",
          )}
        />
      )}
    </div>
  );
}

TagInput.displayName = "TagInput";

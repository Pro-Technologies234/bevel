import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import { IconX } from "@tabler/icons-react";
import { cva, VariantProps } from "class-variance-authority";
import { KeyboardEvent, useState } from "react";

const tagVariants = cva(
  // Base classes — always applied
  "inline-flex items-center rounded-full font-medium relative group overflow-visible text-base!",
  {
    variants: {
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-7 px-3 text-sm",
        lg: "h-8 px-4 text-base",
      },
      variant: {
        default: "bg-primary text-primary-foreground",
        secondary:
          "bg-secondary text-secondary-foreground [a]:hover:bg-secondary/80",
        outline: "border border-border text-foreground",
        ghost: "bg-muted text-muted-foreground",
      },
    },
    defaultVariants: {
      size: "md",
      variant: "default",
    },
  },
);

function Tag({
  variant,
  id,
  value,
  onRemove,
  className,
  ...props
}: TagProps & VariantProps<typeof tagVariants>) {
  const [canEdit, setCanEdit] = useState(false);
  return (
    <Tooltip open={canEdit} onOpenChange={setCanEdit}>
      <TooltipTrigger asChild>
        <Badge
          variant={variant}
          className={cn(tagVariants({ variant }), className)}
        >
          {value}
          <button
            type="button"
            className={cn(
              tagVariants({ variant }),
              " hover:scale-105 sm:hidden",
            )}
          >
            <IconX className=" size-3" />
          </button>
        </Badge>
      </TooltipTrigger>
      {onRemove && (
        <TooltipContent side="top" className="flex gap-2 rounded-full p-1">
          <button
            type="button"
            onClick={() => onRemove?.(id)}
            className="p-1 rounded-full bg-red-600/20 text-red-600 cursor-pointer hover:scale-125 z-1"
          >
            <IconX className="size-4" />
          </button>
        </TooltipContent>
      )}
    </Tooltip>
  );
}
function TagInput({
  variant = "secondary",
  isLoading,
  disabled,
  max,
  size,
  value,
  placeholder,
  delimiter = [",", "Enter"],
  allowDuplicates,
  className,
  tagClassName,
  ...props
}: TagInputProps & VariantProps<typeof tagVariants>) {
  const isControlled = "value" in props && props.value !== undefined;
  const [internalValue, setInternalValue] = useState<string[] | undefined>(
    !isControlled ? (props as TagInputUncontrolled).defaultValue : undefined,
  );
  const currentValue = isControlled
    ? (props as TagInputControlled).value
    : internalValue;
  const handleChange = (val: string[]) => {
    if (max && val.length >= max + 1) return;
    if (!isControlled) setInternalValue(val);
    props.onChange?.(val);
  };
  const handleDelete = (val: string) => {
    const newTags = currentValue?.filter((_, i) => i !== Number(val));
    handleChange(newTags || []);
  };

  const handleDelimiter = (e: KeyboardEvent<HTMLInputElement>) => {
    const key = e?.key;
    const inputValue = String(e?.currentTarget.value).trim();
    let newValue = [...(currentValue ? currentValue : [])];
    if (!allowDuplicates && currentValue?.includes(inputValue)) return;
    if (delimiter?.includes(inputValue)) {
       e.currentTarget.value = ""
       inputValue.slice(0,inputValue.length)
    };
    
    if (delimiter.includes(key) && inputValue) {
      newValue.push(inputValue);
      handleChange(newValue);
      e.currentTarget.value = "";
    } else if (key === "Backspace" && inputValue == "") {
      newValue.pop();
      handleChange(newValue);
    }
  };

  return (
    <div
      className={cn(
        "flex flex-wrap  min-w-0 rounded-lg border border-input bg-transparent p-2.5 text-base transition-colors outline-none  placeholder:text-muted-foreground focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-input/50 disabled:opacity-50 aria-invalid:border-destructive aria-invalid:ring-3 aria-invalid:ring-destructive/20 md:text-sm dark:bg-input/30 dark:disabled:bg-input/80 dark:aria-invalid:border-destructive/50 dark:aria-invalid:ring-destructive/40 gap-2 items-center select-none",
        className,
        disabled && "opacity-80 cursor-not-allowed ",
      )}
    >
      {isLoading
        ? Array.from({ length: max || 8 }).map((_, i) => (
            <Skeleton
            key={i}
              style={{
                width: `${(Math.random() + 1.1) * (i + 2)}rem`,
              }}
              className={cn(tagVariants({ size }), " bg-muted")}
            />
          ))
        : currentValue?.map((v, i) => {
            return (
              <Tag
                id={`${i}`}
                key={`${v}-${i}`}
                value={v}
                variant={variant}
                className={tagClassName}
                onRemove={!disabled ? handleDelete : undefined}
              />
            );
          })}
      {!isLoading && (
        <input
          disabled={disabled}
          onKeyDown={handleDelimiter}
          placeholder={placeholder}
          className={cn(
            "flex-1 outline-none focus-visible:ring-none bg-transparent text-base ",
            disabled && "cursor-not-allowed",
          )}
        />
      )}
    </div>
  );
}

// Controlled
interface TagInputControlled {
  value: string[];
  defaultValue?: never;
  onChange: (tags: string[]) => void;
}

// Uncontrolled
interface TagInputUncontrolled {
  value?: never;
  defaultValue?: string[];
  onChange?: (tags: string[]) => void;
}

export type TagProps = {
  id: string;
  value: string;
  disabled?: boolean;
  className?: string;
  onRemove?: (id: string) => void;
};
export type TagInputProps = {
  // Behaviour
  max?: number; // max number of tags
  allowDuplicates?: boolean; // default false
  delimiter?: string[]; // default "," and Enter key
  placeholder?: string;

  // State
  disabled?: boolean;
  isLoading?: boolean;

  // Style
  className?: string;
  tagClassName?: string;
} & (TagInputControlled | TagInputUncontrolled);

TagInput.displayName = "TagInput";

export { TagInput };

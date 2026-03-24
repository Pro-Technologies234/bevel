"use client";
import { useState } from "react";
import { cn } from "@/lib/utils";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Icon } from "@tabler/icons-react";

/**
 * Checks if the options array contains groups or flat options.
 * Using a simple check on the first element.
 */
function isGroupedArray(
  options: SelectOption[] | SelectOptionGroup[],
): options is SelectOptionGroup[] {
  return options.length > 0 && "group" in options[0];
}

function OptionItem({ opt }: { opt: SelectOption }) {
  return (
    <SelectItem
      value={opt.value}
      disabled={opt.disabled}
      className={cn(
        "capitalize",
        opt.disabled && "opacity-40 cursor-not-allowed ",
        opt.className,
      )}
    >
      <div className="flex items-center gap-2 w-full">
        {opt.icon && <opt.icon className="text-muted-foreground " />}
        <div className="flex flex-col -space-y-0.5 items-start font-sans">
          <span>{opt.label}</span>
        </div>
      </div>
    </SelectItem>
  );
}

function SelectField({
  options,
  placeholder = "Select an option",
  isLoading,
  className,
  ...props
}: SelectFieldProps) {
  const isControlled = "value" in props && props.value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    !isControlled ? (props as SelectFieldUncontrolled).defaultValue : undefined,
  );

  const currentValue = isControlled
    ? (props as SelectFieldControlled).value
    : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    props.onChange?.(val);
  };

  if (isLoading) {
    return <Skeleton className={cn("h-10 w-full rounded-md", className)} />;
  }

  const grouped = isGroupedArray(options);

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent align="center" side="bottom" className="border-muted">
        {!grouped ? (
          /* Render Flat Options */
          <SelectGroup>
            {(options as SelectOption[]).map((opt) => (
              <OptionItem key={opt.value} opt={opt} />
            ))}
          </SelectGroup>
        ) : (
          /* Render Grouped Options */
          (options as SelectOptionGroup[]).map((g) => (
            <SelectGroup key={g.group}>
              <SelectLabel className={cn("flex items-center gap-1 py-0.5 ml-4 my-2 text-xs bg-muted rounded-full w-fit font-semibold text-muted-foreground",g.className)}>
                {g.icon && <g.icon className=" size-4" />}
                {g.group}
              </SelectLabel>
              {g.options.map((opt) => (
                <OptionItem key={opt.value} opt={{...opt,className: cn(opt.className,"ml-4")}} />
              ))}
            </SelectGroup>
          ))
        )}
      </SelectContent>
    </Select>
  );
}

export interface SelectOption {
  value: string;
  label: string;
  icon?: Icon;
  disabled?: boolean;
  className?: string;
}

export interface SelectOptionGroup {
  icon?: Icon;
  className?: string;
  group: string;
  options: SelectOption[];
}

interface SelectFieldControlled {
  value: string;
  defaultValue?: never;
  onChange: (value: string) => void;
}

interface SelectFieldUncontrolled {
  value?: never;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export type SelectFieldProps = {
  options: SelectOption[] | SelectOptionGroup[];
  placeholder?: string;
  isLoading?: boolean;
  className?: string;
} & (SelectFieldControlled | SelectFieldUncontrolled);

SelectField.displayName = "SelectField";

export { SelectField };

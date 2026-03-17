"use client";

import * as React from "react";
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
import { Input } from "@/components/ui/input";

// =============================================================================
// TYPES — shared, types
// =============================================================================

export interface SelectOption {
  value: string;
  label: string;
  icon?: React.ReactNode;
  description?: string;
  disabled?: boolean;
  className?: string;
}

export interface SelectOptionGroup {
  group: string;
  options: SelectOption[];
}

// =============================================================================
// TYPES — self-contained
// =============================================================================

// Controlled
interface SelectFieldControlled {
  value: string;
  defaultValue?: never;
  onChange: (value: string) => void;
}

// Uncontrolled
interface SelectFieldUncontrolled {
  value?: never;
  defaultValue?: string;
  onChange?: (value: string) => void;
}

export type SelectFieldProps = {
  options: SelectOption[] | SelectOptionGroup[];
  placeholder?: string;
  searchable?: boolean;
  searchPlaceholder?: string;
  isLoading?: boolean;
  className?: string;
} & (SelectFieldControlled | SelectFieldUncontrolled);

// =============================================================================
// UTILS
// =============================================================================

function isGrouped(
  options: SelectOption[] | SelectOptionGroup[],
): options is SelectOptionGroup[] {
  return options.length > 0 && "group" in options[0];
}

// =============================================================================
// OPTION ITEM
// =============================================================================

function OptionItem({ opt }: { opt: SelectOption }) {
  return (
    <SelectItem
      value={opt.value}
      disabled={opt.disabled}
      className={cn(
        "capitalize",
        opt.disabled && "opacity-40 cursor-not-allowed font-sans",
        opt.className,
      )}
    >
      <div className="flex items-center gap-2 w-full">
        {opt.icon && (
          <span className="shrink-0 text-muted-foreground">{opt.icon}</span>
        )}
        <div className="flex flex-col -space-y-0.5 items-start">
          <span>{opt.label}</span>
          {opt.description && (
            <span className="text-xs text-muted-foreground font-normal">
              {opt.description}
            </span>
          )}
        </div>
      </div>
    </SelectItem>
  );
}

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function SelectField({
  options,
  placeholder = "Select an option",
  searchable = false,
  searchPlaceholder = "Search...",
  isLoading,
  className,
  ...props
}: SelectFieldProps) {
  const isControlled = "value" in props && props.value !== undefined;
  const [internalValue, setInternalValue] = useState<string | undefined>(
    !isControlled ? (props as SelectFieldUncontrolled).defaultValue : undefined,
  );
  const [query, setQuery] = useState("");

  const currentValue = isControlled
    ? (props as SelectFieldControlled).value
    : internalValue;

  const handleChange = (val: string) => {
    if (!isControlled) setInternalValue(val);
    props.onChange?.(val);
  };

  // ── Filter logic ────────────────────────────────────────────────────────
  const filterOption = (opt: SelectOption) =>
    opt.label.toLowerCase().includes(query.toLowerCase());

  const filteredFlat = !isGrouped(options)
    ? (options as SelectOption[]).filter(filterOption)
    : [];

  const filteredGrouped = isGrouped(options)
    ? (options as SelectOptionGroup[])
        .map((g) => ({ ...g, options: g.options.filter(filterOption) }))
        .filter((g) => g.options.length > 0)
    : [];

  // ── Loading state ───────────────────────────────────────────────────────
  if (isLoading) {
    return <Skeleton className={cn("h-10 w-full rounded-md", className)} />;
  }

  return (
    <Select value={currentValue} onValueChange={handleChange}>
      <SelectTrigger className={cn("w-full", className)}>
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>

      <SelectContent align="center" side="bottom" className=" border-muted">
        {/* Search input */}
        {searchable && (
          <Input
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={searchPlaceholder}
            className="mb-1"
            // Prevent Select from closing or navigating on keydown
            onKeyDown={(e) => e.stopPropagation()}
          />
        )}

        {/* Flat options */}
        {!isGrouped(options) && (
          <SelectGroup>
            {filteredFlat.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground font-sans">
                No options found.
              </div>
            ) : (
              filteredFlat.map((opt) => (
                <OptionItem key={opt.value} opt={opt} />
              ))
            )}
          </SelectGroup>
        )}

        {/* Grouped options */}
        {isGrouped(options) && (
          <>
            {filteredGrouped.length === 0 ? (
              <div className="py-6 text-center text-sm text-muted-foreground">
                No options found.
              </div>
            ) : (
              filteredGrouped.map((g) => (
                <SelectGroup key={g.group}>
                  <SelectLabel>{g.group}</SelectLabel>
                  {g.options.map((opt) => (
                    <OptionItem key={opt.value} opt={opt} />
                  ))}
                </SelectGroup>
              ))
            )}
          </>
        )}
      </SelectContent>
    </Select>
  );
}

SelectField.displayName = "SelectField";

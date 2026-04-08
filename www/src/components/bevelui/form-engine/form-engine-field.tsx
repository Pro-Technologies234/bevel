"use client";

import { useController, type Path } from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { CardSelect } from "@/components/bevelui/controls/card-select";
import { ChipSelect } from "@/components/bevelui/controls/chip-select";
import { RatingField } from "@/components/bevelui/controls/rating-field";
import { SelectField } from "@/components/bevelui/controls/select-field";
import { TagInput } from "@/components/bevelui/controls/tag-input";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "./form-engine-context";
import type { FormEngineFieldDef } from "./form-engine-types";
import { DatePicker } from "../controls/date-picker";

// ─── useFormEngineField ───────────────────────────────────────────────────────

/**
 * useFormEngineField — read and write a single field from within the engine.
 * Integrates with react-hook-form for error messages.
 */
export function useFormEngineField(key: string) {
  const ctx = useFormEngineContext();

  const { field, fieldState } = useController({
    name: key as Path<Record<string, unknown>>,
    control: ctx.form.control,
  });

  return {
    value: field.value,
    onChange: (value: unknown) => {
      field.onChange(value);
      ctx.setFieldValue(key, value);
    },
    onBlur: field.onBlur,
    visible: ctx.fieldState[key]?.visible ?? true,
    disabled: ctx.fieldState[key]?.disabled ?? false,
    error: fieldState.error?.message,
  };
}

// ─── FormEngineField ──────────────────────────────────────────────────────────

interface FormEngineFieldProps {
  field: FormEngineFieldDef;
}

export function FormEngineField({ field }: FormEngineFieldProps) {
  const { value, onChange, onBlur, visible, disabled, error } =
    useFormEngineField(field.key);

  if (!visible) return null;

  const renderControl = () => {
    switch (field.variant) {
      case "text":
      case "email":
      case "number":
      case "password": {
        const Icon = field.props?.icon;
        return (
          <InputGroup>
            <InputGroupInput
              id={field.key}
              type={field.variant}
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={field.placeholder}
              disabled={disabled}
              aria-invalid={!!error}
            />
            {Icon && (
              <InputGroupAddon align="inline-end">
                <Icon className="size-4 text-muted-foreground" />
              </InputGroupAddon>
            )}
          </InputGroup>
        );
      }

      case "textarea": {
        const Icon = field.props?.icon;
        return (
          <InputGroup>
            <InputGroupTextarea
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={field.placeholder}
              disabled={disabled}
              aria-invalid={!!error}
            />
            {Icon && (
              <InputGroupAddon align="inline-end">
                <Icon className="size-4 text-muted-foreground" />
              </InputGroupAddon>
            )}
          </InputGroup>
        );
      }

      case "checkbox":
        return (
          <Checkbox
            id={field.key}
            checked={(value as boolean) ?? false}
            onCheckedChange={(checked) => onChange(checked)}
            disabled={disabled}
            aria-invalid={!!error}
          />
        );

      case "select":
        return (
          <SelectField
            {...(field.props ?? {})}
            options={field.props?.options ?? []}
            defaultValue={undefined}
            value={value as string}
            onChange={onChange}
            placeholder={field.placeholder}
          />
        );

      case "rating":
        return (
          <RatingField
            {...((field.props ?? {}) as any)}
            value={(value as number) ?? 0}
            onChange={(val) => onChange(val)}
            disabled={disabled}
          />
        );

      case "chip-select":
        return (
          <ChipSelect
            {...((field.props ?? {}) as any)}
            options={field.props?.options ?? []}
            value={value as string}
            onChange={(val) => onChange(val)}
            disabled={disabled}
          />
        );

      case "card-select":
        return (
          <CardSelect
            {...((field.props ?? {}) as any)}
            options={field.props?.options ?? []}
            value={value as string}
            onChange={(val) => onChange(val)}
            disabled={disabled}
          />
        );

      case "tag-input":
        return (
          <TagInput
            {...(field.props ?? {})}
            value={(value as string[]) ?? []}
            defaultValue={undefined}
            onChange={(val) => onChange(val)}
            disabled={disabled}
            placeholder={field.placeholder}
          />
        );

      case "date":
        return (
          <DatePicker
            {...((field.props ?? {}) as any)}
            // options={field.props ?? []}
            value={value as string}
            onChange={(val) => onChange(val)}
            disabled={disabled}
            withTime
          />
        );
      case "phone":
        return (
          <InputGroup>
            <InputGroupInput
              type={"tel"}
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              onBlur={onBlur}
              placeholder={field.placeholder}
              disabled={disabled}
              aria-invalid={!!error}
            />
          </InputGroup>
        );

      case "file":
        return (
          <InputGroup>
            <InputGroupInput
              type="file"
              onChange={(e) => onChange(e.target.files)}
              disabled={disabled}
              aria-invalid={!!error}
            />
          </InputGroup>
        );

      default:
        return null;
    }
  };

  return (
    <Field
      orientation={field.variant == "checkbox" ? "horizontal" : "vertical"}
      className={cn(
        field.variant === "checkbox" && "flex-row-reverse",
        field.className,
      )}
    >
      {field.label && (
        <FieldLabel htmlFor={field.key}>
          {field.label}
          {field.required && (
            <span className="text-destructive ms-1" aria-hidden>
              *
            </span>
          )}
        </FieldLabel>
      )}
      {renderControl()}
      {/* Error message from react-hook-form / zod */}
      {error && <FieldError role="alert">{error}</FieldError>}
    </Field>
  );
}

FormEngineField.displayName = "FormEngineField";

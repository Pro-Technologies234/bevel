"use client";

import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupTextarea,
} from "@/components/ui/input-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Checkbox } from "@/components/ui/checkbox";
import { CardSelect } from "@/registry/controls/card-select";
import { ChipSelect } from "@/registry/controls/chip-select";
import { RatingField } from "@/registry/controls/rating-field";
import { SelectField } from "@/registry/controls/select-field";
import { TagInput } from "@/registry/controls/tag-input";
import { useField } from "../hooks/use-field";
import { FormField } from "../types";

type FieldRendererProps<T> = {
  field: FormField<T>;
};

function FieldRenderer<T extends Record<string, unknown>>({
  field,
}: FieldRendererProps<T>) {
  const { value, visible, disabled, onChange, options, error } = useField<T>(
    field.key,
  );

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
              id={String(field.key)}
              type={field.variant}
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
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
              placeholder={field.placeholder}
              disabled={disabled}
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
            checked={(value as boolean) ?? false}
            onCheckedChange={(checked) => onChange(checked)}
            disabled={disabled}
          />
        );

      case "select":
        return (
          <SelectField
            {...(field.props ?? {})}
            options={options ?? field.props?.options ?? []}
            value={value as string}
            onChange={onChange}
            placeholder={field.placeholder}
            defaultValue={undefined}
            // disabled={disabled}
          />
        );

      case "rating":
        return (
          <RatingField
            {...((field.props ?? {}) as any)}
            defaultValue={(value as number) ?? 0}
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
            onChange={(val) => onChange(val)}
            disabled={disabled}
            placeholder={field.placeholder}
            defaultValue={undefined}
          />
        );

      case "date":
        return (
          <InputGroup>
            <InputGroupInput
              type="date"
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              disabled={disabled}
            />
          </InputGroup>
        );

      case "phone":
        return (
          <InputGroup>
            <InputGroupInput
              type="tel"
              value={(value as string) ?? ""}
              onChange={(e) => onChange(e.target.value)}
              placeholder={field.placeholder}
              disabled={disabled}
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
            />
          </InputGroup>
        );

      default:
        return null;
    }
  };

  return (
    <Field className={field.className}>
      {field.label && (
        <FieldLabel htmlFor={String(field.key)}>
          {field.label}
          {field.required && <span className="text-destructive ml-1">*</span>}
        </FieldLabel>
      )}
      {renderControl()}
      {error && <FieldError>{error}</FieldError>}
    </Field>
  );
}

FieldRenderer.displayName = "FieldRenderer";

export { FieldRenderer };

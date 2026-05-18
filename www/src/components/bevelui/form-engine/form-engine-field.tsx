import {
  useController,
  type Path,
  type RegisterOptions,
} from "react-hook-form";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "@/components/ui/input-group";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { cn } from "@/lib/utils";
import { useFormEngineContext } from "./form-engine-context";
import type { FieldRenderProps, FormEngineFieldDef } from "./form-engine-types";

/**
 * useFormEngineField — read and write a single field from within the engine.
 * Integrates with react-hook-form for validation and error messages.
 *
 * Pass RHF rules for validation beyond what the field config provides.
 */
export function useFormEngineField(key: string, rules?: RegisterOptions) {
  const ctx = useFormEngineContext();

  const { field, fieldState } = useController({
    name: key as Path<Record<string, unknown>>,
    control: ctx.form.control,
    rules,
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

interface FormEngineFieldProps {
  field: FormEngineFieldDef;
}

export function FormEngineField({ field }: FormEngineFieldProps) {
  const rules: RegisterOptions = {
    ...(field.required
      ? {
          required:
            typeof field.required === "string"
              ? field.required
              : `${field.label ?? field.key} is required`,
        }
      : {}),
    ...(field.rules ?? {}),
  } as RegisterOptions;

  const { value, onChange, onBlur, visible, disabled, error } =
    useFormEngineField(field.key, rules);

  if (!visible) return null;

  if (field.variant === "custom") {
    const renderProps: FieldRenderProps = {
      value,
      onChange,
      onBlur,
      error,
      disabled,
    };

    return (
      <Field orientation="vertical" className={field.className}>
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
        {field.render(renderProps)}
        {error && <FieldError role="alert">{error}</FieldError>}
      </Field>
    );
  }

  const renderControl = () => {
    switch (field.variant) {
      case "text":
      case "email":
      case "number":
      case "tel":
      case "password": {
        const Icon = field.props?.icon;
        return (
          <InputGroup {...field.props}>
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
      default:
        return null;
    }
  };

  return (
    <Field className={cn(field.className)}>
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
      {error && <FieldError role="alert">{error}</FieldError>}
    </Field>
  );
}

FormEngineField.displayName = "FormEngineField";

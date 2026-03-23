import { useController, Path } from "react-hook-form"
import { useFormEngineContext } from "../context"

type UseFieldReturn = {
  value: unknown
  onChange: (value: unknown) => void
  visible: boolean
  disabled: boolean
  options?: { label: string; value: string }[]
  error?: string
}

export function useField<T extends Record<string, unknown>>(
  key: keyof T
): UseFieldReturn {
  const ctx = useFormEngineContext<T>()
  const { field, fieldState, } = useController({
    name: key as Path<T>,
    control: ctx.form.control,
  })

  return {
    value: field.value,
    onChange: field.onChange,
    visible: ctx.fieldState[key]?.visible ?? true,
    disabled: ctx.fieldState[key]?.disabled ?? false,
    options: ctx.fieldState[key]?.options,
    error: fieldState.error?.message,
  }
}
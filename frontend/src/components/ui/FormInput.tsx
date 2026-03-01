import type { FieldError } from "react-hook-form"
import { useFormContext, useWatch } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"

interface FormInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "name"> {
  name: string
  error?: FieldError
  label?: string
  wrapperClassName?: string
}

export function FormInput({ name, error, wrapperClassName = "", className = "", required, ...props }: FormInputProps) {
  const { control } = useFormContext()

  const value = useWatch({
    control,
    name,
  })

  const isEmpty =
    value === undefined || value === null || value === "" || (typeof value === "number" && Number.isNaN(value))

  const showRequiredStyle = required && isEmpty

  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      <input
        {...props}
        name={name}
        required={required}
        className={`w-full rounded bg-transparent px-1 ${
          showRequiredStyle ? "border border-dashed border-(--border-muted)!" : ""
        } ${className} `}
      />

      {error && (
        <p className="flex justify-center text-center text-xs text-(--text-danger)">
          <FormFieldError error={error} />
        </p>
      )}
    </div>
  )
}

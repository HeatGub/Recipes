import type { FieldError } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError
  label?: string
}

export function FormInput({ label, error, ...props }: FormInputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}</label>
      <input className="mb-1 w-full rounded border bg-(--bg-secondary) px-2 py-1" {...props} />
      {error && (
        <p className="text-xs text-(--text-danger)">
          <FormFieldError error={error} />
        </p>
      )}
    </div>
  )
}

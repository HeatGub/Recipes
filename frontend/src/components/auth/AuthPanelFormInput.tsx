import type { FieldError } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"

interface FormInputProps {
  label: string
  type?: string
  error?: FieldError
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}

export function AuthPanelFormInput({ label, type = "text", error, inputProps }: FormInputProps) {
  return (
    <div className="flex flex-col">
      <label className="mb-1">{label}</label>
      <input
        type={type}
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1 mb-1"
        {...inputProps}
      />
      {error && (
        <p className="text-xs text-(--text-danger)">
          <FormFieldError error={error} />
        </p>
      )}
    </div>
  )
}
import type { FieldError } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"
import clsx from "clsx"

interface FormInputProps {
  label: string
  type?: string
  error?: FieldError
  initialMessage?: string
  border?: boolean
  inputProps: React.InputHTMLAttributes<HTMLInputElement>
}

export function SettingsFormInput({ label, type = "text", error, initialMessage, border=true, inputProps }: FormInputProps) {
  return (
    <div className={clsx("flex flex-col py-3 max-w-xl", border && "border-(--border-muted)! border-b")}>

      <label className="mb-1">{label}</label>

      <input type={type} className="mb-1 rounded border bg-(--bg-secondary) px-2 py-1" {...inputProps} />

      {error && (
        <p className="text-xs text-(--text-danger)">
          <FormFieldError error={error} />
        </p>
      )}

      {!error && initialMessage && <p className="text-xs text-(--text-secondary)">{initialMessage}</p>}
    </div>
  )
}

import type { FieldError } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: FieldError
  label?: string
  wrapperClassName?: string 
}

export function FormInput({ label, error, wrapperClassName = "", className = "", ...props }: FormInputProps) {
  return (
    <div className={`flex flex-col ${wrapperClassName}`}>
      {label && <label className="mb-1">{label}</label>}
      <input
        className={`w-full rounded border-dashed border border-(--border-muted)! bg-transparent px-1 ${className}`}
        // ${error ? "border-red-500!" : "border-(--border-muted)!"}
        {...props}
      />
      {error && (
        <p className="text-xs text-(--text-danger)">
          <FormFieldError error={error} />
        </p>
      )}
    </div>
  )
}
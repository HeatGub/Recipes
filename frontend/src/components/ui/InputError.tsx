import { FormFieldError } from "@/forms/core/FormErrors"
import type { FieldError } from "react-hook-form"

interface InputErrorProps {
  error?: FieldError
  className?: string
}

export function InputError({ error, className }: InputErrorProps) {
  if (!error) return null
  return (
    <p className={`flex justify-center text-center text-xs text-(--text-danger) ${className? className : ""}`}>
      <FormFieldError error={error} />
    </p>
  )
}
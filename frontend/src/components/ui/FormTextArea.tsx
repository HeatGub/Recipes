import type { FieldError } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"
import { useFormContext, useWatch } from "react-hook-form"

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string
  error?: FieldError
}

export function FormTextArea({ error, className, required, name, ...props }: TextAreaProps) {
  const { control } = useFormContext()

  const value = useWatch({
    control,
    name,
  })

  const isEmpty = value === undefined || value === null || value === ""
  const showRequiredStyle = required && isEmpty

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <textarea
        rows={1}
        {...props}
        name={name}
        required={required}
         onInput={(e) => {
          const el = e.currentTarget
          el.style.height = "auto"
          el.style.height = el.scrollHeight + "px"
        }}
        className={`w-full resize-none overflow-hidden rounded bg-transparent outline-none ${
          showRequiredStyle ? "border border-dashed border-(--border-muted)!" : ""
        } ${className} `}
      />

      {error && (
        <p className="mt-1 flex justify-center text-center text-xs text-(--text-danger)">
          <FormFieldError error={error} />
        </p>
      )}
    </div>
  )
}
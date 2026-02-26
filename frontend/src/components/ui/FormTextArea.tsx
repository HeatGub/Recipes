import type { FieldError } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"

interface TextAreaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: FieldError
}

export function FormTextArea({ error, className, ...props }: TextAreaProps) {
  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <textarea
        rows={1}
        {...props}
        onInput={(e) => {
          const el = e.currentTarget
          el.style.height = "auto"
          el.style.height = el.scrollHeight + "px"
        }}
        className={`w-full resize-none overflow-hidden rounded bg-transparent ${className ?? ""}`}
      />

      {error && (
        <p className="mt-1 flex justify-center text-center text-xs text-(--text-danger)">
          <FormFieldError error={error} />
        </p>
      )}
    </div>
  )
}
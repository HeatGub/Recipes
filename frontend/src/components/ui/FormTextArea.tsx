import type { FieldError } from "react-hook-form"
import { useFormContext, useWatch } from "react-hook-form"
import { InputError } from "@/components/ui/InputError"
import { useLayoutEffect, useRef } from "react"

interface TextAreaProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, "name"> {
  name: string
  error?: FieldError
  attachError?: boolean
}

export function FormTextArea({ error, className, required, name, attachError = true, ...props }: TextAreaProps) {
  const { control, register } = useFormContext()
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)

  const value = useWatch({
    control,
    name,
  })

  const adjustHeight = (el: HTMLTextAreaElement) => {
    el.style.height = "auto"
    el.style.height = `${el.scrollHeight}px`
  }

  useLayoutEffect(() => {
    if (textareaRef.current) {
      adjustHeight(textareaRef.current)
    }
  }, [value]) // reacts to changes in useWatch


  const { ref: registerRef, ...registerProps } = register(name)

  const isEmpty = value === undefined || value === null || value === ""
  const showRequiredStyle = (required && isEmpty) || error

  return (
    <div className="flex min-w-0 flex-1 flex-col">
      <textarea
        rows={1}
        {...props}
        {...registerProps}
        ref={(el) => {
          registerRef(el)
          textareaRef.current = el
          if (el) {adjustHeight(el)} // resize on mount
        }}
        required={required}
        onInput={(e) => adjustHeight(e.currentTarget)}
        className={`w-full resize-none overflow-hidden rounded bg-transparent outline-none ${
          showRequiredStyle ? "border border-dashed border-(--border-muted)!" : ""
        } ${className} `}
      />

      {attachError && error && (
        <InputError error={error} className="mt-1"/>
      )}
    </div>
  )
}
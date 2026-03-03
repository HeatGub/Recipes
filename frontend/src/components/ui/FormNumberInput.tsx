import type { FieldError } from "react-hook-form"
import { InputError } from "@/components/ui/InputError"

interface FormNumberInputProps {
  value: number
  onChange: (val: number) => void
  min?: number
  max?: number
  step?: number
  error?: FieldError
  label?: string
  wrapperClassName?: string
  className?: string
  placeholder?: string
  disabled?: boolean
  required?: boolean
}

export function FormNumberInput({
  value,
  onChange,
  min,
  max,
  step = 1,
  error,
  label,
  wrapperClassName = "",
  className = "",
  required,
  ...props
}: FormNumberInputProps) {
  const round = (num: number) => Math.floor(num)

  const increment = () => {
    let next = round(value + step)
    if (max !== undefined && next > max) next = max
    onChange(next)
  }

  const decrement = () => {
    let next = round(value - step)
    if (min !== undefined && next < min) next = min
    onChange(next)
  }

  const isEmpty = value === undefined || value === null || Number.isNaN(value) || (min !== undefined && value < min)

  const showRequiredStyle = required && isEmpty

  return (
    <div className={`flex flex-col ${wrapperClassName} relative`}>
      {label && <label className="mb-1">{label}</label>}

      <div className="relative flex items-center">
        <input
          type="number"
          step="any"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`rounded bg-transparent px-6 outline-none ${
            showRequiredStyle ? "border border-dashed border-(--border-muted)!" : ""
          } ${className} `}
          {...props}
        />

        {/* Decrement button */}
        <button
          type="button"
          onClick={decrement}
          className="absolute left-0 flex h-full max-w-6 items-center justify-center px-2 text-(--text-muted) hover:text-(--text-secondary)"
        >
          −
        </button>

        {/* Increment button */}
        <button
          type="button"
          onClick={increment}
          className="absolute right-0 flex h-full max-w-6 items-center justify-center px-2 text-(--text-muted) hover:text-(--text-secondary)"
        >
          +
        </button>
      </div>

      {error && <InputError className="mt-1" error={error} />}
    </div>
  )
}

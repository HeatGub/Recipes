import type { FieldError } from "react-hook-form"
import { FormFieldError } from "@/forms/core/FormErrors"

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

  return (
    <div className={`flex flex-col ${wrapperClassName} relative`}>
      {label && <label className="mb-1">{label}</label>}

      <div className="relative flex items-center w-full">
        <input
          type="number"
          step="any" // keep this"any" to turn amazing browser errors off. Same with min/max
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className={`w-full rounded border-dashed border border-(--border-muted)! bg-transparent px-6 ${className}`}
          {...props}
        />

        {/* Decrement button */}
        <button
          type="button"
          onClick={decrement}
          className="absolute left-1 h-full w-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
        >
          −
        </button>

        {/* Increment button */}
        <button
          type="button"
          onClick={increment}
          className="absolute right-1 h-full w-6 flex items-center justify-center text-gray-500 hover:text-gray-800"
        >
          +
        </button>
      </div>

      {error && (
        <p className="text-xs text-(--text-danger) flex justify-center text-center mt-1">
          <FormFieldError error={error} />
        </p>
      )}
    </div>
  )
}
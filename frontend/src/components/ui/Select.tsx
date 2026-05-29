import { useEffect, useRef, useState } from "react"
import { ChevronDown } from "lucide-react"

type Option = {
  label: string
  value: string
}

interface SelectProps {
  options: Option[]
  value?: string
  placeholder?: string
  onChange: (value: string) => void
  className?: string
  disabled?: boolean
}

export function Select({
  options,
  value,
  placeholder = "Select option",
  onChange,
  className = "",
  disabled = false,
}: SelectProps) {
  const [open, setOpen] = useState(false)

  const containerRef = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!containerRef.current?.contains(e.target as Node)) {
        setOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  return (
    <div
      ref={containerRef}
      className={`relative ${className}`}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => setOpen((prev) => !prev)}
        className="
          flex
          items-center
          justify-between
          rounded-lg
          border
          border-(--border-muted)!
          bg-(--bg-secondary)
          px-3
          py-0.5
          text-(--text-primary)
          transition-all
          duration-150
          hover:border-(--accent-primary)
          disabled:cursor-not-allowed
          disabled:border-(--border-muted)
          disabled:text-(--text-muted)
        "
      >
        <span
          className={selected
            ? "text-(--text-primary)"
            : "text-(--text-muted)"}
        >
          {selected?.label ?? placeholder}
        </span>

        <ChevronDown
          size={18}
          className={`transition-transform duration-200 text-(--text-secondary) ml-1 ${
            open ? "rotate-180" : ""
          }`}
        />
      </button>

      {open && (
        <div
          className="
            absolute
            z-50
            mt-1
            w-full
            overflow-auto
            rounded-xl
            border
            border-(--border-default)
            bg-(--bg-secondary)
            p-1
          "
        >
          {options.map((option) => {
            const isSelected = option.value === value

            return (
              <button
                key={option.value}
                type="button"
                onClick={() => {
                  onChange(option.value)
                  setOpen(false)
                }}
                className={`
                  w-full
                  rounded-lg
                  px-2
                  py-2
                  text-left
                  transition-colors
                  duration-150
                  hover:bg-(--bg-tertiary)
                  ${isSelected && "text-(--accent-primary)"}
                `}
              >
                {option.label}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
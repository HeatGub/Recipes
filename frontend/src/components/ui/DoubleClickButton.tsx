import { useState, useEffect } from "react"
import clsx from "clsx"
import { Trash2 } from "lucide-react"

const VARIANT_STYLES = {
  default: "text-(--text-primary) rounded",
} as const

export type ButtonVariant = keyof typeof VARIANT_STYLES

type DoubleClickButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
  confirmVariant?: ButtonVariant
  firstClickContent?: React.ReactNode
  secondClickContent?: React.ReactNode
  confirmDelay?: number
}

export function DoubleClickButton({
  variant = "default",
  confirmVariant = "default",
  firstClickContent = (
    <Trash2 className="h-5 w-5 rounded text-(--text-muted) hover:text-(--text-warning) hover:drop-shadow-[0_0_4px_var(--text-warning)]" />
  ),
  secondClickContent = (
    <Trash2 className="h-5 w-5 rounded text-(--text-danger) drop-shadow-[0_0_4px_var(--text-danger)]" />
  ),
  confirmDelay = 1500,
  children,
  onClick,
  ...props
}: DoubleClickButtonProps) {
  const [confirming, setConfirming] = useState(false)

  useEffect(() => {
    if (!confirming) return
    const timer = window.setTimeout(() => setConfirming(false), confirmDelay)
    return () => window.clearTimeout(timer)
  }, [confirming, confirmDelay])

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (confirming) {
      onClick?.(e)
      setConfirming(false)
    } else {
      setConfirming(true)
    }
  }

  return (
    <button
      type="button"
      {...props}
      onClick={handleClick}
      className={clsx(
        "flex cursor-pointer items-center justify-center p-0 text-sm font-medium select-none disabled:cursor-default",
        "disabled:hover:shadow-none",
        "active:scale-95",
        "hover:scale-110",
        "transition-transform duration-150",
        VARIANT_STYLES[confirming ? confirmVariant : variant]
      )}
    >
      {confirming ? secondClickContent : firstClickContent || children}
    </button>
  )
}

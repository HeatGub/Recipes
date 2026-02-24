import { useState, useEffect } from "react"
import clsx from "clsx"
import { Trash2 } from "lucide-react"

const VARIANT_STYLES = {
  primary: "bg-(--accent-primary) text-(--text-inverted)",
  secondary: "bg-(--bg-tertiary) text-(--text-primary)",
  tertiary: "bg-(--bg-secondary) text-(--text-primary)",
  ghost: "bg-(--bg-primary) text-(--text-primary)",
  warning: "bg-(--bg-warning) text-(--text-inverted)",
  danger: "bg-(--bg-danger) text-(--text-primary) hover:text-(--text-inverted) hover:shadow-[0_0_5px_var(--bg-danger)] disabled:hover:text-(--text-primary)",
  success: "bg-(--accent-secondary) text-(--text-inverted)",
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
  variant = "ghost",
  confirmVariant = "ghost",
  firstClickContent = <Trash2 className="h-4 w-4 text-(--text-warning) hover:h-5 hover:w-5" />,
  secondClickContent = <Trash2 className="h-5 w-5 text-(--text-danger) drop-shadow-[0_0_4px_var(--text-danger)]" />,
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
      {...props}
      onClick={handleClick}
      className={clsx(
        "cursor-pointer rounded p-0.5 text-sm font-medium select-none disabled:cursor-default",
        "hover:shadow-[0_0_5px_var(--shadow-color)] disabled:hover:shadow-none",
        VARIANT_STYLES[confirming ? confirmVariant : variant]
      )}
    >
      {confirming ? secondClickContent : firstClickContent || children}
    </button>
  )
}

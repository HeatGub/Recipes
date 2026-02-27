import clsx from "clsx"

const VARIANT_STYLES = {
  secondary: "bg-(--bg-tertiary) text-(--text-primary)",
  primary: "bg-(--accent-primary) text-(--text-inverted)",
  warning: "bg-(--bg-warning) text-(--text-inverted)",
  danger: "bg-(--bg-danger) text-(--text-primary)",
  success: "bg-(--accent-secondary) text-(--text-inverted)",
  gradientPrimary: "bg-(--accent-primary) hover:bg-[linear-gradient(20deg,var(--accent-primary)_0%,var(--accent-primary)_45%,var(--accent-secondary)_100%)] text-(--text-inverted)",
} as const

type ButtonVariant = keyof typeof VARIANT_STYLES

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function RichButton({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "cursor-pointer rounded px-3 py-1 text-base font-medium",
        "shadow-[0_0_4px_var(--shadow-color)]",
        "hover:shadow-[0_0_10px_var(--shadow-hover)]",
        "transition-transform duration-150",
        "active:scale-98",
        "hover:scale-104",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    />
  )
}

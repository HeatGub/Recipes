import clsx from "clsx"

const VARIANT_STYLES = {
  secondary: "bg-(--bg-tertiary) text-(--text-primary)",
  primary: "bg-(--accent-primary) text-(--text-inverted)",
  warning: "bg-(--bg-warning) text-(--text-inverted)",
  danger: "bg-(--bg-danger) text-(--text-primary)",
  success:  "bg-(--accent-secondary) text-(--text-inverted)",
} as const

type ButtonVariant = keyof typeof VARIANT_STYLES

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "text-base cursor-pointer rounded px-3 py-1 font-medium",
        "shadow-[0_0_4px_var(--shadow-color)]",
        "hover:text-[1.03rem]",
        "hover:shadow-[0_0_10px_var(--shadow-hover)]",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    />
  )
}

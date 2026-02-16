import clsx from "clsx"

const VARIANT_STYLES = {
  primary: "bg-(--accent-primary) text-(--text-inverted)",
  secondary: "bg-(--bg-tertiary) text-(--text-primary)",
  tertiary: "bg-(--bg-secondary) text-(--text-primary)",
  ghost: "bg-(--bg-primary) text-(--text-primary)",
  warning: "bg-(--bg-warning) text-(--text-inverted)",
  danger: "bg-(--bg-danger) text-(--text-primary) hover:text-(--text-inverted) hover:shadow-[0_0_5px_var(--bg-danger)] disabled:hover:text-(--text-primary)",
  success:  "bg-(--accent-secondary) text-(--text-inverted)",
} as const

export type ButtonVariant = keyof typeof VARIANT_STYLES

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant
}

export function Button({ variant = "primary", className, ...props }: ButtonProps) {
  return (
    <button
      className={clsx(
        "text-base rounded px-3 py-1 font-medium cursor-pointer disabled:cursor-default",
        "hover:shadow-[0_0_5px_var(--shadow-color)] disabled:hover:shadow-none",
        VARIANT_STYLES[variant],
        className
      )}
      {...props}
    />
  )
}

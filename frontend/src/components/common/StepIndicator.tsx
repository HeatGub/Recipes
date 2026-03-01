interface StepIndicatorProps {
  children: React.ReactNode
  className?: string
}

export function StepIndicator({ children, className = "" }: StepIndicatorProps) {
  return (
    <span
      className={`inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--accent-primary) font-semibold text-(--text-inverted) ${className}`}
    >
      {children}
    </span>
  )
}
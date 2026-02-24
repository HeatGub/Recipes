export function StepIndicator({ children }: { children: React.ReactNode }) {
  return (
    <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--accent-primary) font-semibold text-(--text-inverted)">
      {children}
    </span>
  )
}

import type { ReactNode } from "react"

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
}

export function SettingsSection({ title, description, children }: SettingsSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border-2 bg-(--bg-primary) shadow-sm">
      {/* Header */}
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold text-(--text-primary)">{title}</h2>
        {description && <p className="mt-1 text-sm text-(--text-secondary)">{description}</p>}
      </div>

      {/* Content */}
      <div className="px-6 py-4">{children}</div>
    </section>
  )
}

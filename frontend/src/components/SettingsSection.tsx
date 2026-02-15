import type { ReactNode } from "react"
import { Button } from "@/components/ui/Button"

interface SettingsSectionProps {
  title: string
  description?: string
  children: ReactNode
  // footer?: ReactNode
  buttonFormId?: string
}

export function SettingsSection({ title, description, children, buttonFormId }: SettingsSectionProps) {
  return (
    <section className="overflow-hidden rounded-xl border-2 bg-(--bg-primary) shadow-sm">

      {/* Header */}
      <div className="border-b px-6 py-5">
        <h2 className="text-lg font-semibold text-(--text-primary)">{title}</h2>
        {description && <p className="mt-1 text-sm text-(--text-secondary)">{description}</p>}
      </div>

      {/* Content */}
      <div className="px-6 py-4">{children}</div>
      
      {/* Footer */}
      <div className="flex justify-end gap-4 border-t bg-(--bg-primary) px-6 py-4">
        <Button variant="ghost">Cancel</Button>
        <Button form={buttonFormId} variant="primary" className="hover:bg-(--accent-secondary)">Save Changes</Button>
      </div>
    </section>
  )
}

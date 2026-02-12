import { useTranslation } from "react-i18next"
import { useState } from "react"
import clsx from "clsx"

type SectionId = "dashboard" | "user_settings"

export function Sidebar() {
  const { t } = useTranslation()
  const [active, setActive] = useState<SectionId>("dashboard")

  const SECTIONS: { id: SectionId; label: string }[] = [
    { id: "dashboard", label: t("sidebar.dashboard") },
    { id: "user_settings", label: t("sidebar.settings") },
  ]

  return (
    <>
      {SECTIONS.map((section) => {
        const isActive = active === section.id

        return (
          <button
            key={section.id}
            onClick={() => setActive(section.id)}
            className={clsx(
              "w-full px-4 py-3 text-left transition font-medium",
              isActive ? "bg-(--accent-primary) text-(--text-inverted)" : "hover:bg-(--bg-secondary)"
            )}
          >
            {section.label}
          </button>
        )
      })}
    </>
  )
}

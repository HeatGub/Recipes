import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { ROUTES } from "@/router"

export function Sidebar() {
  const { t } = useTranslation()

  const SECTIONS: { path: string; label: string }[] = [
    { path: ROUTES.home, label: t("sidebar.home") },
    { path: ROUTES.accountSettings, label: t("sidebar.account_settings") },
  ]

  return (
    <>
      {SECTIONS.map((section) => (
        <NavLink
          key={section.path}
          to={section.path}
          className={({ isActive }) =>
            clsx(
              "block w-full px-4 py-3 text-left font-medium transition",
              isActive ? "bg-(--accent-primary) text-(--text-inverted)" : "hover:bg-(--bg-secondary)"
            )
          }
        >
          {section.label}
        </NavLink>
      ))}
    </>
  )
}

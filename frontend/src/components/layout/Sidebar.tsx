import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { ROUTES } from "@/router"
import { useAuth } from "../../auth/useAuth"
import { HomeIcon, UserRoundCog } from "lucide-react"

interface SidebarProps {
  sidebarOpen: boolean
}

export function Sidebar({ sidebarOpen }: SidebarProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const SECTIONS: { path: string; label: string; icon: React.ReactNode; visible: boolean }[] = [
    { path: ROUTES.home, label: t("sidebar.home"), icon: <HomeIcon className="h-6 w-6 shrink-0" />, visible: true },
    {
      path: ROUTES.accountSettings,
      label: t("sidebar.account_settings"),
      icon: <UserRoundCog className="h-6 w-6 shrink-0" />,
      visible: isAuthenticated,
    },
  ]

  return (
    <nav className="flex flex-col space-y-2 p-2 overflow-x-hidden">
      {SECTIONS.filter((section) => section.visible).map((section) => (
        <NavLink
          key={section.path}
          to={section.path}
          className={({ isActive }) =>
            clsx(
              "flex items-center rounded-md p-3 gap-3 transition-colors",
              isActive ? "bg-(--accent-primary) text-(--text-inverted)" : "text-text-primary hover:bg-(--bg-tertiary)"
            )
          }
          title={!sidebarOpen ? section.label : undefined} // Tooltip when collapsed
        >
          {section.icon}
          {sidebarOpen && <span className="whitespace-nowrap">{section.label}</span>}
        </NavLink>
      ))}
    </nav>
  )
}

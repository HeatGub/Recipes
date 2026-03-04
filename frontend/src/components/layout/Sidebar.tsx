import { NavLink } from "react-router-dom"
import { useTranslation } from "react-i18next"
import clsx from "clsx"
import { ROUTES } from "@/router"
import { useAuth } from "../../auth/useAuth"
import { HomeIcon, UserRoundCog, NotebookPen, NotebookText } from "lucide-react"

interface SidebarProps {
  sidebarOpen: boolean
}

type SidebarSection = {
  path: string
  label: string
  icon: React.ReactNode
  visible: boolean
}

export function Sidebar({ sidebarOpen }: SidebarProps) {
  const { t } = useTranslation()
  const { isAuthenticated } = useAuth()

  const MAIN_SECTIONS = [
    { path: ROUTES.home, label: t("sidebar.home"), icon: <HomeIcon className="h-6 w-6 shrink-0" />, visible: true },
    {
      path: ROUTES.recipeDetails,
      label: t("sidebar.view_recipe"),
      icon: <NotebookText className="h-6 w-6 shrink-0" />,
      visible: true,
    },
    {
      path: ROUTES.recipeCreate,
      label: t("sidebar.create_recipe"),
      icon: <NotebookPen className="h-6 w-6 shrink-0" />,
      visible: true,
    },
  ]

  const ACCOUNT_SECTION = {
    path: ROUTES.accountSettings,
    label: t("sidebar.account_settings"),
    icon: <UserRoundCog className="h-6 w-6 shrink-0" />,
    visible: isAuthenticated,
  }

  return (
    <nav className="flex h-full flex-col overflow-x-hidden p-2">
      {/* Top links */}
      <div className="space-y-2">
        {MAIN_SECTIONS.filter((s) => s.visible).map((section) => (
          <NavItem key={section.path} section={section} sidebarOpen={sidebarOpen} />
        ))}
      </div>

      {/* Push bottom */}
      {ACCOUNT_SECTION.visible && (
        <div className="mt-auto pt-2">
          <NavItem section={ACCOUNT_SECTION} sidebarOpen={sidebarOpen} />
        </div>
      )}
    </nav>
  )
}

interface NavItemProps {
  section: SidebarSection
  sidebarOpen: boolean
}

function NavItem({ section, sidebarOpen }: NavItemProps) {
  return (
    <NavLink
      to={section.path}
      className={({ isActive }) =>
        clsx(
          "flex items-center gap-3 rounded-md p-2 min-[420px]:p-3 transition-colors",
          isActive ? "bg-(--accent-primary) text-(--text-inverted)" : "text-text-primary hover:bg-(--bg-tertiary)"
        )
      }
      title={!sidebarOpen ? section.label : undefined}
    >
      {section.icon}
      {sidebarOpen && <span className="whitespace-nowrap">{section.label}</span>}
    </NavLink>
  )
}

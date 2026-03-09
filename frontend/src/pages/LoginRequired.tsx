import { useTranslation } from "react-i18next"
import { Lock } from "lucide-react"
import { NavLink } from "react-router-dom"
import { ROUTES } from "@/router"
import { Home } from "lucide-react"

export function LoginRequired() {
  const { t } = useTranslation()

  return (
    <div className="relative flex h-full min-h-[80vh] items-center justify-center px-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="pointer-events-none text-9xl font-bold opacity-5 select-none">401</span>
      </div>

      <div className="relative z-10 flex max-w-full flex-col items-center text-center sm:max-w-[50%] lg:max-w-[40%]">
        <Lock className="mb-6 h-18 w-18 text-(--text-warning)" />
        <h1 className="text-3xl font-bold">{t("loginRequired.title")}</h1>
        <p className="mt-4 text-lg">{t("loginRequired.message")}</p>

        <NavLink
          to={ROUTES.home}
          className="mt-8 inline-flex items-center gap-2 text-lg font-semibold text-(--accent-primary) hover:text-(--accent-secondary)"
        >
          <Home className="h-6 w-6 shrink-0" />
          <span className="whitespace-nowrap">{t("loginRequired.visit_homepage")}</span>
        </NavLink>
      </div>
    </div>
  )
}

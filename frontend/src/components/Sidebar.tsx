import { useTranslation } from "react-i18next"

export function Sidebar() {
  const { t } = useTranslation()
  return (
    <nav className="flex flex-1 flex-col gap-2 p-4">
      <div className="text-lg font-bold tracking-tight">
        {t("header.title")}
      </div>

      <a className="rounded px-3 py-2 hover:bg-muted">
        {t("sidebar.dashboard")}
      </a>

      <a className="rounded px-3 py-2 hover:bg-muted">
        {t("sidebar.settings")}
      </a>
    </nav>
  )
}

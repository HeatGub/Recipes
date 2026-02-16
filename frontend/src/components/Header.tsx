import { ThemeToggle } from "./ThemeToggle"
import { LangSwitcher } from "./LangSwitcher"
import { AuthPanel } from "./auth/AuthPanel"
import { useTranslation } from "react-i18next"

export function Header({ sidebarOpen, onToggleSidebar }: { sidebarOpen: boolean; onToggleSidebar: () => void }) {
  const { t } = useTranslation()
  return (
    <header className="flex items-center justify-between border-b py-1 px-2">
      <button
        onClick={onToggleSidebar}
        className="cursor-pointer rounded p-2 hover:bg-(--bg-secondary)"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        ☰
      </button>

      <h1 className="text-xl font-bold">{t("header.title")}</h1>

      <div className="flex gap-4 z-10 items-center">
        <LangSwitcher />
        <ThemeToggle />
        <AuthPanel />
      </div>
    </header>
  )
}

import { ThemeToggle } from "./ThemeToggle"
import { LangSwitcher } from "./LangSwitcher"
import { LoginAvatarMenu } from "./auth/LoginAvatarMenu"
import { useTranslation } from "react-i18next"

export function Header({ sidebarOpen, onToggleSidebar }: { sidebarOpen: boolean; onToggleSidebar: () => void }) {
  const { t } = useTranslation()
  return (
    <header className="flex h-12 items-center justify-between border-b px-4">
      <button
        onClick={onToggleSidebar}
        className="rounded p-2 hover:bg-(--bg-secondary)"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        ☰
      </button>

      <h1 className="text-xl font-bold">{t("header.title")}</h1>

      <div className="flex gap-4">
        <LangSwitcher />
        <ThemeToggle />
        <LoginAvatarMenu />
      </div>
    </header>
  )
}

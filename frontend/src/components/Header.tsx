import { ThemeToggle } from "./ThemeToggle"
import { LangSwitcher } from "./LangSwitcher"
import { AuthPanel } from "./auth/AuthPanel"
import { useTranslation } from "react-i18next"
import { Button } from "./ui/Button"
import { Menu } from "lucide-react"

export function Header({ sidebarOpen, onToggleSidebar }: { sidebarOpen: boolean; onToggleSidebar: () => void }) {
  const { t } = useTranslation()
  return (
    <header className="flex items-center justify-between border-b px-2 py-1">
      <Button
        variant="ghost"
        onClick={onToggleSidebar}
        className="rounded py-2"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        <Menu className="h-5 w-5" />
      </Button>

      <h1 className="text-xl font-bold">{t("header.title")}</h1>

      <div className="z-10 flex items-center gap-4">
        <LangSwitcher />
        <ThemeToggle />
        <AuthPanel />
      </div>
    </header>
  )
}

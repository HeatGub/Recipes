import { ThemeToggle } from "../common/ThemeToggle"
import { LangSwitcher } from "../common/LangSwitcher"
import { AuthPanel } from "../auth/AuthPanel"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/Button"
import { ChevronRight, ChevronLeft, PanelLeft } from "lucide-react"

export function Header({ sidebarOpen, onToggleSidebar }: { sidebarOpen: boolean; onToggleSidebar: () => void }) {
  const { t } = useTranslation()
  return (
    <header className="flex items-center justify-between border-b border-(--border-muted)! bg-(--bg-primary) py-1 pr-2.5 pl-2 md:sticky md:top-0 md:z-50">
      <Button
        variant="ghost"
        onClick={onToggleSidebar}
        className="flex items-center justify-center rounded p-2! text-(--text-secondary)"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
        {/* {sidebarOpen? <PanelLeftClose className="h-6 w-6 text-(--text-secondary)" /> : <PanelLeftOpen className="h-6 w-6 text-(--text-secondary)" />} */}
        {/* {sidebarOpen? <ChevronLeft className="h-6 w-6" /> : <ChevronRight className="h-6 w-6" />} */}
        {sidebarOpen ? (
          <>
            <ChevronLeft className="-mx-1 h-4 w-4" />
            <PanelLeft className="h-6 w-6" />
          </>
        ) : (
          <>
            <PanelLeft className="h-6 w-6" />
            <ChevronRight className="-mx-1 h-4 w-4" />
          </>
        )}
      </Button>

      <h1 className="text-xl font-bold">{t("header.title")}</h1>

      <div className="z-10 flex items-center gap-3">
        <LangSwitcher />
        <ThemeToggle/>
        <AuthPanel />
      </div>
    </header>
  )
}

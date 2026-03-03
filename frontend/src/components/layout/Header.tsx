import { ThemeToggle } from "../common/ThemeToggle"
import { LangSwitcher } from "../common/LangSwitcher"
import { AuthPanel } from "../auth/AuthPanel"
import { useTranslation } from "react-i18next"
import { Button } from "../ui/Button"
import { ChevronRight, ChevronLeft, PanelLeft } from "lucide-react"
{/*UtensilsCrossed*/}

export function Header({ sidebarOpen, onToggleSidebar }: { sidebarOpen: boolean; onToggleSidebar: () => void }) {
  const { t } = useTranslation()
  return (
    <header className="relative flex items-center border-b border-(--border-muted)! bg-(--bg-primary) px-0.5 sm:px-2 md:px-3 py-1.5 shadow-[0_1px_4px_var(--shadow-color)] md:sticky md:top-0">
      {/* Left: Sidebar toggle */}
      <Button
        variant="ghost"
        onClick={onToggleSidebar}
        className="flex items-center justify-center rounded p-2! text-(--text-secondary)"
        aria-label={sidebarOpen ? "Close sidebar" : "Open sidebar"}
      >
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

      {/* Title */}
      <h1 className="hidden min-[460px]:block flex-1 truncate text-center text-xl font-bold md:absolute md:top-1/2 md:left-1/2 md:max-w-[calc(100%-8rem)] md:-translate-x-1/2 md:-translate-y-1/2">
        {t("header.title")}
      </h1>

      {/* Right controls */}
      <div className="z-10 ml-auto flex items-center gap-2 sm:gap-2 md:gap-3 lg:gap-4">
        <LangSwitcher />
        <ThemeToggle />
        <AuthPanel />
      </div>
    </header>
  )
}

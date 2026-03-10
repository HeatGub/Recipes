import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Outlet } from "react-router-dom"
import { clsx } from "clsx"
import { useLocalStorage } from "@/hooks/useLocalStorage"
import { Background } from "./Background"
import { useTranslation } from "react-i18next"
import { DEMO_MODE } from "@/constants"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebarOpen", true)
  const { t } = useTranslation()

  return (
    <>
      <Background />
      <div className="flex min-h-screen flex-col">
        <div className="flex flex-1">
          {/* Mobile overlay */}
          {sidebarOpen && (
            <div className="fixed inset-0 z-30 md:hidden">
              <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
              <aside className="absolute top-0 left-0 h-full w-54 border-r bg-(--bg-primary) shadow-lg transition-transform duration-300 min-[420px]:w-64">
                <Sidebar sidebarOpen={sidebarOpen} />
              </aside>
            </div>
          )}

          {/* Desktop / tablet sidebar */}
          <aside
            className={clsx(
              "z-30 hidden border-r-2 border-(--border-default)! bg-(--bg-primary) transition-[width] duration-300 ease-in-out md:flex md:flex-col",
              sidebarOpen ? "w-64" : "w-16",
              "md:sticky md:top-0 md:h-screen md:shrink-0"
            )}
          >
            <Sidebar sidebarOpen={sidebarOpen} />
          </aside>

          {/* Main content */}
          <div className="flex min-w-0 flex-1 flex-col">
            <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />
            {DEMO_MODE && (
              <div className="py-0.2 w-full bg-(--bg-warning) text-center text-xs text-(--text-inverted)">
                {t("general.demo_mode_message")}
              </div>
            )}
            <main className="relative overflow-hidden p-1 sm:p-2 md:p-6">
              <Outlet />
            </main>
          </div>
        </div>
      </div>
    </>
  )
}

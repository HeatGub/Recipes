import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Outlet } from "react-router-dom"
import { clsx } from "clsx"
import { useLocalStorage } from "@/hooks/useLocalStorage"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useLocalStorage("sidebarOpen", true)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 md:hidden z-30">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute top-0 left-0 h-full w-54 min-[420px]:w-64 border-r bg-(--bg-primary) shadow-lg transition-transform duration-300">
              <Sidebar sidebarOpen={sidebarOpen}/>
            </aside>
          </div>
        )}

        {/* Desktop / tablet sidebar */}
        <aside
          className={clsx(
            "hidden md:flex md:flex-col border-r-2 border-(--border-default)! bg-(--bg-primary) transition-[width] duration-300 ease-in-out",
            sidebarOpen ? "w-64" : "w-16",
            "md:sticky md:top-0 md:h-screen md:shrink-0"
          )}
        >
          <Sidebar sidebarOpen={sidebarOpen}/>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col min-w-0">
          <Header
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />
          <main className="overflow-y-hidden p-1 sm:p-2 md:p-6 bg-(--bg-primary)">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

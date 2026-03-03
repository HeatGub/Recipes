import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Outlet } from "react-router-dom"
import { clsx } from "clsx"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 h-screen">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute top-0 left-0 h-full w-64 border-r bg-(--bg-primary) shadow-lg transition-transform duration-300">
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
          <main className="overflow-y-hidden p-4 md:p-6 bg-(--bg-primary)">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

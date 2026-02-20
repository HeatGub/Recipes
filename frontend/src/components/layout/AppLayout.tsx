import { useState } from "react"
import { Sidebar } from "./Sidebar"
import { Header } from "./Header"
import { Outlet } from "react-router-dom"

export function AppLayout() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex flex-1 h-screen overflow-hidden">

        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div
              className="absolute inset-0 bg-black/40"
              onClick={() => setSidebarOpen(false)}
            />
            <aside className="absolute top-0 left-0 h-full w-64 border-r bg-(--bg-primary) shadow-lg transition-transform duration-200">
              <Sidebar sidebarOpen={sidebarOpen}/>
            </aside>
          </div>
        )}

        {/* Desktop / tablet sidebar */}
        <aside
          className={`hidden md:flex md:flex-col border-r bg-(--bg-primary) transition-[width] duration-300 ease-in-out ${
            sidebarOpen ? "w-64" : "w-16"
          }`}
        >
          <Sidebar sidebarOpen={sidebarOpen}/>
        </aside>

        {/* Main content */}
        <div className="flex flex-1 flex-col overflow-hidden min-w-0">
          <Header
            sidebarOpen={sidebarOpen}
            onToggleSidebar={() => setSidebarOpen((v) => !v)}
          />
          <main className="overflow-y-auto p-4 md:p-6 bg-(--bg-primary)">
            <Outlet />
          </main>
        </div>
      </div>
    </div>
  )
}

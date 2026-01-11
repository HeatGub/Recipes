import { useState } from "react"
import { Sidebar } from "../components/Sidebar"
import { Header } from "../components/Header"

export function AppLayout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)

  return (
    <div className="min-h-screen bg-(--bg-primary) text-(--text-primary)">
      <div className="flex h-screen overflow-hidden">
        {/* Mobile overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 md:hidden">
            <div className="absolute inset-0 bg-black/40" onClick={() => setSidebarOpen(false)} />
            <aside className="absolute top-0 left-0 h-full w-64 border-r bg-(--bg-primary)">
              <Sidebar />
            </aside>
          </div>
        )}

        {/* Desktop sidebar */}
        <aside
          className={`hidden flex-col border-r bg-(--bg-primary) transition-all duration-300 md:flex ${sidebarOpen ? "w-64" : "w-0 overflow-hidden"} `}
        >
          {sidebarOpen && <Sidebar />}
        </aside>

        {/* Main area */}
        <div className="flex flex-1 flex-col">
          <Header sidebarOpen={sidebarOpen} onToggleSidebar={() => setSidebarOpen((v) => !v)} />

          <main className="flex-1 overflow-y-auto p-4 md:p-6">{children}</main>
        </div>
      </div>
    </div>
  )
}

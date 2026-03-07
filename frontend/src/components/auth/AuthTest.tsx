import { useAuth } from "../../hooks/useAuth"
import { api } from "../../api/client"
import { useAuthPanel } from "../../auth/AuthPanelContext"

export function AuthTest() {
  const { user, isAuthenticated, authInitFinished, authInProgress, login, logout } = useAuth()

  const { currentPanel, togglePanel, closePanel, openPanel } = useAuthPanel()

  return (
    <div className="flex flex-col gap-4">
      <div className="mt-4 space-y-1 border p-3 text-sm">
        <div className="text-4xl text-(--text-secondary) text-center">
          <span className="sm:hidden">Mobile view</span>
          <span className="hidden sm:inline lg:hidden">Tablet view</span>
          <span className="hidden lg:inline xl:hidden">Desktop view</span>
          <span className="hidden xl:inline 2xl:hidden">XL Desktop view</span>
          <span className="hidden 2xl:inline">2XL Desktop view</span>
        </div>
        <div className="flex gap-7 py-2">
          <button onClick={() => login("admin", "admin")} className="border p-1">
            Login
          </button>

          <button onClick={() => api.get("/protected/")} className="border p-1">
            Call Protected
          </button>

          <button onClick={logout} className="border p-1">
            Logout
          </button>
        </div>
        <div>user.name: {String(user?.username)}</div>
        <div>user.id: {String(user?.id)}</div>
        {/* <div>user.email: {String(user?.email)}</div> */}
        <div>authInitFinished: {String(authInitFinished)}</div>
        <div>isAuthenticated: {String(isAuthenticated)}</div>
        <div>authInProgress: {String(authInProgress)}</div>
        ____________________________________
        <div className="space-2 flex flex-col gap-2">
          <div>currentPanel: {String(currentPanel)}</div>
          <button
            className="border p-1 font-medium"
            onClick={() => {
              openPanel("login")
            }}
          >
            Open Login Panel
          </button>
          <button
            className="border p-1 font-medium"
            onClick={() => {
              togglePanel("login")
            }}
          >
            Toggle Login
          </button>
          <button
            className="border p-1 font-medium"
            onClick={() => {
              closePanel()
            }}
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  )
}

import { useAuth } from "../../auth/useAuth"
import { api } from "../../api/client"
import { useAuthPanel } from "../../auth/AuthPanelContext"

export function AuthTest() {
  const {
    user,
    isAuthenticated,
    authInitFinished,
    authInProgress,
    login,
    logout,
  } = useAuth()

  const {currentPanel, togglePanel, closePanel, openPanel } = useAuthPanel()

  return (
    <div className="flex flex-col gap-4">

      <div className="flex gap-7">
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

      <div className="mt-4 border p-3 text-sm space-y-1">
        <div>user.name: {String(user?.username)}</div>
        <div>user.id: {String(user?.id)}</div>
        {/* <div>user.email: {String(user?.email)}</div> */}
        <div>authInitFinished: {String(authInitFinished)}</div>
        <div>isAuthenticated: {String(isAuthenticated)}</div>
        <div>authInProgress: {String(authInProgress)}</div>
        ____________________________________
        <div className="flex flex-col space-2 gap-2">
          <div>currentPanel: {String(currentPanel)}</div>
          <button className="border p-1 font-medium" onClick={() => {openPanel("login")}}>Open Login Panel</button>
          <button className="border p-1 font-medium" onClick={() => {togglePanel("login")}}>Toggle Login</button>
          <button className="border p-1 font-medium" onClick={() => {closePanel()}}>Close Panel</button>
        </div>
      </div>
    </div>
  )
}

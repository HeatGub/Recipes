import { useAuth } from "../auth/useAuth"
import { api } from "../api/client"

export function AuthTest() {
  const {
    isAuthenticated,
    authInitFinished,
    authInProgress,
    login,
    logout,
  } = useAuth()

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
        <div>authInitFinished: {String(authInitFinished)}</div>
        <div>isAuthenticated: {String(isAuthenticated)}</div>
        <div>authInProgress: {String(authInProgress)}</div>
      </div>
    </div>
  )
}

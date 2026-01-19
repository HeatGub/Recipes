import { login, logout } from "../api/auth"
import { api } from "../api/client"

export function AuthTest() {
  return (
    <div className="flex gap-7">
      <button className="rounded-l border p-1" onClick={() => login("admin", "admin")}>
        Login
      </button>
      <button className="rounded-l border p-1" onClick={() => api.get("/protected/")}>
        Call Protected
      </button>
      <button className="rounded-l border p-1" onClick={logout}>
        Logout
      </button>
    </div>
  )
}

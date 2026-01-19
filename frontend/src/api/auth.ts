import { api, setAccessToken } from "./client"

export const login = async (identifier: string, password: string) => {
  console.log("[AUTH] Logging in…")

  const res = await api.post("/auth/token/", { identifier, password })

  setAccessToken(res.data.access)
  console.log("[AUTH] Login success → access token stored")
}

export const logout = async () => {
  console.log("[AUTH] Logging out…")

  await api.post("/auth/logout/")
  setAccessToken(null)

  console.log("[AUTH] Logout success → tokens cleared")
}

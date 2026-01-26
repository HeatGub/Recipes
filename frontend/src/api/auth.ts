import { api, setAccessToken } from "./client"

export const authInit = async () => {
  console.log("[AUTH] Initializing auth…")

  try {
    const res = await api.post("/auth/token/refresh/")
    const access = res.data.data.access

    setAccessToken(access)
    console.log("[AUTH] Access token restored")
    return true

  } catch (err) {
    setAccessToken(null)
    console.log("[AUTH] No valid refresh token")
    console.log(err)
    
    return false
  }
}

export const login = async (identifier: string, password: string) => {
  console.log("[AUTH] Logging in…")

  const res = await api.post("/auth/login/", { identifier, password })

  setAccessToken(res.data.data.access)
  console.log("[AUTH] Login success → access token stored")
}

export const logout = async () => {
  console.log("[AUTH] Logging out…")

  await api.post("/auth/logout/")
  setAccessToken(null)

  console.log("[AUTH] Logout success → tokens cleared")
}

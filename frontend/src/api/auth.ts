import { api, setAccessToken } from "./client"

export const authInit = async () => {
  try {
    const res = await api.post("/auth/token/refresh/")
    const access_token = res.data.payload.access_token

    setAccessToken(access_token)
    return true

  } catch {
    setAccessToken(null)
    
    return false
  }
}

export const login = async (identifier: string, password: string) => {
  const res = await api.post("/auth/login/", { identifier, password })
  setAccessToken(res.data.payload.access_token)
}

export const logout = async () => {
  await api.post("/auth/logout/")
  setAccessToken(null)
}

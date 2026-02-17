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

export const me = async () => {
  const res = await api.get("/auth/me/")
  return res.data
}

export const login = async (identifier: string, password: string) => {
  const res = await api.post("/auth/login/", { identifier, password })
  setAccessToken(res.data.payload.access_token)
  return res.data
}

export const logout = async () => {
  await api.post("/auth/logout/")
  setAccessToken(null)
}

export const register = async (email: string, username: string, password: string) => {
  const res = await api.post("/auth/register/", { email, username, password })
  const token = res.data.payload.access_token
  setAccessToken(token)
  return res.data
}

export const deleteAccount = async (password: string) => {
  const res = await api.delete("/auth/delete/", {
    data: { password },
  })
  // setAccessToken(null)
  return res.data
}

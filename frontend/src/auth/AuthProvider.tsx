import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { AuthContext } from "./AuthContext"
import type { AuthContextType, User, RegisterPayload } from "./AuthContext"
import * as authApi from "../api/auth"
import { DEMO_MODE } from "@/constants"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authInitFinished, setAuthInitFinished] = useState(false)
  const [authInProgress, setAuthInProgress] = useState(false)

  const fakeDelay = (ms: number) => new Promise((res) => setTimeout(res, ms))
  const MOCK_USER = {
    id: 1337,
    username: "Demo User",
    email: "demo@email.com",
  }

  // 🔁 Run once on app start
  useEffect(() => {
    const initAuth = async () => {
      if (DEMO_MODE) {
        setAuthInitFinished(true)
        return
      }
      try {
        const newAccessToken = await authApi.authInit()
        if (newAccessToken) {
          // fetch user after refresh
          const me = await authApi.me()
          setUser(me.payload.user)
          setIsAuthenticated(true)
        } else {
          setIsAuthenticated(false)
          setUser(null)
        }
      } catch {
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setAuthInitFinished(true)
      }
    }

    initAuth()
  }, [])

  const login = async (identifier: string, password: string): Promise<User> => {
    if (DEMO_MODE) {
      setAuthInProgress(true)
      await fakeDelay(700)
      setIsAuthenticated(true)
      const loggedInUser = { ...MOCK_USER, username: identifier }
      setUser(loggedInUser)
      setAuthInProgress(false)
      return loggedInUser
    } else {
      setAuthInProgress(true)
      try {
        const res = await authApi.login(identifier, password)
        setIsAuthenticated(true)
        setUser(res.payload.user)
        return res.payload.user
      } finally {
        setAuthInProgress(false)
      }
    }
  }

  const logout = async () => {
    if (DEMO_MODE) {
      setAuthInProgress(true)
      setIsAuthenticated(false)
      setUser(null)
      setAuthInProgress(false)
    } else {
      setAuthInProgress(true)
      try {
        await authApi.logout()
        setIsAuthenticated(false)
        setUser(null)
      } finally {
        setAuthInProgress(false)
      }
    }
  }

  const register = async (data: RegisterPayload) => {
    if (DEMO_MODE) {
      setAuthInProgress(true)
      await fakeDelay(700)
      const user = {
        id: 1337,
        username: data.username,
        email: data.email ? data.email : "",
      }
      setIsAuthenticated(true)
      setUser(user)
      setAuthInProgress(false)
      return user
    } else {
      setAuthInProgress(true)
      try {
        const res = await authApi.register(data)
        setIsAuthenticated(true)
        setUser(res.payload.user)
        return res.payload.user
      } finally {
        setAuthInProgress(false)
      }
    }
  }

  const deleteAccount = async (password: string) => {
    setAuthInProgress(true)
    try {
      await authApi.deleteAccount(password)
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setAuthInProgress(false)
    }
  }

  const updateMe = async () => {
    setAuthInProgress(true)
    try {
      const me = await authApi.me()
      setUser(me.payload.user)
      setIsAuthenticated(true)
    } catch {
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setAuthInProgress(false)
    }
  }

  const value: AuthContextType = {
    user,
    isAuthenticated,
    authInitFinished,
    authInProgress,
    login,
    logout,
    register,
    deleteAccount,
    updateMe,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

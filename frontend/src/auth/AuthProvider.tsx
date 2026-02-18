import { useState, useEffect } from "react"
import type { ReactNode } from "react"
import { AuthContext } from "./AuthContext"
import type { AuthContextType, User, RegisterPayload } from "./AuthContext"
import * as authApi from "../api/auth"

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authInitFinished, setAuthInitFinished] = useState(false)
  const [authInProgress, setAuthInProgress] = useState(false)

  // 🔁 Run once on app start
  useEffect(() => {
    const initAuth = async () => {
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

  const login = async (identifier: string, password: string) => {
    setAuthInProgress(true)
    try {
      const res = await authApi.login(identifier, password)
      setIsAuthenticated(true)
      setUser(res.payload.user)
    } finally {
      setAuthInProgress(false)
    }
  }

  const logout = async () => {
    setAuthInProgress(true)
    try {
      await authApi.logout()
      setIsAuthenticated(false)
      setUser(null)
    } finally {
      setAuthInProgress(false)
    }
  }

  const register = async (data:RegisterPayload)  => {
    setAuthInProgress(true)
    try {
      const res = await authApi.register(data)
      setIsAuthenticated(true)
      setUser(res.payload.user)
    } finally {
      setAuthInProgress(false)
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

  const value: AuthContextType = {
    user,
    isAuthenticated,
    authInitFinished,
    authInProgress,
    login,
    logout,
    register,
    deleteAccount,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { createContext, useEffect, useState } from "react"
import type { ReactNode } from "react"
import * as authApi from "../api/auth"

type AuthContextType = {
  isAuthenticated: boolean
  authInitFinished: boolean
  authInProgress: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [authInitFinished, setAuthInitFinished] = useState(false)
  const [authInProgress, setAuthInProgress] = useState(false)

  // 🔁 Run once on app start
  useEffect(() => {
    const initAuth = async () => {
      try {
        const success = await authApi.authInit()
        setIsAuthenticated(success)
      } catch {
        setIsAuthenticated(false)
      } finally {
        setAuthInitFinished(true)
      }
    }

    initAuth()
  }, [])

  const login = async (identifier: string, password: string) => {
    setAuthInProgress(true)
    try {
      await authApi.login(identifier, password)
      setIsAuthenticated(true)
    } finally {
      setAuthInProgress(false)
    }
  }

  const logout = async () => {
    setAuthInProgress(true)
    try {
      await authApi.logout()
      setIsAuthenticated(false)
    } finally {
      setAuthInProgress(false)
    }
  }

  const value: AuthContextType = {
    isAuthenticated,
    authInitFinished,
    authInProgress,
    login,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

import { createContext } from "react"

export type AuthContextType = {
  isAuthenticated: boolean
  authInitFinished: boolean
  authInProgress: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

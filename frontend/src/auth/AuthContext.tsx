import { createContext } from "react"

export type User = {
  id: number
  username: string
}

export type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  authInitFinished: boolean
  authInProgress: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
  deleteAccount: (password: string) => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

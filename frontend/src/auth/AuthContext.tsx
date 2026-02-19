import { createContext } from "react"

export type User = {
  id: number
  username: string
  email: string
}

export type RegisterPayload = {
  username: string
  email?: string
  password: string
  password_confirm: string
}

export type AuthContextType = {
  user: User | null
  isAuthenticated: boolean
  authInitFinished: boolean
  authInProgress: boolean
  login: (identifier: string, password: string) => Promise<void>
  logout: () => Promise<void>
  register: (data:RegisterPayload) => Promise<void>
  deleteAccount: (password: string) => Promise<void>
  updateMe: () => Promise<void>
}

export const AuthContext = createContext<AuthContextType | null>(null)

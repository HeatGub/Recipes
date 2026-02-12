import { createContext, useContext, useState, useCallback } from "react"
import type { ReactNode } from "react"

type AuthPanelType = "login" | "register" | "logout" | "account_settings" | null

interface AuthPanelContextValue {
  currentPanel: AuthPanelType
  openPanel: (panel: AuthPanelType) => void
  togglePanel: (panel: AuthPanelType) => void
  closePanel: () => void
}

const AuthPanelContext = createContext<AuthPanelContextValue | undefined>(undefined)

export const AuthPanelProvider = ({ children }: { children: ReactNode }) => {
  const [currentPanel, setcurrentPanel] = useState<AuthPanelType>(null)

  const openPanel = useCallback((panel: AuthPanelType) => {
    setcurrentPanel(panel)
  }, [])

  const togglePanel = (panel: AuthPanelType) => setcurrentPanel((prev) => (prev === panel ? null : panel))
  const closePanel = () => setcurrentPanel(null)

  return (
    <AuthPanelContext.Provider value={{ currentPanel, openPanel, togglePanel, closePanel }}>
      {children}
    </AuthPanelContext.Provider>
  )
}

export const useAuthPanel = () => {
  const context = useContext(AuthPanelContext)
  if (!context) throw new Error("useAuthPanel must be used within a AuthPanelProvider")
  return context
}
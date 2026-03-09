import { useAuth } from "../hooks/useAuth"
import { useAuthPanel } from "./AuthPanelContext"
import { useEffect } from "react"
import { LoginRequired } from "@/pages/LoginRequired"
import { LoadingPage } from "@/pages/LoadingPage"


export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, authInitFinished } = useAuth()
  const { openPanel } = useAuthPanel()

  useEffect(() => {
    if (authInitFinished && !isAuthenticated) {
      openPanel("login")
    }
  }, [authInitFinished, isAuthenticated, openPanel])

  // ⏳
  if (!authInitFinished) {
    return <LoadingPage/>
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <LoginRequired/>
  }

  // ✅ Logged in
  return <>{children}</>
}

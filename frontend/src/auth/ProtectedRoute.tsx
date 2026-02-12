import { useAuth } from "./useAuth"
import { useAuthPanel } from "./AuthPanelContext"
import { useEffect } from "react"

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
    return <div className="mt-15 text-center font-bold">Loading...</div>
  }

  // ❌ Not logged in
  if (!isAuthenticated) {
    return <div className="mt-15 text-center font-bold">Log in to see the content of this page...</div> // block rendering protected page
  }

  // ✅ Logged in
  return <>{children}</>
}

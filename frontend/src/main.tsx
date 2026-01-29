import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import { App } from "./App"
import "./main.css"
import "./i18n"
import { AuthProvider } from "./auth/AuthProvider"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <App />
    </AuthProvider>
  </StrictMode>
)

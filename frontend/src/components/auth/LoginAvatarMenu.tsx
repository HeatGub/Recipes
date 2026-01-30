import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../auth/useAuth"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"


export function LoginAvatarMenu() {
  const { login, logout, user } = useAuth()

  const [openPanel, setOpenPanel] = useState<"login" | "register" | "logout" | null>(null)

  const isLoggedIn = Boolean(user)
  const avatarLetter = isLoggedIn ? user?.username.charAt(0).toUpperCase() : "?"

  const togglePanel = (panel: typeof openPanel) => setOpenPanel((prev) => (prev === panel ? null : panel))
  const closePanel = () => setOpenPanel(null)

  const handleLogout = () => {
    logout()
    closePanel()
  }

  const { t } = useTranslation()

  return (
    <div className="relative right-1 inline-flex items-center">
      <div className="flex overflow-hidden rounded-full border-2">
        {!isLoggedIn && (
          <>
            <button
              className="flex-1 rounded-l-full px-3 py-2 text-center transition hover:bg-(--accent-primary) hover:text-(--text-opposite)"
              onClick={() => togglePanel("login")}
            >
              {t("account.login")}
            </button>
            <button
              className="flex-1 rounded-r-full px-3 py-2 pr-12 text-center transition hover:bg-(--accent-secondary) hover:text-(--text-opposite)"
              onClick={() => togglePanel("register")}
            >
              {t("account.register")}
            </button>
          </>
        )}

        {isLoggedIn && (
          <button
            className="flex-1 rounded-full px-3 py-2 pr-12 text-center transition hover:bg-red-600 hover:text-white"
            onClick={() => togglePanel("logout")}
          >
            {t("account.logout")}
          </button>
        )}
      </div>

      <div className="absolute right-px z-10 flex h-10 w-10 items-center justify-center rounded-full bg-(--accent-primary) text-lg font-semibold text-(--text-opposite)">
        {avatarLetter}
      </div>

      {/* Dropdown panels */}
      {openPanel && (
        <div className="absolute top-full right-0 mt-2 max-w-90 min-w-60 rounded-xl border bg-(--bg-primary) p-4 text-(--text-primary) shadow-lg">
          {openPanel === "login" && (
            <LoginForm
              onSubmit={async ({ identifier, password }) => {
                await login(identifier, password)
                closePanel()
              }}
            />
          )}

          {openPanel === "register" && (
            <RegisterForm
              onSubmit={async (data) => {
                data
                // console.log("Register form data:", data)
                // await authApi.register(data)
                closePanel()
              }}
            />
          )}

          {openPanel === "logout" && (
            <div className="space-y-3">
              <p>
                {t("account.logged_in_as")} <strong>{user?.username}</strong>
              </p>
              <button onClick={handleLogout} className="w-full rounded bg-red-600 px-2 py-1 text-white">
                {t("account.logout")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

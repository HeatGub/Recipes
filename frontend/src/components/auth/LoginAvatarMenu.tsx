import { useState } from "react"
import { useTranslation } from "react-i18next"
import { useAuth } from "../../auth/useAuth"
import { LoginForm } from "./LoginForm"
import { RegisterForm } from "./RegisterForm"
import clsx from "clsx"

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

  const panelStyles: Record<"login" | "register" | "logout", { selected: string; hover: string }> = {
    login: {
      selected: "rounded-l-full bg-(--accent-primary) text-(--text-inverted)",
      hover: "rounded-l-full hover:bg-(--accent-primary) hover:text-(--text-inverted)",
    },
    register: {
      selected: "pr-11 rounded-r-full bg-(--accent-secondary) text-(--text-inverted)",
      hover: "pr-11 rounded-r-full hover:bg-(--accent-secondary) hover:text-(--text-inverted)",
    },
    logout: {
      selected: "pr-11 rounded-full bg-(--bg-warning) text-(--text-inverted)",
      hover: "pr-11 rounded-full hover:bg-(--bg-warning) hover:text-(--text-inverted)",
    },
  }

  const getButtonClasses = (panel: "login" | "register" | "logout") =>
    clsx(
      "flex-1 pl-3 pr-2 py-2 text-center transition",
      openPanel === panel ? panelStyles[panel].selected : panelStyles[panel].hover
    )

  return (
    <div className="relative right-1 inline-flex items-center">
      <div className="flex overflow-hidden rounded-full border-2">
        {!isLoggedIn && (
          <>
            <button className={getButtonClasses("login")} onClick={() => togglePanel("login")}>
              {t("account.login")}
            </button>

            <button className={getButtonClasses("register")} onClick={() => togglePanel("register")}>
              {t("account.register")}
            </button>
          </>
        )}

        {isLoggedIn && (
          <button className={getButtonClasses("logout")} onClick={() => togglePanel("logout")}>
            {t("account.logout")}
          </button>
        )}
      </div>

      <div className="absolute right-px z-10 flex h-10 w-10 items-center justify-center rounded-full bg-(--accent-primary) text-lg font-semibold text-(--text-inverted)">
        {avatarLetter}
      </div>

      {/* Dropdown panels */}
      {openPanel && (
        <div className="absolute top-full right-0 mt-2 max-w-90 min-w-60 rounded-xl border p-4 shadow-lg">
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
              <button
                onClick={handleLogout}
                className="w-full rounded bg-(--bg-warning) px-2 py-1 text-(--text-inverted)"
              >
                {t("account.logout")}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

import { useState } from "react"
import { useTranslation } from "react-i18next"

interface User {
  name: string
}

export function LoginAvatarMenu() {
  const [user, setUser] = useState<User | null>(null)
  const [openPanel, setOpenPanel] = useState<"login" | "register" | "logout" | null>(null)

  const isLoggedIn = Boolean(user)
  const avatarLetter = isLoggedIn ? user?.name.charAt(0).toUpperCase() : "?"

  const togglePanel = (panel: typeof openPanel) => setOpenPanel((prev) => (prev === panel ? null : panel))
  const closePanel = () => setOpenPanel(null)

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({ name: "John" })
    closePanel()
  }
  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault()
    setUser({ name: "New user" })
    closePanel()
  }
  const handleLogout = () => {
    setUser(null)
    closePanel()
  }

  const { t } = useTranslation()

  return (
    <div className="relative inline-flex items-center right-1">
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

      <div className="absolute right-px z-10 flex h-10 w-10 items-center justify-center rounded-full bg-(--accent-primary) font-semibold text-(--text-opposite) text-lg">
        {avatarLetter}
      </div>

      {/* Dropdown panels */}
      {openPanel && (
        <div className="absolute top-full right-0 mt-2 min-w-60 max-w-90 rounded-xl border bg-(--bg-primary) p-4 text-(--text-primary) shadow-lg">
          {openPanel === "login" && (
            <form onSubmit={handleLogin} className="space-y-2 text-sm">
              <h3 className="font-semibold text-base">{t("account.login")}</h3>
              {t("account.username_or_email")}
              <input
                type="text"
                className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)"
                required
              />
              {t("account.password")}
              <input type="password" className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)" required />
              <button type="submit" className="w-full rounded bg-(--accent-primary) px-2 py-1 mt-2 text-(--text-opposite)">
                {t("account.login")}
              </button>
            </form>
          )}

          {openPanel === "register" && (
            <form onSubmit={handleRegister} className="space-y-2 text-sm">
              <h3 className="font-semibold text-base">{t("account.register")}</h3>
              {t("account.username")}
              <input
                type="text"
                className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)"
                required
              />
              {t("account.email_optional")}
              <input
                type="email"
                className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)"
              />
              {t("account.password")}
              <input
                type="password"
                className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)"
                required
              />
              {t("account.confirm_password")}
              <input
                type="password"
                className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)"
                required
              />
              <button type="submit" className="w-full rounded bg-(--accent-secondary) px-2 py-1 mt-2 text-(--text-opposite)">
                {t("account.create_account")}
              </button>
            </form>
          )}

          {openPanel === "logout" && (
            <div className="space-y-3">
              <p>
                
                {t("account.logged_in_as")} <strong>{user?.name}</strong>
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

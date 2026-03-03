import { useTranslation } from "react-i18next"
import { useAuth } from "../../auth/useAuth"
import { LoginForm } from "../../forms/auth/LoginForm"
import { RegisterForm } from "../../forms/auth/RegisterForm"
import clsx from "clsx"
import { RichButton } from "../ui/RichButton"
import { useAuthPanel } from "../../auth/AuthPanelContext"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/router"
import { UserPlus, LogIn, LogOut, Settings } from "lucide-react"

export function AuthPanel() {
  const { login, logout, register, user } = useAuth()
  const { currentPanel, togglePanel, closePanel } = useAuthPanel()
  const navigate = useNavigate()

  const isLoggedIn = Boolean(user)
  const avatarLetter = isLoggedIn ? user?.username.charAt(0) : "?"

  const handleLogout = () => {
    logout()
    closePanel()
  }

  const handleAccountSettings = () => {
    navigate(ROUTES.accountSettings)
    closePanel()
  }

  const { t } = useTranslation()

  const panelStyles: Record<"login" | "register" | "logout" | "settings", { selected: string; hover: string }> = {
    login: {
      selected: "bg-(--accent-primary) text-(--text-inverted) scale-110  z-2",
      hover: "hover:bg-(--accent-primary) hover:text-(--text-inverted) bg-(--bg-secondary) hover:scale-110",
    },
    register: {
      selected: "bg-(--accent-secondary) text-(--text-inverted) scale-110  z-2",
      hover: "hover:bg-(--accent-secondary) hover:text-(--text-inverted) bg-(--bg-secondary) hover:scale-110",
    },
    logout: {
      selected: "bg-(--bg-warning) text-(--text-inverted) scale-110  z-2",
      hover: "hover:bg-(--bg-warning) hover:text-(--text-inverted) bg-(--bg-secondary) hover:scale-110",
    },
    settings: {
      selected: "bg-(--accent-primary) text-(--text-inverted) scale-110  z-2",
      hover: "hover:bg-(--accent-primary) hover:text-(--text-inverted) bg-(--bg-secondary) hover:scale-110",
    },
  }

  const getButtonClasses = (panel: "login" | "register" | "logout" | "settings") =>
    clsx(
      "flex cursor-pointer items-center gap-1 pl-2 pr-6 h-6 text-s leading-none border-1 rounded-full transition w-fit whitespace-nowrap",
      currentPanel === panel ? panelStyles[panel].selected : panelStyles[panel].hover
    )

  return (
    <div className="relative inline-flex items-center ml-1">
      <div className="mr-5.5 flex h-10 flex-col items-end justify-center">
        {!isLoggedIn && (
          <>
            <button className={getButtonClasses("register")} onClick={() => togglePanel("register")}>
              <UserPlus className="h-4 w-4" />
              {t("account.register")}
            </button>

            <button className={getButtonClasses("login")} onClick={() => togglePanel("login")}>
              <LogIn className="h-4 w-4" />
              {t("account.log_in")}
            </button>
          </>
        )}

        {isLoggedIn && (
          <>
            <button className={getButtonClasses("logout")} onClick={() => togglePanel("logout")}>
              <LogOut className="h-4 w-4" />
              {t("account.log_out")}
            </button>
            <button className={getButtonClasses("settings")} onClick={() => togglePanel("account_settings")}>
              <Settings className="h-4 w-4" />
              {t("account.config")}
            </button>
          </>
        )}
      </div>

      <div
        className={clsx(
          "absolute right-px z-10 flex h-10 w-10 items-center justify-center rounded-full text-2xl font-semibold select-none",
          isLoggedIn
            ? "bg-[radial-gradient(circle,var(--accent-secondary)_35%,var(--accent-primary)_60%,var(--text-secondary)_101%)] text-(--text-inverted) outline-2 outline-(--border-default)!"
            : "border-2 border-(--accent-primary)! bg-[radial-gradient(circle,var(--bg-secondary)_35%,var(--bg-primary)_65%)] text-(--text-secondary) outline-2 outline-(--border-default)!"
        )}
      >
        {avatarLetter}
      </div>

      {/* Dropdown panels */}
      {currentPanel && (
        <div className="absolute top-full right-0 mt-2 max-w-90 min-w-60 rounded-xl border bg-(--bg-primary) p-4 shadow-lg">
          {currentPanel === "login" && (
            <LoginForm
              onSubmit={async ({ identifier, password }) => {
                await login(identifier, password)
                closePanel()
              }}
            />
          )}

          {currentPanel === "register" && (
            <RegisterForm
              onSubmit={async (registerPayload) => {
                await register(registerPayload)
                closePanel()
              }}
            />
          )}

          {currentPanel === "logout" && (
            <div className="space-y-3">
              <p>
                {t("account.logged_in_as")} <strong>{user?.username}</strong>
              </p>
              <RichButton onClick={handleLogout} variant="warning" className="w-full">
                {t("account.log_out")}
              </RichButton>
            </div>
          )}

          {currentPanel === "account_settings" && (
            <div className="space-y-3">
              <p>
                {t("account.logged_in_as")} <strong>{user?.username}</strong>
              </p>
              <RichButton onClick={handleAccountSettings} variant="primary" className="w-full">
                {t("sidebar.account_settings")}
              </RichButton>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

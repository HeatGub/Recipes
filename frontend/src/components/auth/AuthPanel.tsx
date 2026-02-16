import { useTranslation } from "react-i18next"
import { useAuth } from "../../auth/useAuth"
import { LoginForm } from "../../forms/auth/LoginForm"
import { RegisterForm } from "../../forms/auth/RegisterForm"
import clsx from "clsx"
import { api } from "@/api/client"
import { RichButton } from "../ui/RichButton"
import { useAuthPanel } from "../../auth/AuthPanelContext"
import { useNavigate } from "react-router-dom"
import { ROUTES } from "@/router"
import { UserPlus, LogIn, LogOut } from "lucide-react" // Example icons

export function AuthPanel() {
  const { login, logout, user } = useAuth()
  const { currentPanel, togglePanel, closePanel } = useAuthPanel()
  const navigate = useNavigate()

  const isLoggedIn = Boolean(user)
  const avatarLetter = isLoggedIn ? user?.username.charAt(0).toUpperCase() : "?"

  const handleLogout = () => {
    logout()
    closePanel()
  }

  const handleAccountSettings = () => {
    navigate(ROUTES.accountSettings)
    closePanel()
  }

  const { t } = useTranslation()

  const panelStyles: Record<"login" | "register" | "logout", { selected: string; hover: string }> = {
    login: {
      selected: "bg-(--accent-primary) text-(--text-inverted)",
      hover: "hover:bg-(--accent-primary) hover:text-(--text-inverted) bg-(--bg-secondary)",
    },
    register: {
      selected: "bg-(--accent-secondary) text-(--text-inverted)",
      hover: "hover:bg-(--accent-secondary) hover:text-(--text-inverted) bg-(--bg-secondary)",
    },
    logout: {
      selected: "bg-(--bg-warning) text-(--text-inverted)",
      hover: "hover:bg-(--bg-warning) hover:text-(--text-inverted) bg-(--bg-secondary)",
    },
  }

  const getButtonClasses = (panel: "login" | "register" | "logout") =>
    clsx(
      "flex items-center gap-1 pl-2 pr-6 h-6 text-s leading-none border-1 rounded-full transition w-fit whitespace-nowrap",
      currentPanel === panel ? panelStyles[panel].selected : panelStyles[panel].hover
    )

  return (
    <div className="relative inline-flex items-center">
      <div className="mr-5 flex h-10 flex-col items-end justify-center">
        {!isLoggedIn && (
          <>
            <button className={getButtonClasses("register")} onClick={() => togglePanel("register")}>
              <UserPlus className="h-5 w-5" />
              {t("account.register")}
            </button>

            <button className={getButtonClasses("login")} onClick={() => togglePanel("login")}>
              <LogIn className="h-5 w-5" />
              {t("account.log_in")}
            </button>
          </>
        )}

        {isLoggedIn && (
          <button className={getButtonClasses("logout")} onClick={() => togglePanel("logout")}>
            <LogOut className="h-5 w-5" />
            {/* {t("account.log_out")} */}
          </button>
        )}
      </div>

      <div
        onClick={() => isLoggedIn && togglePanel("account_settings")}
        className={clsx(
          "absolute right-px z-10 flex h-10 w-10 items-center justify-center rounded-full text-xl font-semibold",
          isLoggedIn
            ? "cursor-pointer border-3 border-(--accent-primary)! bg-(--accent-secondary) text-(--text-inverted) outline-2 outline-(--border-default)! hover:text-2xl hover:shadow-[0_0_10px_var(--shadow-hover)]"
            : "cursor-default border-2 border-(--accent-primary)! bg-(--bg-tertiary) text-(--text-secondary) outline-2 outline-(--border-default)!"
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
              onSubmit={async (data) => {
                await api.post("/auth/register/", { ...data })
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
            <RichButton onClick={handleAccountSettings} variant="primary" className="w-full">
              {t("account.account_settings")}
            </RichButton>
          )}
        </div>
      )}
    </div>
  )
}

import { useAuth } from "@/auth/useAuth"
import { clsx } from "clsx"
import { useTranslation } from "react-i18next"

export function ProfileHeader() {
  const { user } = useAuth()
  const { t } = useTranslation()

  const isLoggedIn = Boolean(user)
  const avatarLetter = isLoggedIn ? user?.username.charAt(0) : "?"

  return (
    <div className="pl-6 flex h-16 mb-8 w-full rounded bg-linear-to-r from-(--accent-primary) to-(--accent-secondary)">
      <div
        className={clsx(
          "flex h-20 w-20 items-center justify-center rounded-full text-5xl font-semibold select-none",
          "border-3 border-(--accent-primary)! bg-(--bg-secondary) text-(--text-primary) outline-8 outline-(--bg-tertiary)!", 
        )}
      >
        {avatarLetter}
      </div>

      <div className="px-5 py-2">
        <p className="font-bold text-xl">{user?.username}</p>
        <p className="px-4 text-sm italic text-(--text-inverted)">{user?.email ? user.email : t("account.email_not_provided")}</p>
      </div>
    </div>
  )
}

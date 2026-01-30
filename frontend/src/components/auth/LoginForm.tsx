import { useState } from "react"
import { useTranslation } from "react-i18next"
import SyncLoader from "react-spinners/SyncLoader"

interface LoginFormData {
  identifier: string
  password: string
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()

  const [isLoading, setIsLoading] = useState<boolean>(false)

  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    password: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await onSubmit(formData)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className={`relative space-y-2 text-sm transition ${
        isLoading ? "pointer-events-none opacity-70 blur-[1px]" : ""
      }`}
    >
      {isLoading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <SyncLoader size={8} color="var(--accent-primary)" />
        </div>
      )}

      <h3 className="text-base font-semibold">{t("account.login")}</h3>

      {t("account.username_or_email")}
      <input
        name="identifier"
        type="text"
        value={formData.identifier}
        onChange={handleChange}
        // required
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />

      {t("account.password")}
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        // required
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />

      <button type="submit" className="mt-2 w-full rounded bg-(--accent-primary) px-2 py-1 text-(--text-inverted)">
        {t("account.login")}
      </button>
    </form>
  )
}

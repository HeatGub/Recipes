import { useState } from "react"
import { useTranslation } from "react-i18next"

interface LoginFormData {
  identifier: string
  password: string
}

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()

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
    await onSubmit(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-2 text-sm">
      <h3 className="text-base font-semibold">{t("account.login")}</h3>

      {t("account.username_or_email")}
      <input
        name="identifier"
        type="text"
        value={formData.identifier}
        onChange={handleChange}
        required
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)"
      />

      {t("account.password")}
      <input
        name="password"
        type="password"
        value={formData.password}
        onChange={handleChange}
        required
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1 text-(--text-primary)"
      />

      <button
        type="submit"
        className="mt-2 w-full rounded bg-(--accent-primary) px-2 py-1 text-(--text-opposite)"
      >
        {t("account.login")}
      </button>
    </form>
  )
}

import { useState } from "react"
import { useTranslation } from "react-i18next"

interface RegisterFormData {
  username: string
  email?: string
  password: string
  confirmPassword: string
}

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation()

  const [formData, setFormData] = useState<RegisterFormData>({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
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
      <h3 className="text-base font-semibold">{t("account.register")}</h3>

      {t("account.username")}
      <input
        name="username"
        type="text"
        required
        value={formData.username}
        onChange={handleChange}
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />

      {t("account.email_optional")}
      <input
        name="email"
        type="email"
        value={formData.email}
        onChange={handleChange}
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />

      {t("account.password")}
      <input
        name="password"
        type="password"
        required
        value={formData.password}
        onChange={handleChange}
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />

      {t("account.confirm_password")}
      <input
        name="confirmPassword"
        type="password"
        required
        value={formData.confirmPassword}
        onChange={handleChange}
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />

      <button
        type="submit"
        className="mt-2 w-full rounded bg-(--accent-secondary) px-2 py-1 text-(--text-inverted)"
      >
        {t("account.create_account")}
      </button>
    </form>
  )
}

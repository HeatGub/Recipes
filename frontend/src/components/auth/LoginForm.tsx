import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import SyncLoader from "react-spinners/SyncLoader"

export type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
}

export const loginSchema = z.object({
  identifier: z.string().min(1, { message: "forms.errors.required" }),
  password: z.string().min(1, { message: "forms.errors.required" }),
})

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const handleFormSubmit = async (data: LoginFormData) => {
    await onSubmit(data)
  }

  return (
    <form
      onSubmit={handleSubmit(handleFormSubmit)}
      className={`relative space-y-1 text-sm transition ${
        isSubmitting ? "pointer-events-none opacity-70 blur-[1px]" : ""
      }`}
    >
      {isSubmitting && (
        <div className="absolute inset-0 z-10 flex items-center justify-center">
          <SyncLoader size={8} color="var(--accent-primary)" />
        </div>
      )}

      <h3 className="text-base font-semibold">{t("account.login")}</h3>

      <label>{t("account.username_or_email")}</label>
      <input {...register("identifier")} type="text" className="w-full rounded border bg-(--bg-secondary) px-2 py-1" />
      {errors.identifier?.message && <p className="text-xs text-(--text-error)">{t(errors.identifier.message)}</p>}

      <label>{t("account.password")}</label>
      <input
        {...register("password")}
        type="password"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.password?.message && <p className="text-xs text-(--text-error)">{t(errors.password.message)}</p>}

      <button type="submit" className="mt-2 w-full rounded bg-(--accent-primary) px-2 py-1 text-(--text-inverted)">
        {t("account.login")}
      </button>
    </form>
  )
}

import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SyncLoader from "react-spinners/SyncLoader"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { FormFieldError, FormGlobalError } from "@/forms/core/FormErrors"

export const loginSchema = z.object({
  identifier: z.string().min(0, { message: "VALIDATION.BLANK" }),
  password: z.string().min(0, { message: "VALIDATION.BLANK" }),
})

export type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    formState: { errors, isSubmitting },
  } = useFormWithApi<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  return (
    <form
      onSubmit={handleSubmit(handleApiSubmit(onSubmit))}
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

      {/* IDENTIFIER */}
      <label>{t("account.username_or_email")}</label>
      <input
        {...register("identifier")}
        type="text"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.identifier && (
        <p className="text-xs text-(--text-error)">
          <FormFieldError error={errors.identifier} />
        </p>
      )}

      {/* PASSWORD */}
      <label>{t("account.password")}</label>
      <input
        {...register("password")}
        type="password"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.password && (
        <p className="text-xs text-(--text-error)">
          <FormFieldError error={errors.password} />
        </p>
      )}

      <button
        type="submit"
        className="mt-2 w-full rounded bg-(--accent-primary) px-2 py-1 text-(--text-inverted)"
      >
        {t("account.log_in")}
      </button>

      <p className="mt-1 text-center text-s text-(--text-warning)">
        <FormGlobalError error={errors.root?.message} />
      </p>
    </form>
  )
}
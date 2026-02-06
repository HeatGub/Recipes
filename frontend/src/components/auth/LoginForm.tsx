import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import SyncLoader from "react-spinners/SyncLoader"
import { useState } from "react"

export type LoginFormData = z.infer<typeof loginSchema>

interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void> | void
}

export const loginSchema = z.object({
  identifier: z.string().min(1, { message: "VALIDATION.BLANK" }),
  password: z.string().min(1, { message: "VALIDATION.BLANK" }),
})

export interface ApiFieldError {
  code: string
  params?: Record<string, any>
}

export interface ApiErrors {
  [field: string]: ApiFieldError[]
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const { t } = useTranslation()
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const [globalError, setGlobalError] = useState<string | null>(null)

  const handleFormSubmit = async (data: LoginFormData) => {
    setGlobalError(null)

    try {
      await onSubmit(data)
    } catch (err: unknown) {
      // --- ensure error matches expected API shape ---
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        typeof (err as any).errors === "object"
      ) {
        const apiErrors = (err as { errors: ApiErrors }).errors

        for (const [field, fieldErrors] of Object.entries(apiErrors)) {
          if (!Array.isArray(fieldErrors) || fieldErrors.length === 0) continue

          const firstError = fieldErrors[0]

          if (field === "_global") {
            setGlobalError(firstError.code)
          } else {
            setError(field as keyof LoginFormData, {
              type: "server",
              message: firstError.code,
            })
          }
        }
      } else {
        console.error("LOGIN FORM - unexpected error:", err)
      }
    }
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
      {errors.identifier?.message && <p className="text-xs text-(--text-error)">{t(`errors.${errors.identifier.message}`)}</p>}

      <label>{t("account.password")}</label>
      <input
        {...register("password")}
        type="password"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.password?.message && <p className="text-xs text-(--text-error)">{t(`errors.${errors.password.message}`)}</p>}
      
      <button type="submit" className="mt-2 w-full rounded bg-(--accent-primary) px-2 py-1 text-(--text-inverted)">
        {t("account.log_in")}
      </button>
      
      {globalError && <p className="mt-1 text-center text-s text-(--text-warning)">{t(`errors.${globalError}`)}</p>}
    </form>
  )
}

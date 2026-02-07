import { useTranslation } from "react-i18next"
import { useForm } from "react-hook-form"
// import { zodResolver } from "@hookform/resolvers/zod"
import { z } from "zod"
import SyncLoader from "react-spinners/SyncLoader"
import type { FieldError } from "react-hook-form"

export const registerSchema = z
  .object({
    username: z.string().min(1, { message: "VALIDATION.BLANK" }),
    email: z.string({ message: "VALIDATION.INVALID_EMAIL" }),
    password: z.string().min(1, { message: "VALIDATION.BLANK" }),
    password_confirm: z.string().min(1, { message: "VALIDATION.BLANK" }),
  })
  .refine((data) => data.password === data.password_confirm, {
    path: ["password_confirm"],
    message: "VALIDATION.PASSWORD_MISMATCH",
  })

export type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void
}

export interface ApiError {
  code: string
  params?: Record<string, any>
}

export interface ApiErrors {
  [field: string]: ApiError[]
}

export type ServerErrorMessage = ApiError & {
  __type: "server"
}

export function toServerMessage(error: ApiError): ServerErrorMessage {
  return {
    ...error,
    __type: "server",
  }
}

export function rhfMessage(message: ServerErrorMessage): string {
  return message as unknown as string
}

export function getApiError(message: unknown): ApiError | null {
  if (!message) return null
  if (typeof message === "object" && message !== null && "code" in message) {
    return message as ApiError
  }
  if (typeof message === "string") {
    return { code: message }
  }
  return null
}


function FormFieldError({ error }: { error?: FieldError }) {
  const { t } = useTranslation()
  const msg = getApiError(error?.message)
  if (!msg) return null

  return (t(`errors.${msg.code}`, msg.params))
}


function FormGlobalError({ error }: { error: ApiError | null }) {
  const { t } = useTranslation()
  if (!error) return null

  return (t(`errors.${error.code}`, error.params))
}


export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    // resolver: zodResolver(registerSchema), // off for testing backend
  })

  const handleFormSubmit = async (data: RegisterFormData) => {
    clearErrors("root")

    try {
      await onSubmit(data)
    } catch (err: unknown) {
      console.log(err)
      if (
        typeof err === "object" &&
        err !== null &&
        "errors" in err &&
        typeof (err).errors === "object"
      ) {
        const apiErrors = (err as { errors: ApiErrors }).errors

        for (const [field, fieldErrors] of Object.entries(apiErrors)) {
          if (!Array.isArray(fieldErrors) || fieldErrors.length === 0) continue

          const firstError = fieldErrors[0]

          if (field === "_global") {
            setError("root", {
              type: "server",
              message: rhfMessage(
                toServerMessage({
                  code: firstError.code,
                  params: firstError.params,
                })
              ),
            })
          } else {
            setError(field as keyof RegisterFormData, {
              type: "server",
              message: rhfMessage(
                toServerMessage({
                  code: firstError.code,
                  params: firstError.params,
                })
              ),
            })
          }
        }
      } else {
        console.error("FORM - unexpected error:", err)
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

      <h3 className="text-base font-semibold">{t("account.register")}</h3>

      {/* USERNAME */}
      <label>{t("account.username")}</label>
      <input
        {...register("username")}
        type="text"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      
      {errors.username?.message && 
        <p className="text-xs text-(--text-error)"><FormFieldError error={errors.username} /></p>
      }

      {/* EMAIL */}
      <label>{t("account.email_optional")}</label>
      <input
        {...register("email")}
        // type="email"
        type="text"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.email?.message && 
        <p className="text-xs text-(--text-error)"><FormFieldError error={errors.email} /></p>
      }

      {/* PASSWORD */}
      <label>{t("account.password")}</label>
      <input
        {...register("password")}
        type="password"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.password?.message && 
        <p className="text-xs text-(--text-error)"><FormFieldError error={errors.password} /></p>
      }

      {/* PASSWORD CONFIRM */}
      <label>{t("account.password_confirm")}</label>
      <input
        {...register("password_confirm")}
        type="password"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.password_confirm?.message && 
        <p className="text-xs text-(--text-error)"><FormFieldError error={errors.password_confirm} /></p>
      }

      <button
        type="submit"
        className="mt-2 w-full rounded bg-(--accent-primary) px-2 py-1 text-(--text-inverted)"
      >
        {t("account.create_account")}
      </button>

      <p className="mt-1 text-center text-s text-(--text-warning)">
        <FormGlobalError error={getApiError(errors.root?.message)} />
      </p>
    </form>
  )
}

import { useTranslation } from "react-i18next"
import { z } from "zod"
import SyncLoader from "react-spinners/SyncLoader"
// import { zodResolver } from "@hookform/resolvers/zod"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { FormFieldError, FormGlobalError } from "@/forms/core/FormErrors"

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

type RegisterFormData = z.infer<typeof registerSchema>

interface RegisterFormProps {
  onSubmit: (data: RegisterFormData) => Promise<void> | void
}

export function RegisterForm({ onSubmit }: RegisterFormProps) {
  const { t } = useTranslation()

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    formState: { errors, isSubmitting },
  } = useFormWithApi<RegisterFormData>({
    // resolver: zodResolver(registerSchema),
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

      <h3 className="text-base font-semibold">{t("account.register")}</h3>

      {/* USERNAME */}
      <label>{t("account.username")}</label>
      <input
        {...register("username")}
        type="text"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.username && (
        <p className="text-xs text-(--text-error)">
          <FormFieldError error={errors.username} />
        </p>
      )}

      {/* EMAIL */}
      <label>{t("account.email_optional")}</label>
      <input
        {...register("email")}
        type="text"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.email && (
        <p className="text-xs text-(--text-error)">
          <FormFieldError error={errors.email} />
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

      {/* PASSWORD CONFIRM */}
      <label>{t("account.password_confirm")}</label>
      <input
        {...register("password_confirm")}
        type="password"
        className="w-full rounded border bg-(--bg-secondary) px-2 py-1"
      />
      {errors.password_confirm && (
        <p className="text-xs text-(--text-error)">
          <FormFieldError error={errors.password_confirm} />
        </p>
      )}

      <button
        type="submit"
        className="mt-2 w-full rounded bg-(--accent-primary) px-2 py-1 text-(--text-inverted)"
      >
        {t("account.create_account")}
      </button>

      <p className="mt-1 text-center text-s text-(--text-warning)">
        <FormGlobalError error={errors.root?.message} />
      </p>
    </form>
  )
}

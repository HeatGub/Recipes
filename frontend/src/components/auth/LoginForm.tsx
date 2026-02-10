import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SyncLoader from "react-spinners/SyncLoader"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { FormFieldError, FormGlobalError } from "@/forms/core/FormErrors"
import { rhfMessage } from "@/forms/core/apiErrors"
import {
  MIN_IDENTIFIER_LEN,
  MAX_IDENTIFIER_LEN,
  MIN_PASSWORD_LEN,
  MAX_PASSWORD_LEN,
} from "@/forms/core/constants"
import { Button } from "../ui/Button"

export const loginSchema = z.object({
  identifier: z.string().superRefine((val, ctx) => {
    if (val.length < MIN_IDENTIFIER_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.USERNAME_TOO_SHORT",
          params: { min: MIN_IDENTIFIER_LEN },
        }),
      })
    }

    if (val.length > MAX_IDENTIFIER_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.USERNAME_TOO_LONG",
          params: { max: MAX_IDENTIFIER_LEN },
        }),
      })
    }
  }),

  password: z.string().superRefine((val, ctx) => {
    if (val.length < MIN_PASSWORD_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.PASSWORD_TOO_SHORT",
          params: { min: MIN_PASSWORD_LEN },
        }),
      })
    }

    if (val.length > MAX_PASSWORD_LEN) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.PASSWORD_TOO_LONG",
          params: { max: MAX_PASSWORD_LEN },
        }),
      })
    }
  }),
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
        <p className="text-xs text-(--text-danger)">
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
        <p className="text-xs text-(--text-danger)">
          <FormFieldError error={errors.password} />
        </p>
      )}

      <Button type="submit" variant="primary" className="w-full mt-2">
        {t("account.log_in")}
      </Button>

      <p className="mt-1 text-center text-s text-(--text-warning)">
        <FormGlobalError error={errors.root?.message} />
      </p>
    </form>
  )
}
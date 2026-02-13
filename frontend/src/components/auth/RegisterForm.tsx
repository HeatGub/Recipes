import { useTranslation } from "react-i18next"
import { z } from "zod"
import SyncLoader from "react-spinners/SyncLoader"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { FormFieldError, FormGlobalError } from "@/forms/core/FormErrors"
import { rhfMessage } from "@/forms/core/apiErrors"
import {
  MIN_IDENTIFIER_LEN,
  MAX_IDENTIFIER_LEN,
  MIN_PASSWORD_LEN,
  MAX_PASSWORD_LEN,
  EMAIL_REGEX
} from "@/forms/core/constants"
import { RichButton } from "../ui/RichButton"

export const registerSchema = z.object({

  username: z.string().superRefine((val, ctx) => {
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

  email: z.string().optional().superRefine((val, ctx) => {
    if (!val) return
    
    if (!EMAIL_REGEX.test(val)) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code: "VALIDATION.INVALID_EMAIL",
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

  password_confirm: z.string().superRefine((val, ctx) => {
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
}).refine(
  data =>
    data.password.length > 0 &&
    data.password_confirm.length > 0 &&
    data.password === data.password_confirm,
  {
    path: ["password_confirm"],
    message: "VALIDATION.PASSWORD_MISMATCH",
  }
)

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
    resolver: zodResolver(registerSchema),
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
        <p className="text-xs text-(--text-danger)">
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
        <p className="text-xs text-(--text-danger)">
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
        <p className="text-xs text-(--text-danger)">
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
        <p className="text-xs text-(--text-danger)">
          <FormFieldError error={errors.password_confirm} />
        </p>
      )}

      <RichButton type="submit" variant="success" className="w-full mt-2">
        {t("account.create_account")}
      </RichButton>

      <p className="mt-1 text-center text-s text-(--text-warning)">
        <FormGlobalError error={errors.root?.message} />
      </p>
    </form>
  )
}

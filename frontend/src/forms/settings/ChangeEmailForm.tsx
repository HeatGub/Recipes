import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { rhfMessage } from "@/forms/core/apiErrors"
import { EMAIL_REGEX, MIN_PASSWORD_LEN, MAX_PASSWORD_LEN } from "@/forms/core/constants"
import { SettingsFormInput } from "@/components/ui/SettingsFormInput"
import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/Button"
import { api } from "@/api/client"
import { showToast } from "@/components/ui/Toasts"

export const changeEmailSchema = z.object({
  email: z
    .string()
    .trim()
    .superRefine((val, ctx) => {
      if (!val || val.length == 0) {
        ctx.addIssue({
          code: "custom",
          message: rhfMessage({
            code: "VALIDATION.REQUIRED",
          }),
        })
        return
      }
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
})

export type ChangeEmailFormData = z.infer<typeof changeEmailSchema>

export function ChangeEmailForm() {
  const { t } = useTranslation()
  const { updateMe } = useAuth()

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithApi<ChangeEmailFormData>({
    resolver: zodResolver(changeEmailSchema),
  })

  const onSubmit = async (data: ChangeEmailFormData) => {
    await api.patch("/auth/me/email/", data)
    updateMe()
    reset()
    showToast("success", t("success.email_changed"))
  }

  return (
    <form
      onSubmit={handleSubmit(handleApiSubmit(onSubmit))}
      className={`relative space-y-1 text-sm transition ${
        isSubmitting ? "pointer-events-none opacity-70 blur-[1px]" : ""
      }`}
    >
      {isSubmitting && <LoadingOverlay />}

      {/* EMAIL */}
      <SettingsFormInput
        label={t("account.settings.new_email")}
        error={errors.email}
        initialMessage={t("account.settings.init_msg.new_email")}
        inputProps={{
          ...register("email"),
        }}
      />

      {/* PASSWORD */}
      <SettingsFormInput
        label={t("account.password")}
        type="password"
        error={errors.password}
        initialMessage={t("account.settings.init_msg.password_confirm")}
        border={false}
        inputProps={register("password")}
      />

      {/* Footer */}
      <div className="flex justify-end gap-4 border-t bg-(--bg-primary) pt-4">
        <Button type="button" variant="ghost" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="hover:bg-(--accent-secondary)">
          {t("account.settings.change_email")}
        </Button>
      </div>
    </form>
  )
}

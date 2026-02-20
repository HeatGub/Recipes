import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { rhfMessage } from "@/forms/core/apiErrors"
import { MIN_IDENTIFIER_LEN, MAX_IDENTIFIER_LEN, MIN_PASSWORD_LEN, MAX_PASSWORD_LEN } from "@/forms/core/constants"
import { SettingsFormInput } from "@/components/settings/SettingsFormInput"
import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/Button"
import { api } from "@/api/client"
import { showToast } from "@/components/ui/Toasts"

export const changeUsernameSchema = z.object({
  username_new: z.string().superRefine((val, ctx) => {
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

export type ChangeUsernameFormData = z.infer<typeof changeUsernameSchema>

export function ChangeUsernameForm() {
  const { t } = useTranslation()
  const { updateMe } = useAuth()

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithApi<ChangeUsernameFormData>({
    resolver: zodResolver(changeUsernameSchema),
  })

  const onSubmit = async (data: ChangeUsernameFormData) => {
    await api.patch("/auth/me/username/", data)
    updateMe()
    reset()
    showToast("success", t("success.username_changed"))
  }

  return (
    <form
      onSubmit={handleSubmit(handleApiSubmit(onSubmit))}
      autoComplete="off"
      className={`relative space-y-1 text-sm transition ${
        isSubmitting ? "pointer-events-none opacity-70 blur-[1px]" : ""
      }`}
    >
      {isSubmitting && <LoadingOverlay />}

      {/* NEW USERNAME */}
      <SettingsFormInput
        label={t("account.settings.new_username")}
        error={errors.username_new}
        initialMessage={t("account.settings.init_msg.new_username")}
        inputProps={{ ...register("username_new"), autoComplete: "username" }}
      />

      {/* PASSWORD */}
      <SettingsFormInput
        label={t("account.password")}
        type="password"
        error={errors.password}
        initialMessage={t("account.settings.init_msg.password_confirm")}
        border={false}
        inputProps={{ ...register("password"), autoComplete: "current-password" }}
      />

      {/* Footer */}
      <div className="flex justify-end gap-4 border-t bg-(--bg-primary) pt-4">
        <Button type="button" variant="ghost" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="hover:bg-(--accent-secondary)">
          {t("account.settings.change_username")}
        </Button>
      </div>
    </form>
  )
}

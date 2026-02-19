import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import SyncLoader from "react-spinners/SyncLoader"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { rhfMessage } from "@/forms/core/apiErrors"
import { MIN_PASSWORD_LEN, MAX_PASSWORD_LEN } from "@/forms/core/constants"
import { SettingsFormInput } from "@/components/ui/SettingsFormInput"
import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/Button"
import { api } from "@/api/client"
import { showToast } from "@/components/ui/Toasts"

export const ChangePasswordSchema = z
  .object({
    current_password: z.string().superRefine((val, ctx) => {
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

    new_password: z.string().superRefine((val, ctx) => {
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

    new_password_confirm: z.string().superRefine((val, ctx) => {
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
  .refine(
    (data) =>
      data.new_password.length > 0 &&
      data.new_password_confirm.length > 0 &&
      data.new_password === data.new_password_confirm,
    {
      path: ["new_password_confirm"],
      message: "VALIDATION.PASSWORD_MISMATCH",
    }
  )

export type ChangePasswordFormData = z.infer<typeof ChangePasswordSchema>

export function ChangePasswordForm() {
  const { t } = useTranslation()
  const { logout } = useAuth()

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithApi<ChangePasswordFormData>({
    resolver: zodResolver(ChangePasswordSchema),
  })

  const onSubmit = async (data: ChangePasswordFormData) => {
    await api.patch("/auth/me/password/", data)
    showToast("success", t("success.password_changed"))
    logout()
  }

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

      {/* CURRENT PASSWORD */}
      <SettingsFormInput
        label={t("account.settings.current_password")}
        type="password"
        error={errors.current_password}
        initialMessage={t("account.settings.init_msg.current_password")}
        inputProps={{
          ...register("current_password"),
        }}
      />

      {/* NEW PASSWORD */}
      <SettingsFormInput
        label={t("account.settings.new_password")}
        type="password"
        error={errors.new_password}
        initialMessage={t("account.settings.init_msg.new_password")}
        inputProps={{
          ...register("new_password"),
        }}
      />

      {/* NEW PASSWORD CONFIRM */}
      <SettingsFormInput
        label={t("account.settings.new_password_confirm")}
        type="password"
        error={errors.new_password_confirm}
        initialMessage={t("account.settings.init_msg.new_password_confirm")}
        border={false}
        inputProps={register("new_password_confirm")}
      />

      {/* Footer */}
      <div className="flex justify-end gap-4 border-t bg-(--bg-primary) pt-4">
        <Button type="button" variant="ghost" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit" variant="primary" className="hover:bg-(--accent-secondary)">
          {t("account.settings.change_password")}
        </Button>
      </div>
    </form>
  )
}

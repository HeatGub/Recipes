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

export const deleteAccountSchema = z.object({
  username_current: z.string(),

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

export type DeleteAccountFormData = z.infer<typeof deleteAccountSchema>

interface DeleteAccountFormProps {
  onSubmit: (data: DeleteAccountFormData) => Promise<void> | void
}

export function DeleteAccountForm({ onSubmit }: DeleteAccountFormProps) {
  const { t } = useTranslation()
  const { user } = useAuth()

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithApi<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      username_current: String(user?.username),
      password: "",
    },
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

      {/* CURRENT USERNAME */}
      <SettingsFormInput
        label={t("account.username")}
        initialMessage={t("account.settings.init_msg.current_username")}
        inputProps={{
          ...register("username_current"),
          readOnly: true,
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
        <Button variant="ghost" onClick={() => reset()}>
          Cancel
        </Button>
        <Button type="submit" variant="danger" className="hover:text-(--text-inverted)">
          {t("account.settings.delete_account")}
        </Button>
      </div>

      {/* <p className="text-s mt-1 text-center text-(--text-warning)">
        <FormGlobalError error={errors.root?.message} />
      </p> */}
    </form>
  )
}

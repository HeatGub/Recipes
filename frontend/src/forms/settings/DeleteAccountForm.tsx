import { useState } from "react"
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
import { Modal } from "@/components/ui/Modal"
import { showToast } from "@/components/ui/Toasts"

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
  onSubmit?: (data: DeleteAccountFormData) => Promise<void> | void
}

export function DeleteAccountForm({ onSubmit }: DeleteAccountFormProps) {
  const { t } = useTranslation()
  const { user } = useAuth()

  const [isModalOpen, setModalOpen] = useState(false)
  const [pendingData, setPendingData] = useState<DeleteAccountFormData | null>(null)

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

  // 🔹 When form validates → open modal
  const handleValidatedSubmit = (data: DeleteAccountFormData) => {
    setPendingData(data)
    setModalOpen(true)
  }

  // 🔹 Run original API logic after confirm
  const handleConfirmModal = async () => {
    if (!pendingData) return

    try {
      // Call optional prop if provided
      if (onSubmit) await onSubmit(pendingData)

      await new Promise((r) => setTimeout(r, 1000))

      showToast("success", "Account deleted successfully!")
    } catch {
      showToast("error", "Failed to delete account")
    } finally {
      setModalOpen(false)
      setPendingData(null)
    }
  }

  return (
    <>
      {/* Modal Confirmation */}
      <Modal
        isOpen={isModalOpen}
        title={t("account.settings.delete_account")}
        description={t("account.settings.description.delete_account_confirm")}
        onClose={() => setModalOpen(false)}
        onConfirm={handleConfirmModal}
        confirmVariant="danger"
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleApiSubmit(handleValidatedSubmit))}
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
            {t("general.cancel")}
          </Button>
          <Button type="submit" variant="danger" className="hover:text-(--text-inverted)">
            {t("account.settings.delete_account")}
          </Button>
        </div>
      </form>
    </>
  )
}

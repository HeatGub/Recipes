import { useState } from "react"
import { useTranslation } from "react-i18next"
import { z } from "zod"
import { zodResolver } from "@hookform/resolvers/zod"
import { LoadingOverlay } from "@/components/ui/LoadingOverlay"
import { useFormWithApi } from "@/forms/core/useFormWithApi"
import { rhfMessage } from "@/forms/core/apiErrors"
import { MIN_PASSWORD_LEN, MAX_PASSWORD_LEN } from "@/forms/core/constants"
import { SettingsFormInput } from "@/components/settings/SettingsFormInput"
import { useAuth } from "@/auth/useAuth"
import { Button } from "@/components/ui/Button"
import { Modal } from "@/components/ui/Modal"
import { showToast } from "@/components/ui/Toasts"

export const deleteAccountSchema = z.object({
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

export function DeleteAccountForm() {
  const { t } = useTranslation()
  const { deleteAccount } = useAuth()

  const [isModalOpen, setModalOpen] = useState(false)
  const [pendingData, setPendingData] = useState<DeleteAccountFormData | null>(null)
  const [modalLoading, setModalLoading] = useState(false)

  const {
    register,
    handleSubmit,
    handleApiSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useFormWithApi<DeleteAccountFormData>({
    resolver: zodResolver(deleteAccountSchema),
    defaultValues: {
      password: "",
    },
  })

  // Show modal after form validation
  const handleValidatedSubmit = (data: DeleteAccountFormData) => {
    setPendingData(data)
    setModalOpen(true)
  }

  const handleConfirmModal = async () => {
    if (!pendingData) return

    setModalLoading(true) // modal shows loading

    const wrappedSubmit = handleApiSubmit(async (data: DeleteAccountFormData) => {
      await deleteAccount(data.password)
      reset()
      showToast("success", t("success.account_deleted"))
    })

    try {
      await wrappedSubmit(pendingData)
      setModalOpen(false)
      setPendingData(null)
    } finally {
      setModalLoading(false)
    }
  }

  const handleCancelModal = () => {
    setModalOpen(false)
    setPendingData(null)
  }

  return (
    <>
      {/* Modal Confirmation */}
      <Modal
        isOpen={isModalOpen}
        title={t("account.settings.delete_account")}
        description={t("account.settings.description.delete_account_confirm")}
        onClose={handleCancelModal}
        onConfirm={handleConfirmModal}
        confirmVariant="danger"
      />

      {/* Form */}
      <form
        onSubmit={handleSubmit(handleValidatedSubmit)}
        autoComplete="off"
        className={`relative space-y-1 text-sm transition ${
          modalLoading || isModalOpen ? "pointer-events-none opacity-70 blur-[1px]" : ""
        }`}
      >
        {(isSubmitting || modalLoading) && <LoadingOverlay />}

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

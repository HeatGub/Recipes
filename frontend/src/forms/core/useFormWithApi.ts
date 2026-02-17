import { useForm, type UseFormProps, type FieldValues, type SubmitHandler } from "react-hook-form"
import { applyApiErrorsToForm } from "./applyApiErrors"
import { showToast } from "@/components/ui/Toasts"
import { useTranslation } from "react-i18next"

export function useFormWithApi<T extends FieldValues>(props?: UseFormProps<T>) {
  const form = useForm<T>(props)
  const { t } = useTranslation()

  const handleApiSubmit = (onSubmit: SubmitHandler<T>) => async (data: T) => {
    form.clearErrors("root")

    try {
      await onSubmit(data)
    } catch (err: any) {
      const apiErrors = err?.errors

      if (apiErrors?._toast?.length) {
        const code = apiErrors._toast[0].code
        const message = t(`errors.${code}`)
        showToast("error", message)
        // return
      }

      const handled = applyApiErrorsToForm(err, form.setError)

      if (!handled) {
        console.error("FORM - unexpected error:", err)
        showToast("error", t('errors.SOMETHING_WENT_WRONG'))
      }
    }
  }

  return {
    ...form,
    handleApiSubmit,
  }
}

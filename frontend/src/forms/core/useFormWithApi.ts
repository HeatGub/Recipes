import {
  useForm,
  type UseFormProps,
  type FieldValues,
  type SubmitHandler,
} from "react-hook-form"

import { applyApiErrorsToForm } from "./applyApiErrors"

export function useFormWithApi<T extends FieldValues>(
  props?: UseFormProps<T>
) {
  const form = useForm<T>(props)

  const handleApiSubmit =
    (onSubmit: SubmitHandler<T>) =>
    async (data: T) => {
      form.clearErrors("root")

      try {
        await onSubmit(data)
      } catch (err) {
        const handled = applyApiErrorsToForm(err, form.setError)

        if (!handled) {
          console.error("FORM - unexpected error:", err)
        }
      }
    }

  return {
    ...form,
    handleApiSubmit,
  }
}

import { useTranslation } from "react-i18next"
import type { FieldError } from "react-hook-form"
import { getApiError } from "./apiErrors"

export function FormFieldError({ error }: { error?: FieldError }) {
  const { t } = useTranslation()

  const apiError = getApiError(error?.message)
  if (!apiError) return null

  return <>{t(`errors.${apiError.code}`, apiError.params)}</>
}

export function FormGlobalError({ error }: { error: unknown }) {
  const { t } = useTranslation()

  const apiError = getApiError(error)
  if (!apiError) return null

  return <>{t(`errors.${apiError.code}`, apiError.params)}</>
}

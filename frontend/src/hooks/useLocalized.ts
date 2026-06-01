import { useTranslation } from "react-i18next"

export const useLocalized = () => {
  const { i18n } = useTranslation()

  return (value?: Record<string, string> | null) => {
    if (!value) return ""

    return (
      value[i18n.language] ??
      value.en ??
      Object.values(value)[0] ??
      ""
    )
  }
}
import { useTranslation } from "react-i18next"

export function NotFound() {
  const { t } = useTranslation()
  return (
    <div className="mt-20 text-center text-2xl">
      <h1 className="text-4xl font-bold">{t("notFound.title")}</h1>
      <p className="mt-4 text-lg">{t("notFound.message")}</p>
    </div>
  )
}

import { useTranslation } from "react-i18next"
import { Loader2 } from "lucide-react"

export function LoadingPage() {
  const { t } = useTranslation()

  return (
    <div className="relative flex h-full min-h-[80vh] items-center justify-center px-4">
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="pointer-events-none text-9xl font-bold select-none opacity-85">
          <Loader2
            className="mb-6 h-80 w-80 animate-spin stroke-1"
            style={{
              animation: "spin 1s linear infinite, spinnerColor 1.5s ease-in-out infinite",
              color: "var(--accent-primary)",
              WebkitAnimation: "spin 1.5s linear infinite, spinnerColor 3s ease-in-out infinite",
            }}
          />
        </span>
      </div>

      <div className="relative z-10 -mt-5.5 flex h-50 w-50 max-w-full flex-col items-center justify-center gap-4 rounded-full text-center">
        <h1 className="text-3xl font-bold">{t("loading.title")}</h1>
        <p className="text-xl text-(--text-secondary)">{t("loading.message")}</p>
      </div>

      <style>
        {`
          @keyframes spinnerColor {
            0%, 100% { color: var(--accent-primary); }
            50% { color: var(--accent-secondary); }
          }
        `}
      </style>
    </div>
  )
}
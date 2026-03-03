import type { RecipeDetails } from "@/types/recipe"
import { useTranslation } from "react-i18next"

export function RecipeDetailsCard(details: RecipeDetails) {
  const { t } = useTranslation()
  return (
    <div className="flex flex-wrap justify-between w-full rounded-xl bg-(--bg-secondary) p-4 gap-4">
      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">{t("recipe.author")}</p>
        <p className="font-medium">{details.author}</p>
      </div>

      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">{t("recipe.rating")}</p>
        <p className="font-medium text-(--accent-primary)">{details.rating.value} / 10</p>
      </div>

      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">{t("recipe.servings")}</p>
        <p className="font-medium">{details.baseServings}</p>
      </div>

      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">{t("recipe.last_update")}</p>
        <p className="font-medium">{new Date(details.lastUpdated).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
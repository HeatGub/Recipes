import type { Step } from "@/types/recipe"
import { StepIndicator } from "@/components/common/StepIndicator"
import { useTranslation } from "react-i18next"

export function RecipePreparationSection({ steps }: { steps: Step[] }) {
  const { t } = useTranslation()
  return (
    <section>
      <h2 className="text-xl font-semibold">{t("recipe.ingredients.title")}</h2>

      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={step.position} className="rounded-br-2xl border-b border-(--border-muted)! px-2 sm:px-0 py-3 sm:py-4 lg:py-6">
            <StepIndicator>{index + 1}</StepIndicator>
            <span className="text-lg ml-3">
              {step.title && <span className="mr-3 text-lg text-(--accent-primary)">{step.title}</span>}
            </span>
            <span className="leading-relaxed text-(--text-secondary)">{step.description}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}

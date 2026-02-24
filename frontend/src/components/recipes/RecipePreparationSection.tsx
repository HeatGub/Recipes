import type { Step } from "@/types/recipe"
import { StepIndicator } from "@/components/common/StepIndicator"

export function RecipePreparationSection({ steps }: { steps: Step[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">Preparation</h2>

      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li key={step.position} className="rounded-br-2xl border-b border-(--border-muted)! py-6 pr-6">
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

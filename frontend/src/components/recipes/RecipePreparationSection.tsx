import type { Step } from "@/types/recipe"

export function RecipePreparationSection({ steps }: { steps: Step[] }) {
  return (
    <section>
      <h2 className="text-xl font-semibold">Preparation</h2>

      <ol className="space-y-2">
        {steps.map((step, index) => (
          <li
            key={step.position}
            className="border-b rounded-br-2xl border-(--border-muted)! pr-6 py-6"
          >
            <span className="mr-3 inline-flex h-6 w-6 items-center justify-center rounded-full bg-(--accent-primary) font-semibold text-(--text-inverted)">
              {index + 1}
            </span>

            <span className="text-(--text-secondary) leading-relaxed">
              {step.description}
            </span>
          </li>
        ))}
      </ol>
    </section>
  )
}
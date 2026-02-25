import type { IngredientCategory } from "@/types/recipe"

export function RecipeIngredientsSection({ ingredients }: { ingredients: IngredientCategory[] }) {
  return (
    <section className="rounded-2xl bg-(--bg-secondary) p-3 outline-28 outline-(--bg-primary)">
      <h2 className="border-b border-(--border-muted)! pb-1 text-center text-xl font-semibold">Ingredients</h2>

      <table className="w-full border-separate border-spacing-y-1 text-sm">
        {ingredients.map((category) => (
          <tbody key={category.position}>
            {/* Category header */}
            <tr>
              <td colSpan={3} className="px-2 pt-1 font-semibold text-(--text-secondary)">
                {category.title}
              </td>
            </tr>

            {/* Items */}
            {category.items.map((item, index) => (
              <tr key={index} className="bg-(--bg-primary) text-center">
                <td className="rounded-l-lg py-1 pr-1 pl-3">{item.amount}</td>
                <td className="px-1 py-1 italic">{item.unit}</td>
                <td className="rounded-r-lg py-1 pr-2 pl-1 font-semibold">
                  {item.name}
                  {item.notes && <span className="block text-xs text-(--text-muted) italic">{item.notes}</span>}
                </td>
              </tr>
            ))}
          </tbody>
        ))}
      </table>
    </section>
  )
}

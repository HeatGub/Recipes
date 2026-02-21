import type { IngredientCategory } from "@/types/recipe"

export function RecipeIngredientsSection({ ingredients }: { ingredients: IngredientCategory[] }) {
  return (
    // <section className="border border-(--border-muted)! rounded-xl p-2">
    <section className="p-3 bg-(--bg-secondary) rounded-2xl outline-28 outline-(--bg-primary)">
      <h2 className="text-xl text-center font-semibold pb-1 border-b border-(--border-muted)!">Ingredients</h2>

      <table className="w-full border-separate border-spacing-y-1 text-sm">
        {ingredients.map((category: IngredientCategory) => (
          <>
            <tr>
              <td colSpan={3} className="pt-1 px-2 font-semibold text-(--text-secondary)">
                {category.title}
              </td>
            </tr>
            <tbody>
              {category.items.map((item, index) => (
                <tr key={index} className="bg-(--bg-primary) text-center">
                  <td className="rounded-l-lg pl-3 pr-1 py-1">{item.amount}</td>
                  <td className="px-1 py-1 italic ">{item.unit}</td>
                  <td className="rounded-r-lg pl-1 pr-2 py-1">
                    {item.name}
                    {item.notes && <span className="block text-xs text-(--text-muted)">{item.notes}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </>
        ))}
      </table>
    </section>
  )
}
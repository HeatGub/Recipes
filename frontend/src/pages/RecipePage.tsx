import { RecipeDetailsCard } from "@/components/recipes/RecipeDetailsCard"
import { RecipeIngredientsSection } from "@/components/recipes/RecipeIngredientsSection"
import { RecipePreparationSection } from "@/components/recipes/RecipePreparationSection"
import { RecipeLayout } from "@/components/layout/RecipeLayout"
import type { Recipe } from "@/types/recipe" // ONLY HERE "import type \{.*Recipe", "@/types/"
import { useLocalized } from "@/hooks/useLocalized"

export const RecipePage = ({ recipe }: { recipe: Recipe }) => {
  const l = useLocalized()

  return (
    <RecipeLayout
      variant="view"
      header={
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{l(recipe.title)}</h1>
          <p className="px-6 text-(--text-secondary)">{l(recipe.description)}</p>
        </div>
      }
      details={<RecipeDetailsCard {...recipe.details} />}
      ingredients={<RecipeIngredientsSection ingredients={recipe.ingredients} />}
      preparation={<RecipePreparationSection steps={recipe.steps} />}
    />
  )
}

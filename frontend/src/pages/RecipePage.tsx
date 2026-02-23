import { RecipeDetailsCard } from "@/components/recipes/RecipeDetailsCard"
import { RecipeIngredientsSection } from "@/components/recipes/RecipeIngredientsSection"
import { RecipePreparationSection } from "@/components/recipes/RecipePreparationSection"
import { RecipeLayout } from "@/components/layout/RecipeLayout"
import type { Recipe } from "@/types/recipe"

export const RecipePage = ({ recipe }: { recipe: Recipe }) => {
  return (
    <RecipeLayout
      header={
        <div className="space-y-4 text-center">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{recipe.title}</h1>
          <p className="px-6 text-(--text-secondary)">{recipe.description}</p>
        </div>
      }
      details={<RecipeDetailsCard {...recipe.details} />}
      ingredients={<RecipeIngredientsSection ingredients={recipe.ingredients} />}
      preparation={<RecipePreparationSection steps={recipe.steps} />}
    />
  )
}

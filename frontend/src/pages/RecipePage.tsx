// import { useState } from "react"
// import { useTranslation } from "react-i18next"
import { RecipeDetailsCard } from "@/components/recipes/RecipeDetailsCard"
import { RecipeIngredientsSection } from "@/components/recipes/RecipeIngredientsSection"
import { RecipePreparationSection } from "@/components/recipes/RecipePreparationSection"
import type { Recipe } from "@/types/recipe"

export const RecipePage = ({ recipe }: {recipe: Recipe}) => {
  return (
    <div className="mx-auto max-w-5xl">
      <article className="overflow-hidden rounded-xl border border-(--border-muted)! shadow-[0_0_6px_var(--shadow-color)]">
        <header className="border-b p-8">
          <div className="flex flex-col gap-6 md:flex-col md:items-start md:justify-between">
            <div className="space-y-3 text-center">
              <h1 className="text-3xl font-bold tracking-tight md:text-4xl">{recipe.title}</h1>
              <p className="text-(--text-secondary) px-6">{recipe.description}</p>
            </div>
            <RecipeDetailsCard {...recipe.details} />
          </div>
        </header>

        <div className="py-10 px-16">
          <div className="float-left mr-8 mb-3 w-full md:w-85">
            <RecipeIngredientsSection ingredients={recipe.ingredients} />
          </div>
          <RecipePreparationSection steps={recipe.steps} />
        </div>
      </article>
    </div>
  )
}
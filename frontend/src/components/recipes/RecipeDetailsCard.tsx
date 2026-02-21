import type { RecipeDetails } from "@/types/recipe"

export function RecipeDetailsCard(details: RecipeDetails) {
  return (
    <div className="flex flex-wrap justify-between w-full rounded-xl bg-(--bg-secondary) p-4 gap-4 md:flex-nowrap">
      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">Author</p>
        <p className="font-medium">{details.author}</p>
      </div>

      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">Rating</p>
        <p className="font-medium text-(--accent-primary)">{details.rating.value} / 10</p>
      </div>

      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">Portions</p>
        <p className="font-medium">{details.portions}</p>
      </div>

      <div className="flex-1 min-w-25 flex flex-col items-center text-center space-y-1">
        <p className="text-(--text-muted) text-sm border-b border-(--border-muted) inline-block ">Updated</p>
        <p className="font-medium">{new Date(details.lastUpdated).toLocaleDateString()}</p>
      </div>
    </div>
  )
}
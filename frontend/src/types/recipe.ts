export type IngredientItem = {
  name: string
  amount: number
  unit: string
  notes: string | null
}

export type IngredientCategory = {
  position: number
  title: string | null
  items: IngredientItem[]
}

export type Step = {
  position: number
  title?: string
  description: string
}

export type Rating = {
  value: number
  votes: number
  requesterVoted: boolean
}

export type RecipeDetails = {
  author: string
  basePortions: number
  lastUpdated: string
  rating: Rating
}

export type Recipe = {
  id: string
  title: string
  description: string
  details: RecipeDetails
  ingredients: IngredientCategory[]
  steps: Step[]
}

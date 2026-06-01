// RECIPE VIEW SCHEMA, FORM SCHEMA IS DYNAMICALLY GENERATED ELSEWHERE

export type LocalizedString = {
  en: string
  pl: string
}

export type IngredientItem = {
  position: number
  name: LocalizedString
  amount: number
  unit: LocalizedString
  notes: LocalizedString | null
}

export type IngredientCategory = {
  position: number
  title: LocalizedString | null
  items: IngredientItem[]
}

export type Step = {
  position: number
  title?: LocalizedString
  description: LocalizedString
}

export type Rating = {
  value: number
  votes: number
  requesterVoted: boolean
}

export type RecipeDetails = {
  author: string
  primaryLang: string
  servings: number
  lastUpdated: string
  rating: Rating
}

export type Recipe = {
  id: string
  title: LocalizedString
  description: LocalizedString
  details: RecipeDetails
  ingredients: IngredientCategory[]
  steps: Step[]
}

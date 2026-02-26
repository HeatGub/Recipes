export const MIN_IDENTIFIER_LEN = 2
export const MAX_IDENTIFIER_LEN = 100
export const MIN_PASSWORD_LEN = 3
export const MAX_PASSWORD_LEN = 128
export const USERNAME_REGEX = /^[\w.@+-]+$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const RECIPE = {
  TITLE: { MIN: 3, MAX: 50, FORBIDDEN_CHARS: /[<>[\]{}|\\^~`$%]/ },
  DESCRIPTION: { MIN: 1, MAX: 500, FORBIDDEN_CHARS: /[<>[\]{}|\\^~`$%]/ },
  SERVINGS: { MIN: 1, MAX: 10000 },
  INGREDIENTS: {
    CATEGORY: {
      TITLE: { MIN: 0, MAX: 50 },
    },
    ITEM: {
      AMOUNT: { MIN: 0.01, MAX: 10000 },
      UNIT: { MIN: 1, MAX: 10 },
      NAME: { MIN: 2, MAX: 30 },
      NOTES: { MIN: 2, MAX: 50 },
    },
  },
  PREPARATION_STEPS: {
    TITLE: { MIN: 0, MAX: 50 },
    DESCRIPTION: { MIN: 5, MAX: 1000 },
  },
}

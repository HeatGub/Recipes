export const MIN_IDENTIFIER_LEN = 2
export const MAX_IDENTIFIER_LEN = 100
export const MIN_PASSWORD_LEN = 3
export const MAX_PASSWORD_LEN = 128
export const USERNAME_REGEX = /^[\w.@+-]+$/
export const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
export const RECIPE = {
    TITLE: {MIN: 3, MAX:50, FORBIDDEN_CHARS: /[<>[\]{}|\\^~`$%]/},
    DESCRIPTION: {MIN: 1, MAX:500, FORBIDDEN_CHARS: /[<>[\]{}|\\^~`$%]/},
    SERVINGS: {MIN: 1, MAX:10000}
}
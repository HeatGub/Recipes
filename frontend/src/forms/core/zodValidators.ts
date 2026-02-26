import { rhfMessage } from "@/forms/core/apiErrors"
import type { RefinementCtx } from "zod"

// This file exists because this seems to be the best way of handling zod v4 parametrised i18n messages

export function stringRequired(code = "VALIDATION.REQUIRED_SHORT") {
  return (val: string | undefined, ctx: RefinementCtx) => {
    if (val === undefined || val.trim() === "") {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({ code }),
      })
    }
  }
}

export function minString(min: number, code = "VALIDATION.STRING_MIN") {
  return (val: string | undefined, ctx: RefinementCtx) => {
    if (!val) return

    if (val.length < min) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({ code, params: { min } }),
      })
    }
  }
}

export function maxString(max: number, code = "VALIDATION.STRING_MAX") {
  return (val: string | undefined, ctx: RefinementCtx) => {
    if (!val) return

    if (val.length > max) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({ code, params: { max } }),
      })
    }
  }
}

export function forbiddenCharacters(pattern: RegExp, code = "VALIDATION.FORBIDDEN_CHARACTERS") {
  return (val: string | undefined, ctx: RefinementCtx) => {
    if (!val) return

    const matches = val.match(new RegExp(pattern.source, "gu"))

    if (matches) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({
          code,
          params: { chars: [...new Set(matches)].join(" ") },
        }),
      })
    }
  }
}

export function numberRequired(code = "VALIDATION.REQUIRED_NUMBER") {
  return (val: number | undefined, ctx: RefinementCtx) => {
    if (val === undefined || val === null) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({ code }),
      })
    }
  }
}

export function minNumber(min: number, code = "VALIDATION.NUMBER_MIN") {
  return (val: number | undefined, ctx: RefinementCtx) => {
    if (val === undefined || val === null) return

    if (val < min) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({ code, params: { min } }),
      })
    }
  }
}

export function maxNumber(max: number, code = "VALIDATION.NUMBER_MAX") {
  return (val: number | undefined, ctx: RefinementCtx) => {
    if (val === undefined || val === null) return

    if (val > max) {
      ctx.addIssue({
        code: "custom",
        message: rhfMessage({ code, params: { max } }),
      })
    }
  }
}
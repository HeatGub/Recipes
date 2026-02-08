import type {
  UseFormSetError,
  FieldValues,
} from "react-hook-form"

import { rhfMessage } from "./apiErrors"
import type { ApiErrors } from "./apiErrors"

export function applyApiErrorsToForm<T extends FieldValues>(
  err: unknown,
  setError: UseFormSetError<T>
) {
  if (
    typeof err === "object" &&
    err !== null &&
    "errors" in err &&
    typeof (err as any).errors === "object"
  ) {
    const apiErrors = (err as { errors: ApiErrors }).errors

    for (const [field, fieldErrors] of Object.entries(apiErrors)) {
      if (!Array.isArray(fieldErrors) || !fieldErrors[0]) continue

      const target = field === "_global" ? "root" : field

      setError(target as any, {
        type: "server",
        message: rhfMessage(fieldErrors[0]),
      })
    }

    return true
  }

  return false
}

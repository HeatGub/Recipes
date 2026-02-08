export interface ApiError {
  code: string
  params?: Record<string, any>
}

export interface ApiErrors {
  [field: string]: ApiError[]
}

export function rhfMessage(error: ApiError): string {
  return error as unknown as string
}

export function getApiError(message: unknown): ApiError | null {
  if (!message) return null

  if (typeof message === "object" && message !== null && "code" in message) {
    return message as ApiError
  }

  if (typeof message === "string") {
    return { code: message }
  }

  return null
}

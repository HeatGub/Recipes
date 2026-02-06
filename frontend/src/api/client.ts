import axios, { AxiosError } from "axios"
import type { AxiosRequestConfig, AxiosResponse } from "axios"

export interface ApiFieldError {
  code: string
  params?: Record<string, any>
}

export type ApiErrors = Record<string, ApiFieldError[]>

type ApiResponse<TPayload = any> = {
  success: boolean
  code: string
  message?: string | null
  payload: TPayload
  errors?: ApiErrors
  meta?: Record<string, any>
}

interface RetryAxiosRequestConfig extends AxiosRequestConfig {
  _retry?: boolean
}

// Memory storage for access token
let accessToken: string | null = null
// Lock to prevent multiple simultaneous refresh requests
let refreshTokenPromise: Promise<string> | null = null

export const setAccessToken = (token: string | null) => {
  accessToken = token
}

// Axios instance with credentials enabled
export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true, // send HttpOnly cookies (refresh token)
})

// Dedicated axios instance for token refresh to avoid recursion
const refreshTokenApi = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true,
})

// Add access token to outgoing requests
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Handle responses globally
api.interceptors.response.use(handleResponseSuccess, handleResponseError)

function handleResponseSuccess(response: AxiosResponse) {
  console.log("✅", response.data)
  return response
}

async function handleResponseError(error: AxiosError): Promise<any> {
  const originalRequest = error.config as RetryAxiosRequestConfig

  const data = error.response?.data as ApiResponse<any> | undefined

  // Only handle 401 errors with valid response data
  if (!originalRequest || error.response?.status !== 401) {
    return Promise.reject(error.response?.data)
  }

  const code = data?.code
  const shouldRefresh = code === "TOKEN.GENERIC_ERROR"

  // Not eligible for refresh  → propagate backend errors
  if (originalRequest.url?.includes("/auth/token/refresh/") || !shouldRefresh) {
    console.log("❌", error.response.data)
    return Promise.reject(error.response?.data)
  }

  // Prevent multiple retries of the same request
  if (originalRequest._retry) {
    setAccessToken(null)
    return Promise.reject(error.response?.data)
  }
  originalRequest._retry = true

  try {
    // 🔐 Start refresh if not already running
    if (!refreshTokenPromise) {
      refreshTokenPromise = refreshTokenApi
        .post("/auth/token/refresh/")
        .then((res) => {
          const data = res.data as ApiResponse<{ access_token: string }>
          const token = data?.payload?.access_token
          if (!token) throw new Error("No access token returned from refresh")
          setAccessToken(token)
          return token
        })
        .finally(() => {
          refreshTokenPromise = null
        })
    }

    // Wait for refresh to complete
    const newToken = await refreshTokenPromise

    // Retry original request with new token
    originalRequest.headers = originalRequest.headers ?? {}
    originalRequest.headers.Authorization = `Bearer ${newToken}`
    return api(originalRequest)
  } catch (refreshError) {
    refreshTokenPromise = null
    setAccessToken(null)
    return Promise.reject(refreshError)
  }
}

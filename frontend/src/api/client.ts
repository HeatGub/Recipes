import axios, { AxiosError } from "axios"

// Memory storage for access token
let accessToken: string | null = null
// Lock to prevent multiple simultaneous refresh requests
let isRefreshing = false

// Setter for access token
export const setAccessToken = (token: string | null) => {
  accessToken = token
}

// Axios instance with credentials enabled
export const api = axios.create({
  baseURL: "http://localhost:8000/api/v1/",
  withCredentials: true, // send HttpOnly cookies (refresh token)
})

// Add access token to outgoing requests
api.interceptors.request.use((config) => {
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`
  }
  return config
})

// Handle responses globally
api.interceptors.response.use(
  (res) => res, // pass data

  async (error: AxiosError) => {
    // ON ERROR
    const originalRequest = error.config

    // Only handle 401 errors
    if (!originalRequest || error.response?.status !== 401) {
      return Promise.reject(error)
    }

    // 🚨 1. Do not retry refresh endpoint to avoid infinite loops
    if (originalRequest.url?.includes("/auth/token/refresh/")) {
      setAccessToken(null)
      return Promise.reject(error)
    }

    // 🚨 2. Prevent infinite retry loop for the same request
    if ((originalRequest as any)._retry) {
      setAccessToken(null)
      return Promise.reject(error)
    }
    ;(originalRequest as any)._retry = true

    try {
      // 🚨 3. Prevent parallel refresh storms
      if (!isRefreshing) {
        isRefreshing = true
        // Call the same refresh URL as before
        const res = await api.post("/auth/token/refresh/")
        setAccessToken(res.data.data.access)
        isRefreshing = false
      }

      // Attach the new access token and retry original request
      originalRequest.headers.Authorization = `Bearer ${accessToken}`
      return api(originalRequest)
    } catch (refreshError) {
      // Failed to refresh → clear token and propagate error
      isRefreshing = false
      setAccessToken(null)
      return Promise.reject(refreshError)
    }
  }
)

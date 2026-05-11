import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// ── Base URL ───────────────────────────────────────────────────────────────────
// Exported so auth.api.ts can build the CSRF URL from the same source of truth.
export const BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000'

let _onUnauthorized: () => void = () => {}
export function configureAxios(options: { onUnauthorized: () => void }): void {
  _onUnauthorized = options.onUnauthorized
}

const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,
  timeout: 15_000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  withCredentials: true,
  withXSRFToken:   true,
  xsrfCookieName: 'XSRF-TOKEN',
  xsrfHeaderName: 'X-XSRF-TOKEN',
})

// ── Response Interceptor — Handle 401 globally ─────────────────────────────────

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status
    const reqUrl = error.config?.url ?? ''

    // Don't auto-logout on login/csrf requests — let the component handle the error
    const isAuthRequest = reqUrl.includes('/auth/login') || reqUrl.includes('/csrf-cookie')

    if (status === 401 && !isAuthRequest) {
      // Session expired → delegate to application layer
      _onUnauthorized()
    }

    return Promise.reject(error)
  },
)

export default api

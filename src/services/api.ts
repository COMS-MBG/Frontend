import axios from 'axios'
import type { AxiosInstance, AxiosResponse, AxiosError } from 'axios'

// ── Base URL ──────────────────────────────────────────────────────────────────
// Sesuaikan di .env: VITE_API_URL=http://localhost:8000
const BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:8000'

// ── Axios Instance ────────────────────────────────────────────────────────────
const api: AxiosInstance = axios.create({
  baseURL: `${BASE_URL}/api`,

  withCredentials: true,

  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
  timeout: 15_000,
})

api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    const status = error.response?.status

    if (status === 401) {
      // Sesi berakhir atau belum login → paksa redirect ke halaman login
      if (window.location.pathname !== '/login') {
        window.location.href = '/login'
      }
    }

    if (status === 419) {
      // CSRF token mismatch (sesi mungkin expired) → reload untuk mendapatkan
      // CSRF cookie baru
      window.location.reload()
    }

    return Promise.reject(error)
  }
)

export default api

export async function initCsrf(): Promise<void> {
  await axios.get(`${BASE_URL}/sanctum/csrf-cookie`, {
    withCredentials: true,
  })
}

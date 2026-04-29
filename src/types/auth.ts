// ── Auth Types ──────────────────────────────────────────────────────────────

/** Data user yang dikembalikan oleh API */
export interface User {
  id: number
  name: string
  email: string
  role: 'admin' | 'operator' | 'viewer'
  avatar?: string
}

/** Payload yang dikirim saat login */
export interface LoginCredentials {
  email: string
  password: string
  remember?: boolean
}

/**
 * Response sukses dari endpoint login (Laravel Sanctum SPA).
 *
 * Sanctum SPA auth tidak mengembalikan token — autentikasi dikelola
 * sepenuhnya via session cookie yang di-set oleh server.
 * Yang dikembalikan hanyalah data user yang baru saja masuk.
 */
export interface LoginResponse {
  user: User
}

/** Wrapper generic untuk semua response API */
export interface ApiResponse<T = unknown> {
  data: T
  message: string
  status: number
}

/** State untuk auth store */
export interface AuthState {
  user: User | null
  isLoading: boolean
  error: string | null
}

import api, { BASE_URL } from '@/api/axios'
import type {
  LoginRequest,
  LoginResponse,
  LogoutResponse,
  UserResponse,
} from '@/types/auth'

export const authApi = {
  async getCsrfCookie(): Promise<void> {
    await api.get('/sanctum/csrf-cookie', {
      baseURL: BASE_URL,
    })
  },

  async login(payload: LoginRequest): Promise<LoginResponse> {
    const { data } = await api.post<LoginResponse>('/auth/login', payload)
    return data
  },

  async getUser(): Promise<UserResponse> {
    const { data } = await api.get<UserResponse>('/auth/user')
    return data
  },

  async logout(): Promise<LogoutResponse> {
    const { data } = await api.post<LogoutResponse>('/auth/logout')
    return data
  },
}

// ── Named exports for backward compatibility ───────────────────────────────────

export const loginApi      = authApi.login
export const logoutApi     = authApi.logout
export const getProfileApi = authApi.getUser

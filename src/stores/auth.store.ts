import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { User, LoginRequest, RoleName, LoginErrorResponse, ValidationErrorResponse } from '@/types/auth'
import { authApi } from '@/api/auth.api'
import { storageService } from '@/services/storageService'
import type { AxiosError } from 'axios'

export const useAuthStore = defineStore('auth', () => {
  // ── State ───────────────────────────────────────────────────────────────────
  const user        = ref<User | null>(null)
  const isLoading   = ref(false)
  const initialized = ref(false)
  const error       = ref<string | null>(null)

  // ── Getters ─────────────────────────────────────────────────────────────────

  const isAuthenticated = computed(() => !!user.value)
  const userName = computed(() => user.value?.name ?? '')

  /** @deprecated Use userName instead */
  const fullName = computed(() => user.value?.name ?? '')

  /** Display role label for navbar — reads flat role_name from API */
  const userRole = computed<string | null>(() => user.value?.role_name ?? null)

  /** Flat permission slugs — reads user.permissions from API */
  const userPermissions = computed<string[]>(() => user.value?.permissions ?? [])

  /** Role identifiers list (kept for backward compat) */
  const userRoles = computed<string[]>(() => {
    if (!user.value) return []
    return user.value.role_type ? [user.value.role_type] : []
  })

  /** Whether the user is super_admin (bypasses all RBAC) */
  const isSuperAdmin = computed(() => user.value?.role_type === 'super_admin')

  /** Alias for backward compatibility */
  const loading = computed(() => isLoading.value)

  // ── RBAC Helper Functions ───────────────────────────────────────────────────

  function hasPermission(permission: string): boolean {
    if (isSuperAdmin.value) return true
    return userPermissions.value.includes(permission)
  }

  function hasAnyPermission(permissions: string[]): boolean {
    if (isSuperAdmin.value) return true
    return permissions.some(p => userPermissions.value.includes(p))
  }

  function hasRole(...roles: RoleName[]): boolean {
    if (!user.value) return false
    if (isSuperAdmin.value && roles.includes('super_admin' as RoleName)) return true
    return roles.some(r => r === user.value?.role_type)
  }

  function hasAnyRole(roles: RoleName[]): boolean {
    return hasRole(...roles)
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function login(payload: LoginRequest): Promise<void> {
    try {
      isLoading.value = true
      error.value     = null

      try {
        await authApi.getCsrfCookie()
      } catch (csrfErr: unknown) {
        const msg = _isAxiosError(csrfErr) && !csrfErr.response
          ? 'Tidak dapat terhubung ke server. Pastikan backend Laravel sudah berjalan (php artisan serve).'
          : 'Gagal mengambil CSRF token. Silakan coba lagi.'
        error.value = msg
        throw csrfErr
      }

      const response = await authApi.login(payload)

      user.value = response.user
      storageService.setLoggedIn(true)
      storageService.setUser(response.user)
      initialized.value = true
    } catch (err: unknown) {
      if (!error.value) {
        clearAuth()
        _handleError(err)
      }
      throw err
    } finally {
      isLoading.value = false
    }
  }

  async function fetchUser(): Promise<User> {
    const response = await authApi.getUser()
    user.value = response.user
    storageService.setUser(response.user)
    return response.user
  }

  async function restoreSession(): Promise<void> {
    if (initialized.value) return

    if (!storageService.isLoggedIn()) {
      initialized.value = true
      return
    }

    const cached = storageService.getUser<User>()
    if (cached) {
      user.value = cached
    }

    try {
      isLoading.value = true
      await fetchUser()
    } catch {
      clearAuth()
    } finally {
      isLoading.value   = false
      initialized.value = true
    }
  }

  async function logout(): Promise<void> {
    try {
      isLoading.value = true
      await authApi.logout()
    } catch {
      // Even if server fails, always clear local state
    } finally {
      clearAuth()
      isLoading.value = false
    }
  }

  function clearAuth(): void {
    user.value  = null
    error.value = null
    storageService.clearAuth()
  }

  function clearError(): void {
    error.value = null
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  function _handleError(err: unknown): void {
    if (_isAxiosError(err)) {
      if (!err.response) {
        error.value = 'Tidak dapat terhubung ke server. Pastikan backend Laravel sudah berjalan.'
        return
      }

      const status = err.response?.status

      if (status === 401) {
        const body = err.response?.data as LoginErrorResponse | undefined
        error.value = body?.message || 'Email atau password salah'
      } else if (status === 403) {
        const body = err.response?.data as LoginErrorResponse | undefined
        error.value = body?.message || 'Akun Anda telah dinonaktifkan. Hubungi administrator.'
      } else if (status === 419) {
        error.value = 'Sesi CSRF kedaluwarsa. Silakan muat ulang halaman dan coba lagi.'
      } else if (status === 422) {
        const body = err.response?.data as ValidationErrorResponse | undefined
        if (body?.errors) {
          error.value = Object.values(body.errors).flat().join(' ')
        } else {
          error.value = body?.message || 'Data yang dikirim tidak valid.'
        }
      } else if (status === 429) {
        error.value = 'Terlalu banyak percobaan. Silakan coba lagi nanti.'
      } else {
        const body = err.response?.data as { message?: string } | undefined
        error.value = body?.message || 'Terjadi kesalahan pada server.'
      }
    } else if (err instanceof Error) {
      error.value = err.message
    } else {
      error.value = 'Terjadi kesalahan yang tidak diketahui.'
    }
  }

  function _isAxiosError(err: unknown): err is AxiosError {
    return typeof err === 'object' && err !== null && 'isAxiosError' in err
  }

  // ── Public API ──────────────────────────────────────────────────────────────

  return {
    // State
    user,
    isLoading,
    loading,
    initialized,
    error,
    // Getters
    isAuthenticated,
    userName,
    fullName,
    userRole,
    userRoles,
    userPermissions,
    isSuperAdmin,
    // Actions
    login,
    logout,
    fetchUser,
    restoreSession,
    clearAuth,
    clearError,
    // RBAC Helpers
    hasPermission,
    hasAnyPermission,
    hasRole,
    hasAnyRole,
  }
})

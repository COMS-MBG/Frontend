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

  /** Derived from user existence — the server session is the real auth */
  const isAuthenticated = computed(() => !!user.value)

  /** User display name */
  const userName = computed(() => user.value?.name ?? '')

  /** @deprecated Use userName instead */
  const fullName = computed(() => user.value?.name ?? '')

  /** Primary role name (first role) */
  const userRole = computed<RoleName | null>(() => {
    return (user.value?.roles?.[0]?.name as RoleName) ?? null
  })

  /** All permission names the user has (flattened) */
  const userPermissions = computed<string[]>(() => {
    if (!user.value?.roles) return []
    return user.value.roles
      .flatMap(role => role.permissions)
      .map(p => p.name)
  })

  /** All role names the user has */
  const userRoles = computed<string[]>(() =>
    user.value?.roles?.map(r => r.name) ?? [],
  )

  /** Whether the user has the super_admin role */
  const isSuperAdmin = computed(() =>
    user.value?.roles?.some(r => r.name === 'super_admin') ?? false,
  )

  /** Alias for backward compatibility */
  const loading = computed(() => isLoading.value)

  // ── RBAC Helper Functions ───────────────────────────────────────────────────

  function hasPermission(permission: string): boolean {
    return userPermissions.value.includes(permission)
  }

  function hasAnyPermission(permissions: string[]): boolean {
    return permissions.some(p => userPermissions.value.includes(p))
  }

  function hasRole(...roles: RoleName[]): boolean {
    if (!user.value?.roles) return false
    return user.value.roles.some(r => roles.includes(r.name as RoleName))
  }

  function hasAnyRole(roles: RoleName[]): boolean {
    if (!user.value?.roles) return false
    return user.value.roles.some(r => roles.includes(r.name as RoleName))
  }

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function login(payload: LoginRequest): Promise<void> {
    try {
      isLoading.value = true
      error.value     = null

      // Step 1: Obtain CSRF token cookie
      try {
        await authApi.getCsrfCookie()
      } catch (csrfErr: unknown) {
        // ERR_CONNECTION_REFUSED or network error → backend is down
        const msg = _isAxiosError(csrfErr) && !csrfErr.response
          ? 'Tidak dapat terhubung ke server. Pastikan backend Laravel sudah berjalan (php artisan serve).'
          : 'Gagal mengambil CSRF token. Silakan coba lagi.'
        error.value = msg
        throw csrfErr
      }

      // Step 2: Authenticate — server sets session cookie
      const response = await authApi.login(payload)

      // Step 3: Populate state
      user.value = response.user
      storageService.setLoggedIn(true)
      storageService.setUser(response.user)
      initialized.value = true
    } catch (err: unknown) {
      // Only handle if error wasn't already set by CSRF catch block
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

    // No session hint → skip network call
    if (!storageService.isLoggedIn()) {
      initialized.value = true
      return
    }

    // Pre-populate from cache for instant UI rendering
    const cached = storageService.getUser<User>()
    if (cached) {
      user.value = cached
    }

    // Validate session against server
    try {
      isLoading.value = true
      await fetchUser()
    } catch {
      // Session expired or invalid — clean up
      clearAuth()
    } finally {
      isLoading.value   = false
      initialized.value = true
    }
  }

  /** Logout flow. */
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

  /** Removes all auth data from state AND browser storage. */
  function clearAuth(): void {
    user.value  = null
    error.value = null
    storageService.clearAuth()
  }

  /** Clear the error message */
  function clearError(): void {
    error.value = null
  }

  // ── Private Helpers ─────────────────────────────────────────────────────────

  function _handleError(err: unknown): void {
    if (_isAxiosError(err)) {
      // Network error — no response received at all.
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

import { computed } from 'vue'
import { useAuthStore } from '@/stores/auth.store'
import type { LoginRequest, RoleName } from '@/types/auth'

export function useAuth() {
  const store = useAuthStore()

  // ── State (read-only) ───────────────────────────────────────────────────────
  const user            = computed(() => store.user)
  const isAuthenticated = computed(() => store.isAuthenticated)
  const isLoading       = computed(() => store.isLoading)
  const error           = computed(() => store.error)
  const isSuperAdmin    = computed(() => store.isSuperAdmin)
  const userName        = computed(() => store.userName)
  const userRole        = computed(() => store.userRole)
  const userPermissions = computed(() => store.userPermissions)

  // ── Actions ─────────────────────────────────────────────────────────────────

  async function login(payload: LoginRequest) {
    return store.login(payload)
  }

  async function logout() {
    return store.logout()
  }

  function clearError() {
    store.clearError()
  }

  // ── Permission Checks (delegated to store) ──────────────────────────────────

  function checkRole(...roles: RoleName[]): boolean {
    return store.hasRole(...roles)
  }

  function checkAnyRole(roles: RoleName[]): boolean {
    return store.hasAnyRole(roles)
  }

  function checkPermission(permission: string): boolean {
    return store.hasPermission(permission)
  }

  function checkAnyPermission(permissions: string[]): boolean {
    return store.hasAnyPermission(permissions)
  }

  // ── Convenience Computed ────────────────────────────────────────────────────

  const canManageEmployees = computed(() =>
    store.hasPermission('employee.create') || store.hasPermission('employee.update'),
  )

  const canViewFinance = computed(() => store.hasPermission('finance.read'))

  const canManageNutrition = computed(() =>
    store.hasPermission('ingredients.create') || store.hasPermission('ingredients.update'),
  )

  const canManageDistribution = computed(() =>
    store.hasPermission('distribution.create') || store.hasPermission('distribution.update'),
  )

  const canManagePartner = computed(() =>
    store.hasPermission('partner.create') || store.hasPermission('partner.update'),
  )

  const canViewReport = computed(() => store.hasPermission('report.read'))

  // ── Public API ──────────────────────────────────────────────────────────────

  return {
    // State
    user,
    isAuthenticated,
    isLoading,
    error,
    isSuperAdmin,
    userName,
    userRole,
    userPermissions,
    // Actions
    login,
    logout,
    clearError,
    // Permission checks
    checkRole,
    checkAnyRole,
    checkPermission,
    checkAnyPermission,
    // Convenience
    canManageEmployees,
    canViewFinance,
    canManageNutrition,
    canManageDistribution,
    canManagePartner,
    canViewReport,
  }
}

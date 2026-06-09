import type { Router } from 'vue-router'
import { useAuthStore } from '@/stores/auth.store'
import type { RoleName } from '@/types/auth'

export function setupAuthGuard(router: Router): void {
  router.beforeEach(async (to, _from, next) => {
    const authStore = useAuthStore()

    // ── Restore session once ────────────────────────────────────────
    if (!authStore.initialized) {
      await authStore.restoreSession()
    }

    const isAuth       = authStore.isAuthenticated
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const guestOnly    = to.matched.some(record => record.meta.guestOnly)

    // ── Protected route — not authenticated ─────────────────────────
    if (requiresAuth && !isAuth) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    // ── Guest-only route — already authenticated ────────────────────
    if (guestOnly && isAuth) {
      const defaultRoute = authStore.isSuperAdmin ? 'super-admin-dashboard' : 'dashboard'
      return next({ name: defaultRoute })
    }

    // ── Redirect super_admin away from regular dashboard ────────────
    if (isAuth && authStore.isSuperAdmin && to.path.startsWith('/dashboard')) {
      if (to.name === 'profile') {
        return next({ name: 'sa-profile' })
      }
      if (to.name === 'settings') {
        return next({ name: 'sa-settings' })
      }
      return next({ name: 'super-admin-dashboard' })
    }

    // ── Authenticated but no user data → fetch from server ──────────
    if (isAuth && !authStore.user) {
      try {
        await authStore.fetchUser()
      } catch {
        authStore.clearAuth()
        return next({ name: 'login' })
      }
    }

    // ── Role-based route guard ──────────────────────────────────────
    if (to.meta.roles && authStore.user) {
      const allowedRoles = to.meta.roles as RoleName[]
      if (!authStore.hasRole(...allowedRoles)) {
        const hasUnauthorizedRoute = router.getRoutes().some(r => r.name === 'unauthorized')
        return next({ name: hasUnauthorizedRoute ? 'unauthorized' : 'dashboard' })
      }
    }

    // ── Permission-based route guard ────────────────────────────────
    if (to.meta.requiredPermission && authStore.isAuthenticated) {
      const hasPermission = authStore.hasPermission(to.meta.requiredPermission as string)
      if (!hasPermission) {
        return next({ name: 'unauthorized' })
      }
    }

    next()
  })
}

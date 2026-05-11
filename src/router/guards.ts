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
      return next({ name: 'dashboard' })
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

    next()
  })
}

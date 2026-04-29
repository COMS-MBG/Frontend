import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginView          from '@/views/LoginView.vue'
import DashboardView      from '@/views/DashboardView.vue'
import ManajemenGiziView  from '@/views/ManajemenGiziView.vue'
import DistribusiView     from '@/views/DistribusiView.vue'
import MasterDataView     from '@/views/MasterDataView.vue'
import LaporanView        from '@/views/LaporanView.vue'
import SettingsView       from '@/views/SettingsView.vue'
import ProfileView        from '@/views/ProfileView.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AuthLayout,
    meta: { guestOnly: true },         // hanya untuk tamu (belum login)
    children: [
      { path: '',      redirect: '/login' },
      { path: 'login', name: 'login', component: LoginView },
    ],
  },

  {
    path: '/dashboard',
    component: MainLayout,
    meta: { requiresAuth: true },
    children: [
      { path: '',               name: 'dashboard',       component: DashboardView },
      { path: 'manajemen-gizi', name: 'manajemen-gizi',  component: ManajemenGiziView },
      { path: 'distribusi',     name: 'distribusi',      component: DistribusiView },
      { path: 'master-data',    name: 'master-data',     component: MasterDataView },
      { path: 'laporan',        name: 'laporan',         component: LaporanView },
      { path: 'profile',        name: 'profile',         component: ProfileView },
      { path: 'settings',       name: 'settings',        component: SettingsView },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ── Route Guard (Navigation Guard Global) ────────────────────────────────────
let isInitialized = false

router.beforeEach(
  async (
    to: RouteLocationNormalized,
    _from: RouteLocationNormalized,
    next: NavigationGuardNext
  ) => {
    const authStore = useAuthStore()

    // Hydrate store hanya sekali saat app pertama load
    if (!isInitialized) {
      await authStore.initialize()
      isInitialized = true
    }

    const isAuth = authStore.isAuthenticated

    // Route butuh auth → redirect ke login jika belum login
    const requiresAuth = to.matched.some(record => record.meta.requiresAuth)
    const guestOnly = to.matched.some(record => record.meta.guestOnly)

    if (requiresAuth && !isAuth) {
      return next({ name: 'login', query: { redirect: to.fullPath } })
    }

    if (guestOnly && isAuth) {
      return next({ name: 'dashboard' })
    }
    next()
  }
)

export default router
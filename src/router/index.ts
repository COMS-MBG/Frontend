import { createRouter, createWebHistory } from 'vue-router'
import type { RouteLocationNormalized, NavigationGuardNext } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginView          from '@/views/LoginView.vue'
import DashboardView      from '@/views/DashboardView.vue'
import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: AuthLayout,
    meta: { guestOnly: true },
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
      { path: '', name: 'dashboard', component: DashboardView },
      
      // Manajemen Gizi
      { path: 'master-resep', name: 'master-resep', component: () => import('@/views/gizi/MasterResepView.vue') },
      { path: 'master-bahan', name: 'master-bahan', component: () => import('@/views/gizi/MasterBahanView.vue') },
      { path: 'perencanaan-menu', name: 'perencanaan-menu', component: () => import('@/views/gizi/PerencanaanMenuView.vue') },
      { path: 'kalkulator-gizi/:id?', name: 'kalkulator-gizi', component: () => import('@/views/gizi/KalkulatorGiziView.vue'), meta: { activeMenu: 'master-resep' } },

      // Distribusi
      { path: 'jadwal-pengiriman', name: 'jadwal-pengiriman', component: () => import('@/views/distribusi/JadwalPengirimanView.vue') },
      { path: 'peta-spasial', name: 'peta-spasial', component: () => import('@/views/distribusi/PetaSpasialView.vue') },

      // Standalone
      { path: 'master-data', name: 'master-data', component: () => import('@/views/MasterDataView.vue') },
      { path: 'laporan', name: 'laporan', component: () => import('@/views/LaporanView.vue') },
      { path: 'profile', name: 'profile', component: () => import('@/views/ProfileView.vue') },
      { path: 'settings', name: 'settings', component: () => import('@/views/SettingsView.vue') },
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
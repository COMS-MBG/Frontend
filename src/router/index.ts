import { createRouter, createWebHistory } from 'vue-router'
import type { RouteRecordRaw } from 'vue-router'
import { setupAuthGuard } from '@/router/guards'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'
import LoginView      from '@/views/auth/LoginView.vue'
import DashboardView  from '@/views/dashboard/DashboardView.vue'

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
      
      // ── Manajemen Gizi ──
      { path: 'master-resep', name: 'master-resep', component: () => import('@/views/gizi/MasterResepView.vue') },
      { path: 'master-bahan', name: 'master-bahan', component: () => import('@/views/gizi/MasterBahanView.vue') },
      { path: 'perencanaan-menu', name: 'perencanaan-menu', component: () => import('@/views/gizi/MenuPlanningView.vue') },
      { path: 'kalkulator-gizi/:id?', name: 'kalkulator-gizi', component: () => import('@/views/gizi/KalkulatorGiziView.vue'), meta: { activeMenu: 'master-resep' } },

      // ── Distribusi ──
      { path: 'distribusi', name: 'distribusi', component: () => import('@/views/distribusi/DistribusiView.vue') },
      { path: 'jadwal-pengiriman', name: 'jadwal-pengiriman', component: () => import('@/views/distribusi/JadwalPengirimanView.vue') },
      { path: 'peta-spasial', name: 'peta-spasial', component: () => import('@/views/distribusi/PetaSpasialView.vue') },

      // ── Laporan ──
      { path: 'laporan', name: 'laporan', component: () => import('@/views/laporan/LaporanView.vue') },
      { path: 'laporan-keuangan', name: 'laporan-keuangan', component: () => import('@/views/laporan/LaporanKeuanganView.vue') },

      // ── User ──
      { path: 'profile', name: 'profile', component: () => import('@/views/user/ProfileView.vue') },

      // ── Settings ──
      { path: 'settings', name: 'settings', component: () => import('@/views/settings/SettingsView.vue') },

      // ── HR (Karyawan) ──
      { path: 'karyawan', name: 'karyawan', component: () => import('@/views/hr/EmployeeView.vue') },
      { path: 'hak-akses', name: 'hak-akses', component: () => import('@/views/hr/EmployeeAccessView.vue') },
    ],
  },

  { path: '/:pathMatch(.*)*', redirect: '/login' },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

// ── Register auth guard ───────────────────────────────────────────────────────
setupAuthGuard(router)

export default router
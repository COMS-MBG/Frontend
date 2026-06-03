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
      {
        path: '',
        name: 'dashboard',
        component: DashboardView,
        meta: { requiredPermission: 'dashboard.read' },
      },

      // ── Manajemen Gizi ──
      {
        path: 'master-resep',
        name: 'master-resep',
        component: () => import('@/views/gizi/MasterResepView.vue'),
        meta: { requiredPermission: 'recipes.read' },
      },
      {
        path: 'master-bahan',
        name: 'master-bahan',
        component: () => import('@/views/gizi/MasterBahanView.vue'),
        meta: { requiredPermission: 'ingredients.read' },
      },
      {
        path: 'perencanaan-menu',
        name: 'perencanaan-menu',
        component: () => import('@/views/gizi/MenuPlanningView.vue'),
        meta: { requiredPermission: 'menus.read' },
      },
      {
        path: 'kalkulator-gizi/:id?',
        name: 'kalkulator-gizi',
        component: () => import('@/views/gizi/KalkulatorGiziView.vue'),
        meta: { activeMenu: 'master-resep', requiredPermission: 'recipes.read' },
      },

      // ── Distribusi ──
      {
        path: 'distribusi',
        name: 'distribusi',
        component: () => import('@/views/distribusi/DistribusiView.vue'),
        meta: { requiredPermission: 'distribution.read' },
      },
      {
        path: 'jadwal-pengiriman',
        name: 'jadwal-pengiriman',
        component: () => import('@/views/distribusi/JadwalPengirimanView.vue'),
        meta: { requiredPermission: 'distribution.read' },
      },
      {
        path: 'peta-spasial',
        name: 'peta-spasial',
        component: () => import('@/views/distribusi/PetaSpasialView.vue'),
        meta: { requiredPermission: 'distribution.read' },
      },
      {
        path: 'riwayat-pengiriman',
        name: 'riwayat-pengiriman',
        component: () => import('@/views/distribusi/RiwayatPengirimanView.vue'),
        meta: { requiredPermission: 'distribution.read' },
      },

      // ── Laporan ──
      {
        path: 'laporan',
        name: 'laporan',
        component: () => import('@/views/laporan/LaporanView.vue'),
        meta: { requiredPermission: 'report.read' },
      },
      {
        path: 'laporan-keuangan',
        name: 'laporan-keuangan',
        component: () => import('@/views/laporan/LaporanKeuanganView.vue'),
        meta: { requiredPermission: 'finance.read' },
      },

      // ── User ──
      { path: 'profile', name: 'profile', component: () => import('@/views/user/ProfileView.vue') },

      // ── Settings ──
      { path: 'settings', name: 'settings', component: () => import('@/views/settings/SettingsView.vue') },

      // ── HR (Karyawan) ──
      {
        path: 'karyawan',
        name: 'karyawan',
        component: () => import('@/views/hr/EmployeeView.vue'),
        meta: { requiredPermission: 'employee.read' },
      },
      {
        path: 'hak-akses',
        name: 'hak-akses',
        component: () => import('@/views/hr/EmployeeAccessView.vue'),
        meta: { requiredPermission: 'employee.update' },
      },
      {
        path: 'manajemen-role',
        name: 'roles',
        component: () => import('@/views/hr/RoleView.vue'),
        meta: { requiredPermission: 'employee.update' },
      },

      // ── Partner Management ──
      {
        path: 'sekolah-mitra',
        name: 'sekolah-mitra',
        component: () => import('@/views/partner/PartnerView.vue'),
        meta: { requiredPermission: 'partner.read' },
      },

      // ── Unauthorized ──
      {
        path: 'unauthorized',
        name: 'unauthorized',
        component: () => import('@/views/UnauthorizedView.vue'),
      },
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
import { createRouter, createWebHistory } from 'vue-router'

import AuthLayout from '@/layouts/AuthLayout.vue'
import MainLayout from '@/layouts/MainLayout.vue'

import LoginView from '@/views/LoginView.vue'
import DashboardView from '@/views/DashboardView.vue'
import ManajemenGiziView from '@/views/ManajemenGiziView.vue'
import DistribusiView from '@/views/DistribusiView.vue'
import MasterDataView from '@/views/MasterDataView.vue'
import LaporanView from '@/views/LaporanView.vue'
import SettingsView from '@/views/SettingsView.vue'

const routes = [
  // ── Auth routes (menggunakan AuthLayout) ──────────────────
  {
    path: '/',
    component: AuthLayout,
    children: [
      { path: '', redirect: '/login' },
      { path: 'login', component: LoginView }
    ]
  },

  // ── Main app routes (menggunakan MainLayout) ───────────────
  {
    path: '/dashboard',
    component: MainLayout,
    children: [
      { path: '',                component: DashboardView },
      { path: 'manajemen-gizi', component: ManajemenGiziView },
      { path: 'distribusi',     component: DistribusiView },
      { path: 'master-data',   component: MasterDataView },
      { path: 'laporan',        component: LaporanView },
      { path: 'settings',       component: SettingsView }
    ]
  }
]

export default createRouter({
  history: createWebHistory(),
  routes
})
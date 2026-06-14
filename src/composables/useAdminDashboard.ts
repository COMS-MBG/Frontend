import { ref } from 'vue'
import { getAdminDashboardStats } from '@/api/admin-dashboard.api'
import type { AdminDashboardData } from '@/types/admin-dashboard'

export function useAdminDashboard() {
  const dashboardData = ref<AdminDashboardData | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  async function loadDashboardData(): Promise<void> {
    isLoading.value = true
    error.value = null
    try {
      const res = await getAdminDashboardStats()
      dashboardData.value = res.data
    } catch (err: unknown) {
      error.value = err instanceof Error ? err.message : 'Gagal memuat data dashboard.'
    } finally {
      isLoading.value = false
    }
  }

  return {
    dashboardData,
    isLoading,
    error,
    loadDashboardData,
  }
}

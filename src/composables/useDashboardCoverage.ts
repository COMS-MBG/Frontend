import { ref } from 'vue'
import { getSchools } from '@/api/superadmin-school.api'

export function useDashboardCoverage() {
  const coverageData = ref({ served: 0, unserved: 0, percentage: 0 })
  const isLoadingCoverage = ref(false)

  async function fetchCoverage() {
    isLoadingCoverage.value = true
    try {
      const [totalRes, unservedRes] = await Promise.all([
        getSchools({ per_page: 1 }),
        getSchools({ per_page: 1, without_sppg: 1 })
      ])
      const total = totalRes.meta?.total || 0
      const unserved = unservedRes.meta?.total || 0
      const served = Math.max(0, total - unserved)
      const percentage = total > 0 ? Math.round((served / total) * 100) : 0
      coverageData.value = { served, unserved, percentage }
    } catch (err) {
      console.error('Error fetching coverage stats:', err)
    } finally {
      isLoadingCoverage.value = false
    }
  }

  return {
    coverageData,
    isLoadingCoverage,
    fetchCoverage
  }
}

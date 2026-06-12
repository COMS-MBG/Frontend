import { computed, type Ref } from 'vue'
import type { SppgItem } from '@/types/superadmin-sppg'

export function useDashboardDistribution(sppgs: Ref<SppgItem[]>) {
  const sppgDistribution = computed(() => {
    const cityMap: Record<string, number> = {}

    sppgs.value.forEach(s => {
      const city = s.region?.city || s.city || 'Lainnya'
      cityMap[city] = (cityMap[city] || 0) + 1
    })

    return Object.entries(cityMap)
      .map(([name, count]) => ({ name, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5)
  })

  return {
    sppgDistribution
  }
}

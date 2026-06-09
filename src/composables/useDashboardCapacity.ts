import { computed, type Ref } from 'vue'
import type { SppgItem } from '@/types/superadmin-sppg'

export function useDashboardCapacity(sppgs: Ref<SppgItem[]>) {
  const capacityOverview = computed(() => {
    let normal = 0
    let warning = 0
    let critical = 0

    sppgs.value.forEach(s => {
      if (s.status !== 'active') return

      const currentLoad = s.total_portions || 0
      const cap = s.capacity || 1
      const ratio = currentLoad / cap

      if (ratio >= 0.95) {
        critical++
      } else if (ratio >= 0.80) {
        warning++
      } else {
        normal++
      }
    })

    return { normal, warning, critical }
  })

  return {
    capacityOverview
  }
}

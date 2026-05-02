import { computed } from 'vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'

export function useAntiBosanChecker() {
  const menuStore = useMenuPlanningStore()

  const repeatedStatusMap = computed(() => {
    const days = menuStore.days
    const map: Record<number, boolean> = {}
    
    // Count occurrences of each menuId
    const counts: Record<number, number> = {}
    days.forEach(day => {
      if (day.menuId !== null) {
        counts[day.menuId] = (counts[day.menuId] || 0) + 1
      }
    })
    
    // Map each index to true if its menuId appears more than once
    days.forEach((day, idx) => {
      if (day.menuId !== null && (counts[day.menuId] || 0) > 1) {
        map[idx] = true
      } else {
        map[idx] = false
      }
    })
    
    return map
  })

  return { repeatedStatusMap }
}

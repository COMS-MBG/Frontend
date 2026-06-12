import { computed } from 'vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'

/**
 * Detects repeated recipe selections across the weekly menu plan.
 * Returns a map of dayIndex → boolean indicating repetition.
 */
export function useAntiBosanChecker() {
  const menuStore = useMenuPlanningStore()

  const repeatedStatusMap = computed(() => {
    const days = menuStore.editDays
    const map: Record<number, boolean> = {}

    // Count occurrences of each recipeId
    const counts: Record<number, number> = {}
    days.forEach(day => {
      if (day.recipeId !== null) {
        counts[day.recipeId] = (counts[day.recipeId] || 0) + 1
      }
    })

    // Map each index to true if its recipeId appears more than once
    days.forEach((day, idx) => {
      if (day.recipeId !== null && (counts[day.recipeId] || 0) > 1) {
        map[idx] = true
      } else {
        map[idx] = false
      }
    })

    return map
  })

  const hasRepetition = computed(() => {
    return Object.values(repeatedStatusMap.value).some(Boolean)
  })

  return { repeatedStatusMap, hasRepetition }
}

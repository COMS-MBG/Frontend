import { computed } from 'vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'
import { useResepStore } from '@/stores/resep.store'

export function useNutritionSummary() {
  const menuStore = useMenuPlanningStore()
  const resepStore = useResepStore()

  const summary = computed(() => {
    let totalKalori = 0
    let totalProtein = 0
    let totalKarbo = 0
    let totalLemak = 0

    const days = menuStore.days
    days.forEach(day => {
      if (day.menuId !== null) {
        const recipe = resepStore.getById(day.menuId)
        if (recipe) {
          totalKalori += recipe.kalori
          totalProtein += recipe.protein
          totalKarbo += recipe.karbohidrat
          totalLemak += recipe.lemak
        }
      }
    })

    return {
      totalKalori,
      totalProtein,
      totalKarbo,
      totalLemak
    }
  })

  return summary
}

import { computed } from 'vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'
import { useRecipeStore } from '@/stores/recipe.store'

/**
 * Computes the aggregate nutrition summary for all days in the current menu plan.
 * Uses recipeDropdown (non-paginated, all recipes) for reliable lookup.
 */
export function useNutritionSummary() {
  const menuStore = useMenuPlanningStore()
  const recipeStore = useRecipeStore()

  const summary = computed(() => {
    let totalKalori = 0
    let totalProtein = 0
    let totalKarbo = 0
    let totalLemak = 0

    const days = menuStore.editDays
    days.forEach(day => {
      if (day.recipeId !== null) {
        const recipe = recipeStore.recipeDropdown.find(r => r.id === day.recipeId)
        if (recipe) {
          totalKalori += recipe.totals.calorie
          totalProtein += recipe.totals.protein
          totalKarbo += recipe.totals.carbohydrate
          totalLemak += recipe.totals.fat
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

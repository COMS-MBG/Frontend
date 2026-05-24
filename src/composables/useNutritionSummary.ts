import { computed } from 'vue'
import { useMenuPlanningStore } from '@/stores/menuPlanning.store'
import { useRecipeStore } from '@/stores/recipe.store'

export function useNutritionSummary() {
  const menuStore = useMenuPlanningStore()
  const recipeStore = useRecipeStore()

  const summary = computed(() => {
    let totalKalori = 0
    let totalProtein = 0
    let totalKarbo = 0
    let totalLemak = 0

    const days = menuStore.days
    days.forEach(day => {
      if (day.menuId !== null) {
        const recipe = recipeStore.recipes.find(r => r.id === day.menuId)
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

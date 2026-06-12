import type { Ingredient } from '@/types/ingredient'
import type { BahanItemData, NutritionResult } from '@/types/gizi'

/**
 * Pure nutrition calculation — NO reactivity, NO side effects.
 *
 * Mirrors backend formula: Ingredient::calculateNutritionFor
 *   ratio = weight_used / serving_weight
 *   nutrient = base_nutrient × ratio (rounded to 2 decimal places)
 *
 * @param bahanList  - Array of ingredient rows from the recipe form
 * @param ingredients - Full ingredient data for lookup (from API/cache)
 * @returns NutritionResult with calories, protein, karbo, lemak
 */
export function calculateNutrition(
  bahanList: BahanItemData[],
  ingredients: Ingredient[],
): NutritionResult {
  let totalCalorie = 0
  let totalProtein = 0
  let totalCarbohydrate = 0
  let totalFat = 0

  for (const item of bahanList) {
    const ingredientId = Number(item.bahanId)
    const weightUsed = Number(item.gram)
    if (!ingredientId || !weightUsed || weightUsed <= 0) continue

    const ingredient = ingredients.find(i => i.id === ingredientId)
    if (!ingredient || ingredient.serving_weight <= 0) continue

    // EXACT formula from backend: Ingredient::calculateNutritionFor
    const ratio = weightUsed / ingredient.serving_weight

    totalCalorie      += Math.round(ingredient.calorie * ratio * 100) / 100
    totalProtein      += Math.round(ingredient.protein * ratio * 100) / 100
    totalCarbohydrate += Math.round(ingredient.carbohydrate * ratio * 100) / 100
    totalFat          += Math.round(ingredient.fat * ratio * 100) / 100
  }

  // Round totals to 2dp (same as backend array_map round)
  totalCalorie      = Math.round(totalCalorie * 100) / 100
  totalProtein      = Math.round(totalProtein * 100) / 100
  totalCarbohydrate = Math.round(totalCarbohydrate * 100) / 100
  totalFat          = Math.round(totalFat * 100) / 100

  // Calculate macro percentages (by calorie contribution)
  const totalMacroCal = (totalProtein * 4) + (totalCarbohydrate * 4) + (totalFat * 9)
  const proteinPercent = totalMacroCal > 0
    ? Math.round(((totalProtein * 4) / totalMacroCal) * 100) : 0
  const carboPercent = totalMacroCal > 0
    ? Math.round(((totalCarbohydrate * 4) / totalMacroCal) * 100) : 0
  const fatPercent = totalMacroCal > 0
    ? Math.round(((totalFat * 9) / totalMacroCal) * 100) : 0

  return {
    calories: totalCalorie,
    protein: { val: totalProtein, percent: proteinPercent },
    karbo: { val: totalCarbohydrate, percent: carboPercent },
    lemak: { val: totalFat, percent: fatPercent },
  }
}

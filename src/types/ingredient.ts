// ── Ingredient Types (matches IngredientResource.php) ──────

/** Nutrition values per gram — computed by backend */
export interface NutritionPerGram {
  calorie: number
  protein: number
  carbohydrate: number
  fat: number
}

/**
 * Full ingredient data shape returned by GET /api/admin-sppg/nutrition/ingredients.
 * Matches IngredientResource.php exactly.
 */
export interface Ingredient {
  id: number
  name: string
  carbohydrate: number
  protein: number
  calorie: number
  fat: number
  serving_weight: number
  description: string | null
  nutrition_per_gram: NutritionPerGram
  created_at: string | null
  updated_at: string | null
}

/**
 * Payload shape for creating/updating an ingredient.
 * Matches IngredientRequest validation rules.
 */
export interface IngredientForm {
  name: string
  carbohydrate: number
  protein: number
  calorie: number
  fat: number
  serving_weight: number
  description?: string
}

/**
 * API list response shape.
 * Backend wraps paginated data in { success, data, meta, message }.
 */
export interface IngredientListResponse {
  success: boolean
  message: string
  data: Ingredient[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

/**
 * Mutation response wrapper (store/update).
 * Shape: { success, message, data }.
 */
export interface IngredientMutationResponse {
  success: boolean
  message: string
  data: Ingredient
}

/** Simple success response for delete */
export interface IngredientDeleteResponse {
  success: boolean
  message: string
}

/** Dropdown option for recipe form selects */
export interface IngredientDropdownItem {
  id: number
  name: string
  calorie: number
  protein: number
  carbohydrate: number
  fat: number
  serving_weight: number
}

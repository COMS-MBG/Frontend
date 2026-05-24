// ── Recipe Types (matches RecipeResource.php + RecipeIngredientResource.php) ──

/** Nutrition contribution from a single ingredient in a recipe */
export interface RecipeIngredientContribution {
  calorie: number
  protein: number
  carbohydrate: number
  fat: number
}

/** Ingredient detail nested inside RecipeIngredient */
export interface RecipeIngredientDetail {
  id: number
  name: string
  serving_weight: number
}

/** Single ingredient row in a recipe (from RecipeIngredientResource) */
export interface RecipeIngredient {
  id: number
  order: number
  weight_used: number
  ingredient: RecipeIngredientDetail
  contribution: RecipeIngredientContribution
}

/** Nutrition targets set by the user */
export interface RecipeTargets {
  calorie: number
  protein: number
  carbohydrate: number
  fat: number
}

/** Computed nutrition totals */
export interface RecipeTotals {
  calorie: number
  protein: number
  carbohydrate: number
  fat: number
  weight: number
}

/** Achievement percentages */
export interface RecipeAchievement {
  calorie_percentage: number
}

/**
 * Full recipe data shape returned by GET /api/admin-sppg/nutrition/recipes.
 * Matches RecipeResource.php exactly.
 */
export interface Recipe {
  id: number
  name: string
  description: string | null
  targets: RecipeTargets
  totals: RecipeTotals
  achievement: RecipeAchievement
  ingredients: RecipeIngredient[]
  created_at: string | null
  updated_at: string | null
}

/** Ingredient entry in the create/update payload */
export interface RecipeIngredientPayload {
  ingredient_id: number
  weight_used: number
}

/**
 * Payload shape for creating/updating a recipe.
 * Matches RecipeRequest validation rules.
 */
export interface RecipeForm {
  name: string
  description?: string
  target_calorie?: number
  target_protein?: number
  target_carbohydrate?: number
  target_fat?: number
  ingredients: RecipeIngredientPayload[]
}

/** API list response shape */
export interface RecipeListResponse {
  success: boolean
  message: string
  data: Recipe[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

/** Mutation response wrapper (store/update) */
export interface RecipeMutationResponse {
  success: boolean
  message: string
  data: Recipe
}

/** Simple success response for delete */
export interface RecipeDeleteResponse {
  success: boolean
  message: string
}

/**
 * Simplified recipe item returned by the dropdown endpoint.
 * GET /api/admin-sppg/nutrition/recipes/dropdown
 */
export interface RecipeDropdownItem {
  id: number
  name: string
  totals: RecipeTotals
}

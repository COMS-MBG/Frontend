import api from '@/api/axios'
import type {
  IngredientListResponse,
  IngredientMutationResponse,
  IngredientDeleteResponse,
  IngredientForm,
  Ingredient,
} from '@/types/ingredient'

const BASE = '/admin-sppg/nutrition/ingredients'

/**
 * Fetch paginated ingredient list with optional filters.
 * GET /api/admin-sppg/nutrition/ingredients
 */
export async function getIngredients(params?: {
  page?: number
  per_page?: number
  search?: string
}): Promise<IngredientListResponse> {
  const { data } = await api.get<IngredientListResponse>(BASE, { params })
  return data
}

/**
 * Fetch a single ingredient by ID.
 * GET /api/admin-sppg/nutrition/ingredients/{id}
 */
export async function getIngredient(id: number): Promise<Ingredient> {
  const { data } = await api.get<{ success: boolean; data: Ingredient }>(`${BASE}/${id}`)
  return data.data
}

/**
 * Fetch all ingredients for dropdown (no pagination).
 * GET /api/admin-sppg/nutrition/ingredients/dropdown
 */
export async function getIngredientDropdown(): Promise<Ingredient[]> {
  const { data } = await api.get<{ success: boolean; data: Ingredient[] }>(`${BASE}/dropdown`)
  return data.data
}

/**
 * Create a new ingredient.
 * POST /api/admin-sppg/nutrition/ingredients
 */
export async function createIngredient(
  payload: IngredientForm,
): Promise<IngredientMutationResponse> {
  const { data } = await api.post<IngredientMutationResponse>(BASE, payload)
  return data
}

/**
 * Update an existing ingredient by ID.
 * PUT /api/admin-sppg/nutrition/ingredients/{id}
 */
export async function updateIngredient(
  id: number,
  payload: IngredientForm,
): Promise<IngredientMutationResponse> {
  const { data } = await api.put<IngredientMutationResponse>(`${BASE}/${id}`, payload)
  return data
}

/**
 * Delete an ingredient by ID.
 * DELETE /api/admin-sppg/nutrition/ingredients/{id}
 */
export async function deleteIngredient(id: number): Promise<IngredientDeleteResponse> {
  const { data } = await api.delete<IngredientDeleteResponse>(`${BASE}/${id}`)
  return data
}

/**
 * Calculate nutrition preview for a given ingredient + weight.
 * POST /api/admin-sppg/nutrition/ingredients/calculate-nutrition
 */
export async function calculateNutrition(
  ingredientId: number,
  weight: number,
): Promise<{ calorie: number; protein: number; carbohydrate: number; fat: number }> {
  const { data } = await api.post<{
    success: boolean
    data: { calorie: number; protein: number; carbohydrate: number; fat: number }
  }>(`${BASE}/calculate-nutrition`, {
    ingredient_id: ingredientId,
    weight,
  })
  return data.data
}

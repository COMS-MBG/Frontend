import api from '@/api/axios'
import type {
  RecipeListResponse,
  RecipeMutationResponse,
  RecipeDeleteResponse,
  RecipeForm,
  Recipe,
} from '@/types/recipe'

const BASE = '/admin-sppg/nutrition/recipes'

/**
 * Fetch paginated recipe list with optional filters.
 * GET /api/admin-sppg/nutrition/recipes
 */
export async function getRecipes(params?: {
  page?: number
  per_page?: number
  search?: string
}): Promise<RecipeListResponse> {
  const { data } = await api.get<RecipeListResponse>(BASE, { params })
  return data
}

/**
 * Fetch a single recipe by ID (with ingredients).
 * GET /api/admin-sppg/nutrition/recipes/{id}
 */
export async function getRecipe(id: number): Promise<Recipe> {
  const { data } = await api.get<{ success: boolean; data: Recipe }>(`${BASE}/${id}`)
  return data.data
}

/**
 * Fetch all recipes for dropdown (no pagination).
 * GET /api/admin-sppg/nutrition/recipes/dropdown
 */
export async function getRecipeDropdown(): Promise<Recipe[]> {
  const { data } = await api.get<{ success: boolean; data: Recipe[] }>(`${BASE}/dropdown`)
  return data.data
}

/**
 * Create a new recipe.
 * POST /api/admin-sppg/nutrition/recipes
 */
export async function createRecipe(
  payload: RecipeForm,
): Promise<RecipeMutationResponse> {
  const { data } = await api.post<RecipeMutationResponse>(BASE, payload)
  return data
}

/**
 * Update an existing recipe by ID.
 * PUT /api/admin-sppg/nutrition/recipes/{id}
 */
export async function updateRecipe(
  id: number,
  payload: RecipeForm,
): Promise<RecipeMutationResponse> {
  const { data } = await api.put<RecipeMutationResponse>(`${BASE}/${id}`, payload)
  return data
}

/**
 * Delete a recipe by ID.
 * DELETE /api/admin-sppg/nutrition/recipes/{id}
 */
export async function deleteRecipe(id: number): Promise<RecipeDeleteResponse> {
  const { data } = await api.delete<RecipeDeleteResponse>(`${BASE}/${id}`)
  return data
}
